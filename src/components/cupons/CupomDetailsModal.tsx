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
import { Calendar, Percent, ShoppingCart, Hash, Target, Pencil } from "lucide-react";
import { CupomEditModal } from "./CupomEditModal";

interface Utilizacao {
  pedidoId: string;
  data: string;
  valor: string;
}

interface Cupom {
  id: string;
  codigo: string;
  desconto: string;
  tipo: "percentual" | "fixo";
  minimo: number;
  usos: number;
  limite: number;
  validade: string;
  status: "active" | "inactive" | "cancelled";
}

interface CupomDetailsModalProps {
  cupom: Cupom | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCupomUpdate?: (cupom: Cupom) => void;
}

const statusLabels: Record<string, string> = {
  active: "Ativo",
  inactive: "Inativo",
  cancelled: "Expirado",
};

// Mock de utilizações
const mockUtilizacoes: Record<string, Utilizacao[]> = {
  "1": [
    { pedidoId: "#12458", data: "12/01/2026 14:32", valor: "R$ 8,50" },
    { pedidoId: "#12445", data: "11/01/2026 09:15", valor: "R$ 12,00" },
    { pedidoId: "#12432", data: "10/01/2026 18:45", valor: "R$ 7,20" },
    { pedidoId: "#12420", data: "09/01/2026 11:22", valor: "R$ 15,00" },
    { pedidoId: "#12398", data: "08/01/2026 16:08", valor: "R$ 9,80" },
  ],
  "2": [
    { pedidoId: "#12455", data: "12/01/2026 10:20", valor: "R$ 15,00" },
    { pedidoId: "#12440", data: "11/01/2026 14:55", valor: "R$ 15,00" },
    { pedidoId: "#12425", data: "10/01/2026 08:30", valor: "R$ 15,00" },
  ],
  "3": [
    { pedidoId: "#11890", data: "30/11/2025 23:45", valor: "R$ 45,00" },
    { pedidoId: "#11885", data: "30/11/2025 22:10", valor: "R$ 38,50" },
    { pedidoId: "#11870", data: "30/11/2025 20:30", valor: "R$ 52,00" },
    { pedidoId: "#11865", data: "30/11/2025 19:15", valor: "R$ 41,25" },
    { pedidoId: "#11850", data: "30/11/2025 18:00", valor: "R$ 33,75" },
    { pedidoId: "#11840", data: "30/11/2025 16:45", valor: "R$ 47,50" },
  ],
  "4": [],
};

export function CupomDetailsModal({
  cupom,
  open,
  onOpenChange,
  onCupomUpdate,
}: CupomDetailsModalProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!cupom) return null;

  const utilizacoes = mockUtilizacoes[cupom.id] || [];

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCupomSave = (updatedCupom: Cupom) => {
    onCupomUpdate?.(updatedCupom);
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

        <div className="space-y-6">
          {/* Informações do Cupom */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
              <Percent className="w-4 h-4 text-primary" />
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

            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
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
                  {utilizacoes.map((uso, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">
                          {uso.pedidoId}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {uso.data}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-primary">
                        -{uso.valor}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button className="gap-2" onClick={handleEditClick}>
            <Pencil className="w-4 h-4" />
            Editar Cupom
          </Button>
        </DialogFooter>
      </DialogContent>

      <CupomEditModal
        cupom={cupom}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleCupomSave}
      />
    </Dialog>
  );
}
