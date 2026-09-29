import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageLoading } from "@/hooks/usePageLoading";
import { PageLoading } from "@/components/layout/PageLoading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Clock, Pencil, Trash2, Save, X, Building2, Truck, Plus, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { managerBackendBff } from "@/services/ManagerBackendBff";
import {
  AreaEntrega,
  HorarioFuncionamento,
  MerchantDetailsApiResponse,
  Unidade,
  createEmptyUnidade,
  toMerchantPayload,
  toUnidade,
} from "@/types/merchant";

interface PostalCodeResponse {
  fullAddress?: string | null;
  FullAddress?: string | null;
  data?: PostalCodeResponse | null;
  Data?: PostalCodeResponse | null;
}

function cloneUnidade(unidade: Unidade): Unidade {
  return {
    ...unidade,
    horarios: unidade.horarios.map((horario) => ({ ...horario })),
    areasEntrega: unidade.areasEntrega.map((area) => ({ ...area })),
    convenios: unidade.convenios.map((convenio) => ({ ...convenio })),
  };
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parseCurrencyInput(value: string): number {
  const digits = value.replace(/\D/g, "");
  return digits ? Number(digits) / 100 : 0;
}

function normalizeCnpjAlphanumeric(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 14);
}

function formatCnpjAlphanumeric(value: string): string {
  const normalized = normalizeCnpjAlphanumeric(value);
  const parts = [
    normalized.slice(0, 2),
    normalized.slice(2, 5),
    normalized.slice(5, 8),
    normalized.slice(8, 12),
    normalized.slice(12, 14),
  ].filter(Boolean);

  let formatted = parts[0] ?? "";
  if (parts[1]) formatted += `.${parts[1]}`;
  if (parts[2]) formatted += `.${parts[2]}`;
  if (parts[3]) formatted += `/${parts[3]}`;
  if (parts[4]) formatted += `-${parts[4]}`;

  return formatted;
}

function normalizeCep(value: string): string {
  return value.replace(/\D/g, "").slice(0, 8);
}

function formatCep(value: string): string {
  const normalized = normalizeCep(value);
  if (normalized.length <= 5) return normalized;
  return `${normalized.slice(0, 5)}-${normalized.slice(5)}`;
}

function getPostalCodeFullAddress(response?: PostalCodeResponse | null): string {
  return (
    response?.fullAddress ??
    response?.FullAddress ??
    response?.data?.fullAddress ??
    response?.data?.FullAddress ??
    response?.Data?.fullAddress ??
    response?.Data?.FullAddress ??
    ""
  );
}

