import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

interface CancelOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  onConfirm: (reason: string) => void;
}

const cancellationReasons = [
  { value: "cliente_desistiu", label: "Cliente desistiu da compra" },
  { value: "produto_indisponivel", label: "Produto indisponível" },
  { value: "endereco_invalido", label: "Endereço inválido ou incompleto" },
  { value: "pagamento_recusado", label: "Pagamento recusado" },
  { value: "fora_area_entrega", label: "Fora da área de entrega" },
  { value: "pedido_duplicado", label: "Pedido duplicado" },
  { value: "erro_sistema", label: "Erro no sistema" },
  { value: "outro", label: "Outro motivo" },
];

export function CancelOrderModal({
  open,
  onOpenChange,
  orderNumber,
  onConfirm,
}: CancelOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");

  const handleConfirm = () => {
    if (selectedReason) {
      onConfirm(selectedReason);
      setSelectedReason("");
      onOpenChange(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      setSelectedReason("");
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Cancelar Pedido
          </DialogTitle>
          <DialogDescription>
            Você está prestes a cancelar o pedido <strong>{orderNumber}</strong>. 
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo do cancelamento *</Label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger id="reason" className="w-full">
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {cancellationReasons.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleClose(false)}>
            Voltar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={!selectedReason}
          >
            Confirmar Cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
