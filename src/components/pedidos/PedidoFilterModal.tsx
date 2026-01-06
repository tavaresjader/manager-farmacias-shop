import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface PedidoFilters {
  dataInicio?: Date;
  dataFim?: Date;
  cliente: string;
  status: string;
  unidade: string;
}

interface PedidoFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: PedidoFilters;
  onApplyFilters: (filters: PedidoFilters) => void;
}

const statusOptions = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendente" },
  { value: "processing", label: "Em preparo" },
  { value: "active", label: "Entregue" },
  { value: "inactive", label: "Devolvido" },
  { value: "cancelled", label: "Cancelado" },
];

const unidadeOptions = [
  { value: "all", label: "Todas as unidades" },
  { value: "1", label: "Unidade Centro" },
  { value: "2", label: "Unidade Norte" },
  { value: "3", label: "Unidade Sul" },
];

export function PedidoFilterModal({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
}: PedidoFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<PedidoFilters>(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleClear = () => {
    const clearedFilters: PedidoFilters = {
      dataInicio: undefined,
      dataFim: undefined,
      cliente: "",
      status: "all",
      unidade: "all",
    };
    setLocalFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filtrar Pedidos</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Período de compra */}
          <div className="space-y-2">
            <Label>Período de compra</Label>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !localFilters.dataInicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.dataInicio ? (
                      format(localFilters.dataInicio, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Data inicial</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.dataInicio}
                    onSelect={(date) =>
                      setLocalFilters((prev) => ({ ...prev, dataInicio: date }))
                    }
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <span className="text-muted-foreground">até</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !localFilters.dataFim && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.dataFim ? (
                      format(localFilters.dataFim, "dd/MM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Data final</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={localFilters.dataFim}
                    onSelect={(date) =>
                      setLocalFilters((prev) => ({ ...prev, dataFim: date }))
                    }
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Nome, e-mail ou telefone do cliente */}
          <div className="space-y-2">
            <Label htmlFor="cliente">Nome, e-mail ou telefone do cliente</Label>
            <Input
              id="cliente"
              placeholder="Digite para buscar..."
              value={localFilters.cliente}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, cliente: e.target.value }))
              }
            />
          </div>

          {/* Status do pedido */}
          <div className="space-y-2">
            <Label>Status do pedido</Label>
            <Select
              value={localFilters.status}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Unidade */}
          <div className="space-y-2">
            <Label>Unidade</Label>
            <Select
              value={localFilters.unidade}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, unidade: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a unidade" />
              </SelectTrigger>
              <SelectContent>
                {unidadeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClear}>
            Limpar filtros
          </Button>
          <Button onClick={handleApply}>Aplicar filtros</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
