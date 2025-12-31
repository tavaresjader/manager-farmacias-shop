import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowAction?: (item: T) => void;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  onRowAction,
  emptyMessage = "Nenhum registro encontrado",
}: DataTableProps<T>) {
  return (
    <div className="card-elevated overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  className="rounded border-border"
                />
              </th>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "px-4 py-3 text-left table-header",
                    column.className
                  )}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && (
                      <ArrowUpDown className="w-3 h-3 text-muted-foreground" />
                    )}
                  </div>
                </th>
              ))}
              <th className="w-12 px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.id}
                  className={cn(
                    "border-b border-border last:border-0 hover:bg-accent/50 transition-colors",
                    "animate-fade-in"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-border"
                    />
                  </td>
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={cn("px-4 py-3 text-sm", column.className)}
                    >
                      {column.render
                        ? column.render(item)
                        : String(item[column.key as keyof T] ?? "")}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onRowAction?.(item)}
                      className="p-1 rounded hover:bg-muted transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
