import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Calendar, Percent, ShoppingCart, Hash, Target, Pencil, DollarSign, Tag, Truck, Trash2, Loader2 } from "lucide-react";
import { CupomEditModal } from "./CupomEditModal";
import type { Coupon, CouponFormData } from "@/types/coupon";

interface CupomDetailsModalProps {
  cupom: Coupon | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCupomUpdate?: (formData: CouponFormData, cupom?: Coupon | null) => Promise<boolean> | boolean;
  onCupomDelete?: (cupom: Coupon) => Promise<boolean> | boolean;
  loading?: boolean;
}

const statusLabels: Record<string, string> = {
  active: "Ativo",
  inactive: "Inativo",
  cancelled: "Expirado",
};

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDateTime(value: string | null): string {
  if (!value) return "Data não informada";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Data não informada";
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CupomDetailsModal({
  cupom,
  open,
  onOpenChange,
  onCupomUpdate,
  onCupomDelete,
  loading = false,
}: CupomDetailsModalProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!cupom) return null;

  const utilizacoes = cupom.utilizacoes;

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const deleted = await onCupomDelete?.(cupom);
    setDeleting(false);
    if (deleted !== false) setDeleteConfirmOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="font-mono text-lg">{cupom.codigo}</span>
            <StatusBadge status={cupom.status} label={statusLabels[cupom.status]} />
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Carregando cupom...
          </div>
        ) : <div className="space-y-6">
          {/* Informações do Cupom */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Tag className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Tipo</p>
                <p className="font-semibold">
                  {cupom.tipo === "percentual"
                    ? "Percentual"
                    : cupom.tipo === "fixo"
                    ? "Valor Fixo"
                    : "Frete Grátis"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              {cupom.tipo === "percentual" ? (
                <Percent className="w-4 h-4 text-primary" />
              ) : cupom.tipo === "fixo" ? (
                <DollarSign className="w-4 h-4 text-primary" />
              ) : (
                <Truck className="w-4 h-4 text-primary" />
              )}
              <div>
                <p className="text-xs text-muted-foreground">Desconto</p>
                <p className="font-semibold">{cupom.desconto}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Target className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Mínimo</p>
                <p className="font-semibold">R$ {cupom.minimo.toFixed(2).replace(".", ",")}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Hash className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Utilizações</p>
                <p className="font-semibold">{cupom.usos} / {cupom.limite}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg col-span-2">
              <Calendar className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Validade</p>
                <p className="font-semibold">{cupom.validade}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Histórico de Utilizações */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Histórico de Utilizações
            </h3>

            {utilizacoes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma utilização registrada</p>
              </div>
            ) : (
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {utilizacoes.map((uso) => (
                    <div
                      key={uso.orderId}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">
                          {uso.orderCode}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDateTime(uso.createdAt)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-primary">
                        -{formatCurrency(uso.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>}

        <DialogFooter className="gap-2">
          <Button
            variant="destructive"
            className="gap-2"
            onClick={() => setDeleteConfirmOpen(true)}
            disabled={loading}
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </Button>
          <Button className="gap-2" onClick={handleEditClick} disabled={loading}>
            <Pencil className="w-4 h-4" />
            Editar Cupom
          </Button>
        </DialogFooter>
      </DialogContent>

      <CupomEditModal
        cupom={cupom}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={onCupomUpdate}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir cupom</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o cupom "{cupom.codigo}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
