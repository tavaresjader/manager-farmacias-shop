import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bike } from "lucide-react";
import { toast } from "sonner";
import type { Entrega } from "@/types/entrega";

interface NovaEntregaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (entrega: Entrega) => void;
}

const unidades = ["Unidade Centro", "Unidade Jardins", "Unidade Zona Sul"];

const emptyForm = {
  unidade: unidades[0],
  numeroPedido: "",
  cliente: "",
  telefone: "",
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  valor: "",
  observacoes: "",
};

const onlyDigits = (v: string) => v.replace(/\D/g, "");

export function NovaEntregaModal({ open, onOpenChange, onCreate }: NovaEntregaModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [valorEntrega, setValorEntrega] = useState<number | null>(null);
  const [calculando, setCalculando] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(emptyForm);
      setValorEntrega(null);
    }
  }, [open]);

  const setField = (key: keyof typeof emptyForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Preenche o endereço automaticamente a partir do CEP (campo não digitável)
  useEffect(() => {
    const cep = onlyDigits(form.cep);
    if (cep.length !== 8) {
      setForm((prev) => (prev.endereco ? { ...prev, endereco: "" } : prev));
      return;
    }
    let cancelled = false;
    setBuscandoCep(true);
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.erro) {
          toast.error("CEP não encontrado.");
          setForm((prev) => ({ ...prev, endereco: "" }));
          return;
        }
        setForm((prev) => ({
          ...prev,
          endereco: [data.logradouro, data.bairro, data.localidade && `${data.localidade}/${data.uf}`]
            .filter(Boolean)
            .join(", "),
        }));
      })
      .catch(() => {
        if (!cancelled) toast.error("Não foi possível consultar o CEP.");
      })
      .finally(() => !cancelled && setBuscandoCep(false));
    return () => {
      cancelled = true;
    };
  }, [form.cep]);

  // Calcula o valor da entrega após CEP + número informados
  useEffect(() => {
    const cep = onlyDigits(form.cep);
    if (cep.length !== 8 || !form.numero.trim() || !form.endereco) {
      setValorEntrega(null);
      return;
    }
    setCalculando(true);
    const timer = setTimeout(() => {
      const base = 7.9;
      const variacao = (Number(cep.slice(-3)) % 12) * 0.85;
      setValorEntrega(Number((base + variacao).toFixed(2)));
      setCalculando(false);
    }, 500);
    return () => {
      clearTimeout(timer);
      setCalculando(false);
    };
  }, [form.cep, form.numero, form.endereco]);


  const handleSubmit = () => {
    if (!form.cliente.trim() || !form.telefone.trim() || !form.endereco.trim()) {
      toast.error("Preencha cliente, telefone e endereço de entrega.");
      return;
    }

    const now = new Date();
    const entrega: Entrega = {
      id: crypto.randomUUID(),
      codigo: `AV-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      numeroPedido: form.numeroPedido.trim() || undefined,
      origem: "avulsa",
      unidade: form.unidade,
      cliente: form.cliente.trim(),
      telefone: form.telefone.trim(),
      cep: form.cep.trim() || undefined,
      endereco: form.endereco.trim(),
      complemento: form.complemento.trim() || undefined,
      valor: Number(form.valor.replace(",", ".")) || 0,
      observacoes: form.observacoes.trim() || undefined,
      status: "aguardando",
      situacao: "ok",
      entregador: null,
      solicitadaEm: now.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }),
      previsaoMinutos: 45,
      progresso: 5,
    };

    onCreate(entrega);
    toast.success(`Entrega avulsa ${entrega.codigo} solicitada com sucesso!`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bike className="w-5 h-5 text-primary" />
            Nova entrega avulsa
          </DialogTitle>
          <DialogDescription>
            Solicite um entregador para um pedido que não foi criado pelos canais de venda.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Unidade de coleta</Label>
            <Select value={form.unidade} onValueChange={(v) => setField("unidade", v)}>
              <SelectTrigger className="bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {unidades.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numeroPedido">Número do pedido</Label>
            <Input
              id="numeroPedido"
              className="bg-card"
              value={form.numeroPedido}
              onChange={(e) => setField("numeroPedido", e.target.value)}
              placeholder="Ex: 12345"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Input
                id="cliente"
                className="bg-card"
                value={form.cliente}
                onChange={(e) => setField("cliente", e.target.value)}
                placeholder="Nome do cliente"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                className="bg-card"
                value={form.telefone}
                onChange={(e) => setField("telefone", e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                className="bg-card"
                value={form.cep}
                onChange={(e) => setField("cep", e.target.value)}
                placeholder="00000-000"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="endereco">Endereço de entrega</Label>
              <Input
                id="endereco"
                className="bg-card"
                value={form.endereco}
                onChange={(e) => setField("endereco", e.target.value)}
                placeholder="Rua, número, bairro, cidade"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="complemento">Complemento / Ponto de referência</Label>
            <Input
              id="complemento"
              className="bg-card"
              value={form.complemento}
              onChange={(e) => setField("complemento", e.target.value)}
              placeholder="Apto, bloco, ponto de referência (opcional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor do pedido (R$)</Label>
            <Input
              id="valor"
              className="bg-card"
              value={form.valor}
              onChange={(e) => setField("valor", e.target.value)}
              placeholder="0,00"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              className="bg-card"
              value={form.observacoes}
              onChange={(e) => setField("observacoes", e.target.value)}
              placeholder="Instruções para o entregador (opcional)"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Solicitar entrega</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
