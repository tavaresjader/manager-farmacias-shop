import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: "positive" | "negative" | "neutral";
  };
  icon?: LucideIcon;
  iconColor?: string;
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-primary",
}: MetricCardProps) {
  return (
    <div className="metric-card animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>
        {Icon && (
          <div
            className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center bg-accent",
              iconColor
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <span className="font-heading text-2xl font-semibold text-foreground">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              "text-xs font-medium pb-0.5",
              change.type === "positive" && "text-success",
              change.type === "negative" && "text-destructive",
              change.type === "neutral" && "text-muted-foreground"
            )}
          >
            {change.type === "positive" && "+"}
            {change.value}%
          </span>
        )}
      </div>
    </div>
  );
}
