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
import { Loader2, Save, X } from "lucide-react";
import type { Coupon, CouponDiscountType, CouponFormData, CouponStatus } from "@/types/coupon";

interface CupomEditModalProps {
  cupom: Coupon | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (formData: CouponFormData, cupom?: Coupon | null) => Promise<boolean> | boolean;
}

const emptyForm: CouponFormData = {
  name: "",
  codigo: "",
  desconto: "",
  tipo: "percentual",
  minimo: "",
  limite: "",
  validade: "",
  status: "active",
};

function formatCurrencyInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  const amount = Number(digits) / 100;
  return amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatCurrencyValue(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function parseDecimalInput(value: string): number {
  const stripped = value.replace(/[^\d,.-]/g, "");
  const normalized = stripped.includes(",")
    ? stripped.replace(/\./g, "").replace(",", ".")
    : stripped;

  return Number(normalized) || 0;
}

function formatDecimalAsCurrency(value: string): string {
  if (!value.trim()) return "";
  return formatCurrencyValue(parseDecimalInput(value));
}

function toDateInputValue(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) return date.toISOString().slice(0, 10);

  const brazilianDateMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!brazilianDateMatch) return "";
  const [, day, month, year] = brazilianDateMatch;
  return `${year}-${month}-${day}`;
}

export function CupomEditModal({
  cupom,
  open,
  onOpenChange,
  onSave,
}: CupomEditModalProps) {
  const isCreating = !cupom;
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (cupom) {
      setFormData({
        name: cupom.name,
        codigo: cupom.codigo,
        desconto: cupom.tipo === "frete_gratis"
          ? ""
          : cupom.tipo === "fixo"
          ? formatCurrencyValue(cupom.amount)
          : String(cupom.amount).replace(".", ","),
        tipo: cupom.tipo,
        minimo: formatCurrencyValue(cupom.minimo),
        limite: cupom.limite.toString(),
        validade: toDateInputValue(cupom.expiresAt ?? cupom.validade),
        status: cupom.status,
      });
    } else {
      setFormData(emptyForm);
    }
    setSaving(false);
  }, [cupom, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    const saved = await onSave?.(formData, cupom);
    setSaving(false);
    if (saved !== false) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isCreating ? "Novo Cupom" : "Editar Cupom"}</DialogTitle>
        </DialogHeader>


        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Primeira compra"
            />
          </div>

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
              onValueChange={(value: CouponDiscountType) =>
                setFormData({
                  ...formData,
                  tipo: value,
                  desconto: value === "frete_gratis"
                    ? ""
                    : value === "fixo"
                    ? formatDecimalAsCurrency(formData.desconto)
                    : formData.desconto.replace(/[^\d,.]/g, ""),
                })
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
              type="text"
              inputMode={formData.tipo === "percentual" ? "decimal" : "numeric"}
              value={formData.tipo === "frete_gratis" ? "Frete Grátis" : formData.desconto}
              disabled={formData.tipo === "frete_gratis"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  desconto: formData.tipo === "fixo"
                    ? formatCurrencyInput(e.target.value)
                    : e.target.value.replace(/[^\d,.]/g, ""),
                })
              }
              placeholder={formData.tipo === "percentual" ? "Ex: 10" : "R$ 0,00"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimo">Valor Mínimo de Compra (R$)</Label>
            <Input
              id="minimo"
              type="text"
              inputMode="numeric"
              value={formData.minimo}
              onChange={(e) =>
                setFormData({ ...formData, minimo: formatCurrencyInput(e.target.value) })
              }
              placeholder="R$ 0,00"
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
              type="date"
              value={formData.validade}
              onChange={(e) =>
                setFormData({ ...formData, validade: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: CouponStatus) =>
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
              disabled={saving}
            >
              <X className="w-4 h-4" />
              Cancelar
            </Button>
            <Button type="submit" className="gap-2" disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
