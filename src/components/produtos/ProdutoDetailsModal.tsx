import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Pencil, Save, Package, Loader2 } from "lucide-react";
import { managerBackendBff } from "@/services/ManagerBackendBff";

interface Produto {
  id: string;
  nome: string;
  sku: string;
  ean: string;
  categoria: string;
  preco: number;
  estoque: number;
  status: "active" | "inactive" | "pending";
  controlado: boolean;
}

interface Merchant {
  id: string;
  name?: string;
}

interface ProdutoApiAvailability {
  merchantId?: string;
  MerchantId?: string;
  merchantName?: string | null;
  MerchantName?: string | null;
  originalPrice?: number;
  OriginalPrice?: number;
  price?: number;
  Price?: number;
  inventory?: number;
  Inventory?: number;
  active?: boolean;
  Active?: boolean;
  featured?: boolean;
  Featured?: boolean;
}

interface ProdutoDetailsApi {
  id?: string;
  Id?: string;
  externalCode?: string | null;
  ExternalCode?: string | null;
  categoryName?: string | null;
  CategoryName?: string | null;
  restricted?: boolean | null;
  Restricted?: boolean | null;
  availabilities?: ProdutoApiAvailability[];
  Availabilities?: ProdutoApiAvailability[];
}

interface UnidadeDisponibilidade {
  id: string;
  nome: string;
  precoOriginal: number;
  preco: number;
  estoque: number;
  status: "active" | "inactive";
  destaque: boolean;
}

interface ProdutoDetailsModalProps {
  produto: Produto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  merchants: Merchant[];
}

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const parseCurrencyInput = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) / 100 : 0;
};

const toNumber = (value: number | undefined) =>
  typeof value === "number" && Number.isFinite(value) ? value : 0;

const getAvailabilityMerchantId = (availability: ProdutoApiAvailability) =>
  availability.merchantId ?? availability.MerchantId ?? "";

const mapAvailability = (
  availability: ProdutoApiAvailability,
  merchantName?: string
): UnidadeDisponibilidade => ({
  id: getAvailabilityMerchantId(availability),
  nome:
    availability.merchantName ??
    availability.MerchantName ??
    merchantName ??
    "Unidade não informada",
  precoOriginal: toNumber(availability.originalPrice ?? availability.OriginalPrice),
  preco: toNumber(availability.price ?? availability.Price),
  estoque: toNumber(availability.inventory ?? availability.Inventory),
  status: (availability.active ?? availability.Active) ? "active" : "inactive",
  destaque: availability.featured ?? availability.Featured ?? false,
});

const mergeAvailabilitiesWithMerchants = (
  availabilities: ProdutoApiAvailability[],
  merchants: Merchant[]
) => {
  const byMerchantId = new Map(
    availabilities
      .map((availability) => [getAvailabilityMerchantId(availability), availability] as const)
      .filter(([merchantId]) => merchantId)
  );

  if (merchants.length === 0) {
    return availabilities.map((availability) => mapAvailability(availability));
  }

  return merchants.map((merchant) => {
    const availability = byMerchantId.get(merchant.id);
    return availability
      ? mapAvailability(availability, merchant.name)
      : {
          id: merchant.id,
          nome: merchant.name ?? "Unidade não informada",
          precoOriginal: 0,
          preco: 0,
          estoque: 0,
          status: "inactive" as const,
          destaque: false,
        };
  });
};

