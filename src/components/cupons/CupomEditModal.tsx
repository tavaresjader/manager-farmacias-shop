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
import { Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Cupom {
  id: string;
  codigo: string;
  desconto: string;
  tipo: "percentual" | "fixo" | "frete_gratis";
  minimo: number;
  usos: number;
  limite: number;
  validade: string;
  status: "active" | "inactive" | "cancelled";
}

interface CupomEditModalProps {
  cupom: Cupom | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (cupom: Cupom) => void;
}

const emptyForm = {
  codigo: "",
  desconto: "",
  tipo: "percentual" as "percentual" | "fixo" | "frete_gratis",
  minimo: "",
  limite: "",
  validade: "",
  status: "active" as "active" | "inactive" | "cancelled",
};

export function CupomEditModal({
  cupom,
  open,
  onOpenChange,
  onSave,
}: CupomEditModalProps) {
  const isCreating = !cupom;
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;

    if (cupom) {
      // Parse desconto to get just the number
      const descontoValue = cupom.desconto.replace("%", "").replace("R$ ", "").replace(",", ".");

      setFormData({
        codigo: cupom.codigo,
        desconto: descontoValue,
        tipo: cupom.tipo,
        minimo: cupom.minimo.toString(),
        limite: cupom.limite.toString(),
        validade: cupom.validade,
        status: cupom.status,
      });
    } else {
      setFormData(emptyForm);
    }
  }, [cupom, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedCupom: Cupom = {
      id: cupom?.id ?? `cupom-${Date.now()}`,
      usos: cupom?.usos ?? 0,
      codigo: formData.codigo,
      tipo: formData.tipo,
      desconto:
        formData.tipo === "percentual"
          ? `${formData.desconto}%`
          : formData.tipo === "fixo"
          ? `R$ ${formData.desconto}`
          : "Frete Grátis",
      minimo: parseFloat(formData.minimo) || 0,
      limite: parseInt(formData.limite) || 0,
      validade: formData.validade,
      status: formData.status,
    };

    onSave?.(updatedCupom);

    toast({
      title: isCreating ? "Cupom cadastrado" : "Cupom atualizado",
      description: `O cupom ${formData.codigo} foi ${isCreating ? "cadastrado" : "atualizado"} com sucesso.`,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isCreating ? "Novo Cupom" : "Editar Cupom"}</DialogTitle>
        </DialogHeader>


        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="codigo">Código do Cupom</Label>
            <Input
              id="codigo"
              value={formData.codigo}
              onChange={(e) =>
                setFormData({ ...formData, codigo: e.target.value.toUpperCase() })
              }
              placeholder="Ex: PROMO10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Desconto</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value: "percentual" | "fixo" | "frete_gratis") =>
                setFormData({ ...formData, tipo: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentual">Percentual (%)</SelectItem>
                <SelectItem value="fixo">Valor Fixo (R$)</SelectItem>
                <SelectItem value="frete_gratis">Frete Grátis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="desconto">
              {formData.tipo === "frete_gratis"
                ? "Desconto"
                : `Desconto (${formData.tipo === "percentual" ? "%" : "R$"})`}
            </Label>
            <Input
              id="desconto"
              type={formData.tipo === "frete_gratis" ? "text" : "number"}
              step={formData.tipo === "frete_gratis" ? undefined : "0.01"}
              value={formData.tipo === "frete_gratis" ? "Frete Grátis" : formData.desconto}
              disabled={formData.tipo === "frete_gratis"}
              onChange={(e) =>
                setFormData({ ...formData, desconto: e.target.value })
              }
              placeholder={formData.tipo === "percentual" ? "Ex: 10" : "Ex: 15.00"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimo">Valor Mínimo de Compra (R$)</Label>
            <Input
              id="minimo"
              type="number"
              step="0.01"
              value={formData.minimo}
              onChange={(e) =>
                setFormData({ ...formData, minimo: e.target.value })
              }
              placeholder="Ex: 50.00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="limite">Limite Máximo de Utilizações</Label>
            <Input
              id="limite"
              type="number"
              min="0"
              value={formData.limite}
              onChange={(e) =>
                setFormData({ ...formData, limite: e.target.value })
              }
              placeholder="Ex: 100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="validade">Validade</Label>
            <Input
              id="validade"
              value={formData.validade}
              onChange={(e) =>
                setFormData({ ...formData, validade: e.target.value })
              }
              placeholder="Ex: 31/01/2026"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "inactive" | "cancelled") =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="cancelled">Expirado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
            <Button type="submit" className="gap-2">
              <Save className="w-4 h-4" />
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
