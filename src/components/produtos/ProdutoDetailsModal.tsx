import { useState } from "react";
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
    const newStatus = produto.status === "active" ? "inactive" : "active";
    toast.success(
      newStatus === "active"
        ? `Produto "${produto.nome}" ativado com sucesso!`
        : `Produto "${produto.nome}" inativado com sucesso!`
    );
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
              {isEditing ? (
                <Input
                  id="nome"
                  value={editedProduto?.nome || ""}
                  onChange={(e) =>
                    setEditedProduto((prev) =>
                      prev ? { ...prev, nome: e.target.value } : null
                    )
                  }
                />
              ) : (
                <p className="text-sm text-foreground font-medium">
                  {currentProduto.nome}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria</Label>
              {isEditing ? (
                <Input
                  id="categoria"
                  value={editedProduto?.categoria || ""}
                  onChange={(e) =>
                    setEditedProduto((prev) =>
                      prev ? { ...prev, categoria: e.target.value } : null
                    )
                  }
                />
              ) : (
                <p className="text-sm text-foreground">{currentProduto.categoria}</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              {isEditing ? (
                <Input
                  id="sku"
                  value={editedProduto?.sku || ""}
                  onChange={(e) =>
                    setEditedProduto((prev) =>
                      prev ? { ...prev, sku: e.target.value } : null
                    )
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground">{currentProduto.sku}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ean">EAN</Label>
              {isEditing ? (
                <Input
                  id="ean"
                  value={editedProduto?.ean || ""}
                  onChange={(e) =>
                    setEditedProduto((prev) =>
                      prev ? { ...prev, ean: e.target.value } : null
                    )
                  }
                />
              ) : (
                <p className="text-sm text-muted-foreground">{currentProduto.ean}</p>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preco">Preço</Label>
              {isEditing ? (
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={editedProduto?.preco || 0}
                  onChange={(e) =>
                    setEditedProduto((prev) =>
                      prev ? { ...prev, preco: parseFloat(e.target.value) } : null
                    )
                  }
                />
              ) : (
                <p className="text-sm text-primary font-medium">
                  {currentProduto.preco.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoque">Estoque</Label>
              {isEditing ? (
                <Input
                  id="estoque"
                  type="number"
                  value={editedProduto?.estoque || 0}
                  onChange={(e) =>
                    setEditedProduto((prev) =>
                      prev ? { ...prev, estoque: parseInt(e.target.value) } : null
                    )
                  }
                />
              ) : (
                <p
                  className={`text-sm font-medium ${
                    currentProduto.estoque === 0
                      ? "text-destructive"
                      : "text-foreground"
                  }`}
                >
                  {currentProduto.estoque} unidades
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <div>
                <StatusBadge status={currentProduto.status} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Produto Controlado</Label>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editedProduto?.controlado || false}
                    onCheckedChange={(checked) =>
                      setEditedProduto((prev) =>
                        prev ? { ...prev, controlado: checked } : null
                      )
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    {editedProduto?.controlado ? "Sim" : "Não"}
                  </span>
                </div>
              ) : (
                <p className={`text-sm font-medium ${currentProduto.controlado ? "text-amber-600" : "text-foreground"}`}>
                  {currentProduto.controlado ? "Sim" : "Não"}
                </p>
              )}
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
    </Dialog>
  );
}
