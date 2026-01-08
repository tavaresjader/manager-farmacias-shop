import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock } from "lucide-react";

interface HorarioFuncionamento {
  dia: string;
  aberto: boolean;
  abertura?: string;
  fechamento?: string;
}

interface Unidade {
  id: string;
  nome: string;
  endereco: string;
  situacao: "aberta" | "fechada";
  status: "ativa" | "inativa";
  horarios: HorarioFuncionamento[];
}

interface UnidadeDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unidade: Unidade | null;
}

export function UnidadeDetailsModal({
  open,
  onOpenChange,
  unidade,
}: UnidadeDetailsModalProps) {
  if (!unidade) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {unidade.nome}
            <Badge variant={unidade.situacao === "aberta" ? "default" : "secondary"}>
              {unidade.situacao === "aberta" ? "Aberta" : "Fechada"}
            </Badge>
            <Badge variant={unidade.status === "ativa" ? "default" : "secondary"}>
              {unidade.status === "ativa" ? "Ativa" : "Inativa"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Endereço */}
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">Endereço</h4>
              <p className="text-sm text-muted-foreground">{unidade.endereco}</p>
            </div>
          </div>

          {/* Horários de funcionamento */}
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground mb-3">
                Horários de funcionamento
              </h4>
              <div className="space-y-2">
                {unidade.horarios.map((horario) => (
                  <div
                    key={horario.dia}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {horario.dia}
                    </span>
                    {horario.aberto ? (
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