export default function UnidadeDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isPageLoading = usePageLoading();
  const isCreating = id === "novo";

  const [unidade, setUnidade] = useState<Unidade | null>(null);
  const [editedUnidade, setEditedUnidade] = useState<Unidade | null>(null);
  const [isEditing, setIsEditing] = useState(isCreating);
  const [isLoadingUnidade, setIsLoadingUnidade] = useState(!isCreating);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [novaArea, setNovaArea] = useState<Omit<AreaEntrega, "id">>({
    raio: 0,
    compraMinima: 0,
    preco: 0,
    tempo: 0,
  });
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [validatedCep, setValidatedCep] = useState<string | null>(null);
  const [invalidCep, setInvalidCep] = useState<string | null>(null);
  const [deleteAreaConfirmOpen, setDeleteAreaConfirmOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<string | null>(null);

  usePageTitle(
    isCreating
      ? "Nova unidade"
      : unidade
        ? `Unidade - ${unidade.nome}`
        : "Unidade",
  );

  useEffect(() => {
    let cancelled = false;

    const fetchUnidade = async () => {
      if (isCreating) {
        const emptyUnidade = createEmptyUnidade();
        setUnidade(emptyUnidade);
        setEditedUnidade(cloneUnidade(emptyUnidade));
        setIsEditing(true);
        setIsLoadingUnidade(false);
        return;
      }

      if (!id) {
        setIsLoadingUnidade(false);
        return;
      }

      setIsLoadingUnidade(true);
      const response = await managerBackendBff.get<MerchantDetailsApiResponse>(
        `/v1/Merchants/${encodeURIComponent(id)}`,
      );

      if (cancelled) return;

      if (response.data) {
        const mappedUnidade = toUnidade(response.data);
        setUnidade(mappedUnidade);
        setEditedUnidade(cloneUnidade(mappedUnidade));
      } else {
        setUnidade(null);
        setEditedUnidade(null);
        toast.error(`Erro ao carregar unidade: ${response.error ?? "Tente novamente."}`);
      }

      setIsLoadingUnidade(false);
    };

    fetchUnidade();

    return () => {
      cancelled = true;
    };
  }, [id, isCreating]);

  useEffect(() => {
    if (!isEditing || !editedUnidade) return;

    const cep = normalizeCep(editedUnidade.cep);

    if (!cep) {
      setIsLoadingCep(false);
      setValidatedCep(null);
      setInvalidCep(null);
      return;
    }

    if (cep.length < 8) {
      setIsLoadingCep(false);
      setValidatedCep(null);
      setInvalidCep(null);
      return;
    }

    if (cep === validatedCep || cep === invalidCep) return;

    let cancelled = false;

    const fetchPostalCode = async () => {
      setIsLoadingCep(true);
      const response = await managerBackendBff.get<PostalCodeResponse>(
        "/v1/Merchants/postalcode",
        { params: { postalCode: cep } },
      );

      if (cancelled) return;

      const fullAddress = getPostalCodeFullAddress(response.data);
      if (!response.error && fullAddress.trim()) {
        setEditedUnidade((currentUnidade) =>
          currentUnidade && normalizeCep(currentUnidade.cep) === cep
            ? { ...currentUnidade, endereco: fullAddress.trim() }
            : currentUnidade,
        );
        setValidatedCep(cep);
        setInvalidCep(null);
      } else {
        setValidatedCep(null);
        setInvalidCep(cep);
        toast.error("CEP não encontrado. Informe um CEP válido.");
      }

      setIsLoadingCep(false);
    };

    fetchPostalCode();

    return () => {
      cancelled = true;
    };
  }, [editedUnidade?.cep, invalidCep, isEditing, validatedCep]);

  if (isPageLoading || isLoadingUnidade) {
    return (
      <MainLayout>
        <PageLoading />
      </MainLayout>
    );
  }

  if (!unidade || !editedUnidade) {
    return (
      <MainLayout>
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Unidade não encontrada
          </h1>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground">A unidade solicitada não foi encontrada.</p>
          <Button className="mt-4" onClick={() => navigate("/configuracoes/unidades")}>
            Voltar para Configurações
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleSave = async () => {
    if (!editedUnidade.nome.trim()) {
      toast.error("Informe o nome da unidade.");
      return;
    }

    const cep = normalizeCep(editedUnidade.cep);
    if (cep && cep.length < 8) {
      toast.error("Informe um CEP válido.");
      return;
    }

    if (isLoadingCep) {
      toast.error("Aguarde a validação do CEP.");
      return;
    }

    if (cep && validatedCep !== cep) {
      toast.error("Informe um CEP válido.");
      return;
    }

    setIsSaving(true);
    const payload = toMerchantPayload(editedUnidade);
    const response = isCreating
      ? await managerBackendBff.post<unknown>("/v1/Merchants", payload)
      : await managerBackendBff.put<unknown>(
          `/v1/Merchants/${encodeURIComponent(editedUnidade.id)}`,
          payload,
        );

    if (response.error) {
      toast.error(`Erro ao ${isCreating ? "cadastrar" : "atualizar"} unidade: ${response.error}`);
      setIsSaving(false);
      return;
    }

    toast.success(`Unidade ${isCreating ? "cadastrada" : "atualizada"} com sucesso.`);

    if (isCreating) {
      navigate("/configuracoes/unidades");
      return;
    }

    const detailsResponse = await managerBackendBff.get<MerchantDetailsApiResponse>(
      `/v1/Merchants/${encodeURIComponent(editedUnidade.id)}`,
    );

    if (detailsResponse.data) {
      const mappedUnidade = toUnidade(detailsResponse.data);
      setUnidade(mappedUnidade);
      setEditedUnidade(cloneUnidade(mappedUnidade));
    } else {
      setUnidade(cloneUnidade(editedUnidade));
    }

    setIsEditing(false);
    setEditingAreaId(null);
    setIsSaving(false);
  };

  const handleCancel = () => {
    if (isCreating) {
      navigate("/configuracoes/unidades");
      return;
    }

    setEditedUnidade(cloneUnidade(unidade));
    setIsEditing(false);
    setEditingAreaId(null);
  };

  const handleDelete = async () => {
    if (!unidade.id) return;

    setIsDeleting(true);
    const response = await managerBackendBff.delete<unknown>(
      `/v1/Merchants/${encodeURIComponent(unidade.id)}`,
    );

    if (response.error) {
      toast.error(`Erro ao excluir unidade: ${response.error}`);
      setIsDeleting(false);
      return;
    }

    toast.success("Unidade excluída com sucesso.");
    setDeleteConfirmOpen(false);
    navigate("/configuracoes/unidades");
  };

  const handleHorarioChange = (
    index: number,
    field: keyof HorarioFuncionamento,
    value: string | boolean,
  ) => {
    const newHorarios = [...editedUnidade.horarios];
    newHorarios[index] = { ...newHorarios[index], [field]: value };
    setEditedUnidade({ ...editedUnidade, horarios: newHorarios });
  };

  const handleAddArea = () => {
    if (novaArea.raio <= 0) {
      toast.error("Informe um raio válido.");
      return;
    }

    const newArea: AreaEntrega = {
      id: Date.now().toString(),
      ...novaArea,
    };
    setEditedUnidade({
      ...editedUnidade,
      areasEntrega: [...editedUnidade.areasEntrega, newArea],
    });
    setNovaArea({ raio: 0, compraMinima: 0, preco: 0, tempo: 0 });
    toast.success("Área de entrega adicionada.");
  };

  const handleUpdateArea = (areaId: string, field: keyof Omit<AreaEntrega, "id">, value: number) => {
    setEditedUnidade({
      ...editedUnidade,
      areasEntrega: editedUnidade.areasEntrega.map((area) =>
        area.id === areaId ? { ...area, [field]: value } : area,
      ),
    });
  };

  const handleDeleteArea = (areaId: string) => {
    setAreaToDelete(areaId);
    setDeleteAreaConfirmOpen(true);
  };

  const confirmDeleteArea = () => {
    if (areaToDelete) {
      setEditedUnidade({
        ...editedUnidade,
        areasEntrega: editedUnidade.areasEntrega.filter((area) => area.id !== areaToDelete),
      });
      toast.success("Área de entrega removida.");
    }
    setDeleteAreaConfirmOpen(false);
    setAreaToDelete(null);
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          {isCreating ? "Nova unidade" : editedUnidade.nome}
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant={editedUnidade.situacao === "aberta" ? "default" : "secondary"}>
            {editedUnidade.situacao === "aberta" ? "Aberta" : "Fechada"}
          </Badge>
          <Badge variant={editedUnidade.status === "ativa" ? "default" : "secondary"}>
            {editedUnidade.status === "ativa" ? "Ativa" : "Inativa"}
          </Badge>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-6">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground">Detalhes da unidade</h4>
              {isEditing ? (
                <div className="space-y-3 mt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Nome da unidade</Label>
                      <Input
                        value={editedUnidade.nome}
                        onChange={(event) =>
                          setEditedUnidade({ ...editedUnidade, nome: event.target.value })
                        }
                        className="bg-white dark:bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Documento</Label>
                      <Input
                        value={formatCnpjAlphanumeric(editedUnidade.documento)}
                        onChange={(event) =>
                          setEditedUnidade({
                            ...editedUnidade,
                            documento: normalizeCnpjAlphanumeric(event.target.value),
                          })
                        }
                        maxLength={18}
                        className="bg-white dark:bg-background"
                        placeholder="XX.XXX.XXX/XXXX-XX"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Situação</Label>
                      <Select
                        value={editedUnidade.situacao}
                        onValueChange={(value: "aberta" | "fechada") =>
                          setEditedUnidade({ ...editedUnidade, situacao: value })
                        }
                      >
                        <SelectTrigger className="bg-white dark:bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aberta">Aberta</SelectItem>
                          <SelectItem value="fechada">Fechada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Status</Label>
                      <Select
                        value={editedUnidade.status}
                        onValueChange={(value: "ativa" | "inativa") =>
                          setEditedUnidade({ ...editedUnidade, status: value })
                        }
                      >
                        <SelectTrigger className="bg-white dark:bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ativa">Ativa</SelectItem>
                          <SelectItem value="inativa">Inativa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 mt-1">
                  <p className="text-sm text-muted-foreground">
                    Documento: {editedUnidade.documento ? formatCnpjAlphanumeric(editedUnidade.documento) : "Não informado"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Situação: {editedUnidade.situacao === "aberta" ? "Aberta" : "Fechada"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: {editedUnidade.status === "ativa" ? "Ativa" : "Inativa"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground">Endereço</h4>
              {isEditing ? (
                <div className="space-y-3 mt-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">CEP</Label>
                      <Input
                        value={formatCep(editedUnidade.cep)}
                        onChange={(event) =>
                          setEditedUnidade({ ...editedUnidade, cep: normalizeCep(event.target.value) })
                        }
                        inputMode="numeric"
                        maxLength={9}
                        placeholder="00000-000"
                        className="bg-white dark:bg-background"
                      />
                      {isLoadingCep && (
                        <p className="text-xs text-muted-foreground">Consultando CEP...</p>
                      )}
                      {invalidCep === normalizeCep(editedUnidade.cep) && (
                        <p className="text-xs text-destructive">Informe um CEP válido.</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Número</Label>
                      <Input
                        value={editedUnidade.numero}
                        onChange={(event) =>
                          setEditedUnidade({ ...editedUnidade, numero: event.target.value })
                        }
                        placeholder="123"
                        className="bg-white dark:bg-background"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Logradouro</Label>
                    <Input
                      value={editedUnidade.endereco}
                      readOnly
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">CEP: {editedUnidade.cep ? formatCep(editedUnidade.cep) : "Não informado"}</p>
                  <p className="text-sm text-muted-foreground">
                    {editedUnidade.endereco || "Endereço não informado"}
                    {editedUnidade.numero ? `, ${editedUnidade.numero}` : ""}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground mb-3">
                Horários de funcionamento
              </h4>
              <div className="space-y-2">
                {editedUnidade.horarios.map((horario, index) => (
                  <div
                    key={horario.dayOfWeek}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0 gap-4"
                  >
                    <span className="text-sm font-medium text-foreground min-w-[120px]">
                      {horario.dia}
                    </span>
                    {isEditing ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={horario.aberto}
                            onCheckedChange={(checked) =>
                              handleHorarioChange(index, "aberto", checked)
                            }
                          />
                          <span className="text-xs text-muted-foreground">
                            {horario.aberto ? "Aberto" : "Fechado"}
                          </span>
                        </div>
                        {horario.aberto && (
                          <div className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={horario.abertura}
                              onChange={(event) =>
                                handleHorarioChange(index, "abertura", event.target.value)
                              }
                              className="h-8 w-24 bg-white dark:bg-background"
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                              type="time"
                              value={horario.fechamento}
                              onChange={(event) =>
                                handleHorarioChange(index, "fechamento", event.target.value)
                              }
                              className="h-8 w-24 bg-white dark:bg-background"
                            />
                          </div>
                        )}
                      </div>
                    ) : horario.aberto ? (
                      <span className="text-sm text-muted-foreground">
                        {horario.abertura} - {horario.fechamento}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Fechado</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground mb-3">Entrega</h4>

              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Raio (km)</TableHead>
                      <TableHead>Compra Mínima</TableHead>
                      <TableHead>Preço da Entrega</TableHead>
                      <TableHead>Tempo (min)</TableHead>
                      {isEditing && <TableHead className="w-[80px]">Ações</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editedUnidade.areasEntrega.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isEditing ? 5 : 4} className="text-center text-muted-foreground py-4">
                          Nenhuma área de entrega cadastrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      editedUnidade.areasEntrega.map((area) => (
                        <TableRow key={area.id}>
                          <TableCell>
                            {isEditing && editingAreaId === area.id ? (
                              <Input
                                type="number"
                                value={area.raio}
                                onChange={(event) => handleUpdateArea(area.id, "raio", Number(event.target.value))}
                                className="h-8 w-20 bg-white dark:bg-background"
                                min={0}
                              />
                            ) : (
                              <span
                                className={isEditing ? "cursor-pointer hover:text-primary" : ""}
                                onClick={() => isEditing && setEditingAreaId(area.id)}
                              >
                                {area.raio} km
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing && editingAreaId === area.id ? (
                              <Input
                                inputMode="numeric"
                                value={formatCurrency(area.compraMinima)}
                                onChange={(event) => handleUpdateArea(area.id, "compraMinima", parseCurrencyInput(event.target.value))}
                                className="h-8 w-32 bg-white dark:bg-background"
                              />
                            ) : (
                              <span
                                className={isEditing ? "cursor-pointer hover:text-primary" : ""}
                                onClick={() => isEditing && setEditingAreaId(area.id)}
                              >
                                {formatCurrency(area.compraMinima)}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing && editingAreaId === area.id ? (
                              <Input
                                inputMode="numeric"
                                value={formatCurrency(area.preco)}
                                onChange={(event) => handleUpdateArea(area.id, "preco", parseCurrencyInput(event.target.value))}
                                className="h-8 w-32 bg-white dark:bg-background"
                              />
                            ) : (
                              <span
                                className={isEditing ? "cursor-pointer hover:text-primary" : ""}
                                onClick={() => isEditing && setEditingAreaId(area.id)}
                              >
                                {formatCurrency(area.preco)}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing && editingAreaId === area.id ? (
                              <Input
                                type="number"
                                value={area.tempo}
                                onChange={(event) => handleUpdateArea(area.id, "tempo", Number(event.target.value))}
                                className="h-8 w-20 bg-white dark:bg-background"
                                min={0}
                              />
                            ) : (
                              <span
                                className={isEditing ? "cursor-pointer hover:text-primary" : ""}
                                onClick={() => isEditing && setEditingAreaId(area.id)}
                              >
                                {area.tempo} min
                              </span>
                            )}
                          </TableCell>
                          {isEditing && (
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteArea(area.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {isEditing && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h5 className="text-sm font-medium text-foreground mb-3">Adicionar nova área</h5>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                    <div className="space-y-1">
                      <Label className="text-xs">Raio (km)</Label>
                      <Input
                        type="number"
                        value={novaArea.raio || ""}
                        onChange={(event) => setNovaArea({ ...novaArea, raio: Number(event.target.value) })}
                        placeholder="0"
                        min={0}
                        className="bg-white dark:bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Compra Mínima (R$)</Label>
                      <Input
                        inputMode="numeric"
                        value={novaArea.compraMinima ? formatCurrency(novaArea.compraMinima) : ""}
                        onChange={(event) => setNovaArea({ ...novaArea, compraMinima: parseCurrencyInput(event.target.value) })}
                        placeholder="R$ 0,00"
                        className="bg-white dark:bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Preço da Entrega (R$)</Label>
                      <Input
                        inputMode="numeric"
                        value={novaArea.preco ? formatCurrency(novaArea.preco) : ""}
                        onChange={(event) => setNovaArea({ ...novaArea, preco: parseCurrencyInput(event.target.value) })}
                        placeholder="R$ 0,00"
                        className="bg-white dark:bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Tempo (min)</Label>
                      <Input
                        type="number"
                        value={novaArea.tempo || ""}
                        onChange={(event) => setNovaArea({ ...novaArea, tempo: Number(event.target.value) })}
                        placeholder="0"
                        min={0}
                        className="bg-white dark:bg-background"
                      />
                    </div>
                    <Button onClick={handleAddArea} size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          {!isCreating ? (
            <Button variant="destructive" onClick={() => setDeleteConfirmOpen(true)} disabled={isSaving || isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Excluir
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Salvar
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" onClick={() => navigate("/configuracoes/unidades")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir unidade</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a unidade "{unidade.nome}"? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteAreaConfirmOpen} onOpenChange={setDeleteAreaConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir área de entrega</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta área de entrega? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAreaToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDeleteArea}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
