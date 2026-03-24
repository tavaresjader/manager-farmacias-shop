import { useState, useEffect } from "react";
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

export interface ProdutoFilters {
  categoria: string;
  nome: string;
}

export interface CategoriaOption {
  value: string;
  label: string;
}

interface ProdutoFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ProdutoFilters;
  onApplyFilters: (filters: ProdutoFilters) => void;
  categorias: CategoriaOption[];
}

export function ProdutoFilterModal({
  open,
  onOpenChange,
  filters,
  onApplyFilters,
  categorias,
}: ProdutoFilterModalProps) {
  const [localFilters, setLocalFilters] = useState<ProdutoFilters>(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onOpenChange(false);
  };

  const handleClear = () => {
    const clearedFilters: ProdutoFilters = {
      categoria: "all",
      nome: "",
    };
    setLocalFilters(clearedFilters);
    onApplyFilters(clearedFilters);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filtrar Produtos</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Categoria */}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={localFilters.categoria}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, categoria: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {[{ value: "all", label: "Todas as categorias" }, ...categorias].map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nome do produto */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do produto</Label>
            <Input
              id="nome"
              placeholder="Digite o nome do produto..."
              value={localFilters.nome}
              onChange={(e) =>
                setLocalFilters((prev) => ({ ...prev, nome: e.target.value }))
              }
            />
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
