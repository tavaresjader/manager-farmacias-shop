import { useState } from "react";
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

interface ProdutoDetailsModalProps {
  produto: Produto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProdutoDetailsModal({
  produto,
  open,
  onOpenChange,
}: ProdutoDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduto, setEditedProduto] = useState<Produto | null>(null);
  const [showInactivateConfirm, setShowInactivateConfirm] = useState(false);

  if (!produto) return null;

  const currentProduto = isEditing && editedProduto ? editedProduto : produto;

  const handleEdit = () => {
    setEditedProduto({ ...produto });
    setIsEditing(true);
  };

  const handleSave = () => {
    toast.success(`Produto "${currentProduto.nome}" salvo com sucesso!`);
    setIsEditing(false);
    setEditedProduto(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProduto(null);
  };

  const handleToggleStatus = () => {
    if (produto.status === "active") {
      setShowInactivateConfirm(true);
    } else {
      toast.success(`Produto "${produto.nome}" ativado com sucesso!`);
      onOpenChange(false);
    }
  };

  const handleConfirmInactivate = () => {
    toast.success(`Produto "${produto.nome}" inativado com sucesso!`);
    setShowInactivateConfirm(false);
    onOpenChange(false);
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setIsEditing(false);
      setEditedProduto(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px]">
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
                {currentProduto.nome}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              <p className="text-sm text-foreground">{currentProduto.categoria}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <p className="text-sm text-muted-foreground">{currentProduto.sku}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ean">EAN</Label>
              <p className="text-sm text-muted-foreground">{currentProduto.ean}</p>
            </div>
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
                  <tr>
                    <td className="px-3 py-2 font-medium text-foreground">Matriz</td>
                    <td className="px-3 py-2">
                      <span className="text-primary font-medium">
                        {currentProduto.preco.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`font-medium ${
                          currentProduto.estoque === 0
                            ? "text-destructive"
                            : "text-foreground"
                        }`}
                      >
                        {currentProduto.estoque}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status={currentProduto.status} />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-foreground">Filial Centro</td>
                    <td className="px-3 py-2">
                      <span className="text-primary font-medium">
                        {(currentProduto.preco * 1.05).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="font-medium text-foreground">
                        {Math.floor(currentProduto.estoque * 0.7)}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status="active" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-foreground">Filial Norte</td>
                    <td className="px-3 py-2">
                      <span className="text-primary font-medium">
                        {currentProduto.preco.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="font-medium text-destructive">
                        0
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status="inactive" />
                    </td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-foreground">Filial Sul</td>
                    <td className="px-3 py-2">
                      <span className="text-primary font-medium">
                        {(currentProduto.preco * 0.95).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <span className="font-medium text-foreground">
                        {Math.floor(currentProduto.estoque * 1.2)}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <StatusBadge status="active" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label>Produto Controlado</Label>
            <p className={`text-sm font-medium ${currentProduto.controlado ? "text-amber-600" : "text-foreground"}`}>
              {currentProduto.controlado ? "Sim" : "Não"}
            </p>
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
    </Dialog>
  );
}
