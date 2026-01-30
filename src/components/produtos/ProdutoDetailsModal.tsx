import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Pencil, Save, Power, PowerOff, Package } from "lucide-react";

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

interface UnidadeDisponibilidade {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
  status: "active" | "inactive" | "pending";
}

interface ProdutoDetailsModalProps {
  produto: Produto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getUnidadesFromProduto = (produto: Produto): UnidadeDisponibilidade[] => [
  {
    id: "matriz",
    nome: "Matriz",
    preco: produto.preco,
    estoque: produto.estoque,
    status: produto.status,
  },
  {
    id: "filial-centro",
    nome: "Filial Centro",
    preco: produto.preco * 1.05,
    estoque: Math.floor(produto.estoque * 0.7),
    status: "active",
  },
  {
    id: "filial-norte",
    nome: "Filial Norte",
    preco: produto.preco,
    estoque: 0,
    status: "inactive",
  },
  {
    id: "filial-sul",
    nome: "Filial Sul",
    preco: produto.preco * 0.95,
    estoque: Math.floor(produto.estoque * 1.2),
    status: "active",
  },
];

export function ProdutoDetailsModal({
  produto,
  open,
  onOpenChange,
}: ProdutoDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showInactivateConfirm, setShowInactivateConfirm] = useState(false);
  const [showActivateConfirm, setShowActivateConfirm] = useState(false);
  const [unidades, setUnidades] = useState<UnidadeDisponibilidade[]>([]);
  const [editedUnidades, setEditedUnidades] = useState<UnidadeDisponibilidade[]>([]);

  useEffect(() => {
    if (produto) {
      const initialUnidades = getUnidadesFromProduto(produto);
      setUnidades(initialUnidades);
      setEditedUnidades(initialUnidades);
    }
  }, [produto]);

  if (!produto) return null;

  const currentUnidades = isEditing ? editedUnidades : unidades;

  const handleEdit = () => {
    setEditedUnidades([...unidades]);
    setIsEditing(true);
  };

  const handleSave = () => {
    setUnidades([...editedUnidades]);
    toast.success(`Produto "${produto.nome}" salvo com sucesso!`);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUnidades([...unidades]);
    setIsEditing(false);
  };

  const handleUnidadeChange = (
    unidadeId: string,
    field: keyof UnidadeDisponibilidade,
    value: number | string
  ) => {
    setEditedUnidades((prev) =>
      prev.map((u) =>
        u.id === unidadeId ? { ...u, [field]: value } : u
      )
    );
  };

  const handleToggleStatus = () => {
    if (produto.status === "active") {
      setShowInactivateConfirm(true);
    } else {
      setShowActivateConfirm(true);
    }
  };

  const handleConfirmActivate = () => {
    toast.success(`Produto "${produto.nome}" ativado com sucesso!`);
    setShowActivateConfirm(false);
    onOpenChange(false);
  };

  const handleConfirmInactivate = () => {
    toast.success(`Produto "${produto.nome}" inativado com sucesso!`);
    setShowInactivateConfirm(false);
    onOpenChange(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setIsEditing(false);
      setEditedUnidades([...unidades]);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="block">Detalhes do Produto</span>
              <span className="text-sm font-normal text-muted-foreground">
                {produto.sku}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto</Label>
              <p className="text-sm text-foreground font-medium">
                {produto.nome}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <p className="text-sm text-foreground">{produto.categoria}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <p className="text-sm text-muted-foreground">{produto.sku}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ean">EAN</Label>
              <p className="text-sm text-muted-foreground">{produto.ean}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Produto Controlado</Label>
            <p className={`text-sm font-medium ${produto.controlado ? "text-amber-600" : "text-foreground"}`}>
              {produto.controlado ? "Sim" : "Não"}
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Disponibilidade por Unidade</Label>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Unidade</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Preço</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Estoque</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {currentUnidades.map((unidade) => (
                    <tr key={unidade.id}>
                      <td className="px-3 py-2 font-medium text-foreground">
                        {unidade.nome}
                      </td>
                      <td className="px-3 py-2">
                        {isEditing ? (
                          <Input
                            type="number"
                            step="0.01"
                            className="h-8 w-24"
                            value={unidade.preco}
                            onChange={(e) =>
                              handleUnidadeChange(
                                unidade.id,
                                "preco",
                                parseFloat(e.target.value) || 0
                              )
                            }
                          />
                        ) : (
                          <span className="text-primary font-medium">
                            {unidade.preco.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {isEditing ? (
                          <Input
                            type="number"
                            className="h-8 w-20"
                            value={unidade.estoque}
                            onChange={(e) =>
                              handleUnidadeChange(
                                unidade.id,
                                "estoque",
                                parseInt(e.target.value) || 0
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant={produto.status === "active" ? "outline" : "default"}
                onClick={handleToggleStatus}
                className="sm:mr-auto"
              >
                {produto.status === "active" ? (
                  <>
                    <PowerOff className="w-4 h-4 mr-2" />
                    Inativar
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4 mr-2" />
                    Ativar
                  </>
                )}
              </Button>
              <Button onClick={handleEdit}>
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>

      <AlertDialog open={showInactivateConfirm} onOpenChange={setShowInactivateConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar inativação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja inativar o produto "{produto.nome}"? 
              Esta ação pode ser revertida posteriormente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmInactivate}>
              Inativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showActivateConfirm} onOpenChange={setShowActivateConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar ativação</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja ativar o produto "{produto.nome}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmActivate}>
              Ativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
