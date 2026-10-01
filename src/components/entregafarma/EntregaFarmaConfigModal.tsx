import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Wallet, Copy } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import logoFarmaciaShop from "@/assets/logo-farmacia-shop.png";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const valoresSugeridos = [50, 100, 200, 500];
const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function EntregaFarmaConfigModal({ open, onOpenChange }: Props) {
  const [ativo, setAtivo] = useState(true);
  const [saldo, setSaldo] = useState(128.5);
  const [valor, setValor] = useState<number>(100);
  const [pixGerado, setPixGerado] = useState(false);
  const [modoUso, setModoUso] = useState<"todos" | "avulsos">("todos");

  const pixCode = `00020126580014br.gov.bcb.pix0136farmacias-shop-entregafarma520400005303986540${valor.toFixed(2)}5802BR`;

  const handleToggle = (v: boolean) => {
    setAtivo(v);
    toast.success(v ? "Entrega Farma ativado" : "Entrega Farma inativado");
  };

  const handleComprar = () => {
    if (!valor || valor < 10) return toast.error("Informe um valor mínimo de R$ 10,00");
    setPixGerado(true);
  };

  const confirmarPix = () => {
    setSaldo((s) => s + valor);
    setPixGerado(false);
    toast.success(`Pagamento Pix confirmado: ${brl(valor)} adicionados`);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setPixGerado(false); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <img src={logoFarmaciaShop} alt="Entrega Farma" className="w-10 h-10 rounded-lg object-cover" />
            <div>
              <DialogTitle>Entrega Farma</DialogTitle>
              <DialogDescription>Entregas avulsas com entregadores parceiros</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="font-medium">Status da integração</p>
            <p className="text-sm text-muted-foreground">{ativo ? "Ativo" : "Inativo"}</p>
          </div>
          <Switch checked={ativo} onCheckedChange={handleToggle} />
        </div>

        <div className="rounded-lg border p-4 space-y-2">
          <Label className="font-bold">Modo de uso</Label>
          <Select value={modoUso} onValueChange={(v) => setModoUso(v as "todos" | "avulsos")}>
            <SelectTrigger className="bg-background w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Em todos os pedidos</SelectItem>
              <SelectItem value="avulsos">Somente pedidos avulsos</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            {modoUso === "todos"
              ? "Entrega Farma será oferecido em todos os pedidos da loja."
              : "Entrega Farma será oferecido somente em pedidos avulsos."}
          </p>
        </div>

        <div className="rounded-lg border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-muted-foreground" />
              <p className="font-medium">Créditos disponíveis</p>
            </div>
            <p className="text-lg font-semibold">{brl(saldo)}</p>
          </div>

          <div className="space-y-2">
            <Label>Valor da recarga</Label>
            <div className="grid grid-cols-4 gap-2">
              {valoresSugeridos.map((v) => (
                <Button key={v} type="button" variant={valor === v ? "default" : "outline"} size="sm"
                  onClick={() => { setValor(v); setPixGerado(false); }}>
                  {brl(v)}
                </Button>
              ))}
            </div>
            <Input type="number" min={10} value={valor || ""} className="bg-background"
              onChange={(e) => { setValor(Number(e.target.value)); setPixGerado(false); }} placeholder="Outro valor" />
          </div>
        </div>

          {pixGerado && (
            <div className="space-y-3 rounded-lg bg-muted p-3">
              <p className="text-sm">Copie o código Pix abaixo e pague no app do seu banco:</p>
              <div className="flex gap-2">
                <Input readOnly value={pixCode} className="bg-background text-xs" />
                <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(pixCode); toast.success("Código copiado"); }}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <Button className="w-full" variant="outline" onClick={confirmarPix}>Já paguei</Button>
            </div>
          )}

          {!pixGerado && (
            <Button className="w-full" onClick={handleComprar}>
              Gerar Pix {valor ? brl(valor) : ""}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
