import { Bike, Clock, MapPin, Store, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusLabels, situacaoLabels, type Entrega } from "@/types/entrega";
import { Progress } from "@/components/ui/progress";

interface EntregaCardProps {
  entrega: Entrega;
  onClick: (entrega: Entrega) => void;
}

const semaforo: Record<Entrega["situacao"], { dot: string; bar: string; text: string }> = {
  ok: { dot: "bg-black", bar: "bg-black", text: "text-black" },
  finalizado: { dot: "bg-success", bar: "bg-success", text: "text-success" },
  atraso: { dot: "bg-warning", bar: "bg-warning", text: "text-warning" },
  problema: { dot: "bg-destructive", bar: "bg-destructive", text: "text-destructive" },
};

export function EntregaCard({ entrega, onClick }: EntregaCardProps) {
  const cores = semaforo[entrega.situacao];

  return (
    <button
      onClick={() => onClick(entrega)}
      className="card-elevated relative overflow-hidden text-left p-5 space-y-4 hover:shadow-md transition-shadow"
    >
      <span className={cn("absolute left-0 top-0 h-full w-1", cores.bar)} />

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">{entrega.codigo}</p>
          <p className="text-xs text-muted-foreground">
            {entrega.origem === "avulsa" ? "Entrega avulsa" : "Canal de venda"} ·{" "}
            {entrega.solicitadaEm}
          </p>
        </div>
        <span className={cn("flex items-center gap-1.5 text-xs font-medium", cores.text)}>
          <span className={cn("w-2.5 h-2.5 rounded-full", cores.dot)} />
          {situacaoLabels[entrega.situacao]}
        </span>
      </div>

      <div className="space-y-1.5 text-sm">
        <p className="flex items-center gap-2">
          <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="font-medium truncate">{entrega.cliente}</span>
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{entrega.endereco}</span>
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <Store className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{entrega.unidade}</span>
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <Bike className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {entrega.entregador ? entrega.entregador.nome : "Aguardando entregador"}
          </span>
        </p>
      </div>

      <div className="space-y-2">
        <Progress value={entrega.progresso} />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{statusLabels[entrega.status]}</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {entrega.status === "entregue" ? "Concluída" : `${entrega.previsaoMinutos} min`}
          </span>
        </div>
      </div>
    </button>
  );
}
