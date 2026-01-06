import { cn } from "@/lib/utils";

type Status = "active" | "pending" | "inactive" | "completed" | "draft" | "processing" | "cancelled";

interface StatusBadgeProps {
  status: Status;
  label?: string;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  active: { label: "Ativo", className: "badge-active" },
  pending: { label: "Pendente", className: "badge-pending" },
  inactive: { label: "Inativo", className: "badge-inactive" },
  completed: { label: "Concluído", className: "badge-active" },
  draft: { label: "Rascunho", className: "badge-inactive" },
  processing: { label: "Processando", className: "badge-pending" },
  cancelled: { label: "Cancelado", className: "badge-inactive" },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={cn("badge-status", config.className)}>
      {label || config.label}
    </span>
  );
}
