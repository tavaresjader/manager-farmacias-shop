import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Bike, MapPin, Phone, Store, Clock, AlertTriangle, User } from "lucide-react";
import { statusLabels, situacaoLabels, type Entrega } from "@/types/entrega";
import { cn } from "@/lib/utils";

interface EntregaTrackingModalProps {
  entrega: Entrega | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const dotColor: Record<Entrega["situacao"], string> = {
  ok: "bg-success",
  atraso: "bg-warning",
  problema: "bg-destructive",
};

const etapas: { key: Entrega["status"]; label: string }[] = [
  { key: "aguardando", label: "Solicitada" },
  { key: "coletando", label: "Coleta na unidade" },
  { key: "em_rota", label: "Em rota" },
  { key: "entregue", label: "Entregue" },
];

export function EntregaTrackingModal({ entrega, open, onOpenChange }: EntregaTrackingModalProps) {
  if (!entrega) return null;

  const etapaAtual = etapas.findIndex((e) => e.key === entrega.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span>Entrega {entrega.codigo}</span>
            <span className="flex items-center gap-1.5 text-sm font-normal text-muted-foreground">
              <span className={cn("w-2.5 h-2.5 rounded-full", dotColor[entrega.situacao])} />
              {situacaoLabels[entrega.situacao]}
            </span>
            <span className="text-sm font-normal text-muted-foreground">
              | {statusLabels[entrega.status]}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mapa / tracking */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Acompanhamento em tempo real
            </h3>
            <div className="bg-muted/50 rounded-lg h-56 flex items-center justify-center">
              <div className="text-center space-y-2">
                <Bike
                  className={cn(
                    "w-12 h-12 mx-auto",
                    entrega.status === "em_rota" ? "text-primary animate-bounce" : "text-muted-foreground"
                  )}
                />
                <p className="text-sm text-muted-foreground">
                  {entrega.entregador
                    ? `${entrega.entregador.nome} — ${statusLabels[entrega.status].toLowerCase()}`
                    : "Buscando entregador disponível..."}
                </p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" />
                  {entrega.status === "entregue"
                    ? "Entrega concluída"
                    : `Previsão de chegada: ${entrega.previsaoMinutos} minutos`}
                </p>
              </div>
            </div>
            <Progress value={entrega.progresso} />
            <div className="flex justify-between text-xs text-muted-foreground">
              {etapas.map((etapa, index) => (
                <span
                  key={etapa.key}
                  className={cn(index <= etapaAtual && "text-foreground font-medium")}
                >
                  {etapa.label}
                </span>
              ))}
            </div>
          </div>

          {entrega.situacao !== "ok" && entrega.motivoProblema && (
            <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-4 text-sm">
              <AlertTriangle
                className={cn(
                  "w-4 h-4 mt-0.5",
                  entrega.situacao === "problema" ? "text-destructive" : "text-warning"
                )}
              />
              <span>{entrega.motivoProblema}</span>
            </div>
          )}

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Cliente
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Nome:</span>{" "}
                  <span className="font-medium">{entrega.cliente}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Telefone:</span>{" "}
                  <span className="font-medium">{entrega.telefone}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Endereço:</span>{" "}
                  <span className="font-medium">{entrega.endereco}</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <Bike className="w-4 h-4 text-primary" />
                Entregador
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                {entrega.entregador ? (
                  <>
                    <p>
                      <span className="text-muted-foreground">Nome:</span>{" "}
                      <span className="font-medium">{entrega.entregador.nome}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium">{entrega.entregador.telefone}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Veículo:</span>{" "}
                      <span className="font-medium">{entrega.entregador.veiculo}</span>
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground">Nenhum entregador atribuído ainda.</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
              <p className="flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-medium">{entrega.unidade}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Origem:</span>{" "}
                <span className="font-medium">
                  {entrega.origem === "avulsa" ? "Entrega avulsa" : "Canal de venda"}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Solicitada em:</span>{" "}
                <span className="font-medium">{entrega.solicitadaEm}</span>
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
              <p>
                <span className="text-muted-foreground">Valor do pedido:</span>{" "}
                <span className="font-medium text-primary">
                  {entrega.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                </span>
              </p>
              {entrega.observacoes && (
                <p>
                  <span className="text-muted-foreground">Observações:</span>{" "}
                  <span className="font-medium">{entrega.observacoes}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