export function ProdutoDetailsModal({
  produto,
  open,
  onOpenChange,
  merchants,
}: ProdutoDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [produtoDetails, setProdutoDetails] = useState<ProdutoDetailsApi | null>(null);
  const [unidades, setUnidades] = useState<UnidadeDisponibilidade[]>([]);
  const [editedUnidades, setEditedUnidades] = useState<UnidadeDisponibilidade[]>([]);

  const currentUnidades = isEditing ? editedUnidades : unidades;
  const detailsExternalCode = produtoDetails?.externalCode ?? produtoDetails?.ExternalCode;
  const detailsCategoryName = produtoDetails?.categoryName ?? produtoDetails?.CategoryName;
  const detailsRestricted = produtoDetails?.restricted ?? produtoDetails?.Restricted;
  const merchantNameById = useMemo(
    () => new Map(merchants.map((merchant) => [merchant.id, merchant.name])),
    [merchants]
  );

  useEffect(() => {
    if (!open || !produto) return;

    let ignore = false;

    const fetchProduto = async () => {
      setLoading(true);
      setIsEditing(false);

      const response = await managerBackendBff.get<ProdutoDetailsApi>(
        `/v1/Products/${produto.id}`
      );

      if (ignore) return;

      if (response.data) {
        const availabilities =
          response.data.availabilities ?? response.data.Availabilities ?? [];
        const nextUnidades = mergeAvailabilitiesWithMerchants(availabilities, merchants);

        setProdutoDetails(response.data);
        setUnidades(nextUnidades);
        setEditedUnidades(nextUnidades);
      } else if (response.error) {
        toast.error("Erro ao carregar produto: " + response.error);
        setProdutoDetails(null);
        setUnidades([]);
        setEditedUnidades([]);
      }

      setLoading(false);
    };

    fetchProduto();

    return () => {
      ignore = true;
    };
  }, [open, produto, merchants]);

  if (!produto) return null;

  const handleEdit = () => {
    setEditedUnidades(unidades.map((unidade) => ({ ...unidade })));
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);

    const response = await managerBackendBff.patch<null>(`/v1/Products/${produto.id}`, {
      availabilities: editedUnidades.map((unidade) => ({
        merchantId: unidade.id,
        originalPrice: unidade.precoOriginal,
        price: unidade.preco,
        inventory: unidade.estoque,
        active: unidade.status === "active",
        featured: unidade.destaque,
      })),
    });

    setSaving(false);

    if (response.error) {
      toast.error("Erro ao salvar produto: " + response.error);
      return;
    }

    const nextUnidades = editedUnidades.map((unidade) => ({ ...unidade }));
    setUnidades(nextUnidades);
    setEditedUnidades(nextUnidades);
    toast.success(`Produto "${produto.nome}" salvo com sucesso!`);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUnidades(unidades.map((unidade) => ({ ...unidade })));
    setIsEditing(false);
  };

  const handleUnidadeChange = (
    unidadeId: string,
    field: keyof UnidadeDisponibilidade,
    value: number | string | boolean
  ) => {
    setEditedUnidades((prev) =>
      prev.map((u) => (u.id === unidadeId ? { ...u, [field]: value } : u))
    );
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setIsEditing(false);
      setEditedUnidades(unidades.map((unidade) => ({ ...unidade })));
    }
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[780px] max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="block">Detalhes do Produto</span>
              <span className="text-sm font-normal text-muted-foreground">
                {detailsExternalCode ?? produto.sku}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto</Label>
              <p className="text-sm text-foreground font-medium">
                {produto.nome}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <p className="text-sm text-foreground">
                {detailsCategoryName ?? produto.categoria}
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <p className="text-sm text-muted-foreground">
                {(detailsExternalCode ?? produto.sku) || "Não informado"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ean">EAN</Label>
              <p className="text-sm text-muted-foreground">
                {produto.ean || "Não informado"}
              </p>
            </div>

            <div className="space-y-2">
              <Label>Produto Controlado</Label>
              <p
                className={`text-sm font-medium ${
                  detailsRestricted ?? produto.controlado
                    ? "text-amber-600"
                    : "text-foreground"
                }`}
              >
                {detailsRestricted ?? produto.controlado ? "Sim" : "Não"}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Disponibilidade por Unidade</Label>
            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full min-w-[680px] text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Unidade</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Preço original</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Preço</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Estoque</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Destaque</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {loading ? (
                    Array.from({ length: Math.max(merchants.length, 3) }).map((_, index) => (
                      <tr key={`produto-loading-${index}`}>
                        <td className="px-3 py-3"><Skeleton className="h-5 w-36" /></td>
                        <td className="px-3 py-3"><Skeleton className="h-8 w-24" /></td>
                        <td className="px-3 py-3"><Skeleton className="h-8 w-24" /></td>
                        <td className="px-3 py-3"><Skeleton className="h-8 w-20" /></td>
                        <td className="px-3 py-3"><Skeleton className="h-4 w-4" /></td>
                        <td className="px-3 py-3"><Skeleton className="h-6 w-16" /></td>
                      </tr>
                    ))
                  ) : currentUnidades.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                        Nenhuma unidade disponível para edição
                      </td>
                    </tr>
                  ) : (
                    currentUnidades.map((unidade) => (
                      <tr key={unidade.id}>
                        <td className="px-3 py-2 font-medium text-foreground">
                          {unidade.nome || merchantNameById.get(unidade.id) || "Unidade não informada"}
                        </td>
                        <td className="px-3 py-2">
                          {isEditing ? (
                            <Input
                              type="text"
                              inputMode="decimal"
                              className="h-8 w-32"
                              value={formatCurrency(unidade.precoOriginal)}
                              onChange={(e) =>
                                handleUnidadeChange(
                                  unidade.id,
                                  "precoOriginal",
                                  parseCurrencyInput(e.target.value)
                                )
                              }
                            />
                          ) : (
                            <span className="text-muted-foreground">
                              {formatCurrency(unidade.precoOriginal)}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {isEditing ? (
                            <Input
                              type="text"
                              inputMode="decimal"
                              className="h-8 w-32"
                              value={formatCurrency(unidade.preco)}
                              onChange={(e) =>
                                handleUnidadeChange(
                                  unidade.id,
                                  "preco",
                                  parseCurrencyInput(e.target.value)
                                )
                              }
                            />
                          ) : (
                            <span className="text-primary font-medium">
                              {formatCurrency(unidade.preco)}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {isEditing ? (
                            <Input
                              type="number"
                              min="0"
                              className="h-8 w-20"
                              value={unidade.estoque}
                              onChange={(e) =>
                                handleUnidadeChange(
                                  unidade.id,
                                  "estoque",
                                  parseInt(e.target.value, 10) || 0
                                )
                              }
                            />
                          ) : (
                            <span
                              className={`font-medium ${
                                unidade.estoque === 0
                                  ? "text-destructive"
                                  : "text-foreground"
                              }`}
                            >
                              {unidade.estoque}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {isEditing ? (
                            <Checkbox
                              checked={unidade.destaque}
                              onCheckedChange={(checked) =>
                                handleUnidadeChange(
                                  unidade.id,
                                  "destaque",
                                  checked === true
                                )
                              }
                            />
                          ) : (
                            <span className="text-muted-foreground">
                              {unidade.destaque ? "Sim" : "Não"}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {isEditing ? (
                            <Switch
                              checked={unidade.status === "active"}
                              onCheckedChange={(checked) =>
                                handleUnidadeChange(
                                  unidade.id,
                                  "status",
                                  checked ? "active" : "inactive"
                                )
                              }
                            />
                          ) : (
                            <StatusBadge status={unidade.status} />
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-4 border-t">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving || loading}>
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit} disabled={loading}>
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
