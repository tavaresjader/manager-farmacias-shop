import { MainLayout } from "@/components/layout/MainLayout";
import { PageLoading } from "@/components/layout/PageLoading";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageLoading } from "@/hooks/usePageLoading";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, CreditCard, QrCode, Landmark } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface OnlinePaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

const initialMethods: OnlinePaymentMethod[] = [
  {
    id: "credit_card",
    name: "Cartão de Crédito",
    description: "Aceitar pagamentos com cartão de crédito",
    icon: CreditCard,
    enabled: false,
  },
  {
    id: "pix",
    name: "Pix",
    description: "Aceitar pagamentos via Pix",
    icon: QrCode,
    enabled: false,
  },
  {
    id: "bank_slip",
    name: "Boleto Bancário",
    description: "Aceitar pagamentos via boleto",
    icon: Landmark,
    enabled: false,
  },
];

const PagamentoOnlineConfig = () => {
  usePageTitle("Configuração de Pagamento Online");
  const isLoading = usePageLoading();
  const navigate = useNavigate();
  const [methods, setMethods] = useState<OnlinePaymentMethod[]>(initialMethods);

  const toggleMethod = (id: string) => {
    setMethods((prev) =>
      prev.map((method) =>
        method.id === id ? { ...method, enabled: !method.enabled } : method
      )
    );
  };

  if (isLoading) {
    return (
      <MainLayout>
        <PageLoading />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/configuracoes")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Configuração de Pagamento Online
            </h1>
            <p className="text-sm text-muted-foreground">
              Configure as formas de pagamento online aceitas
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Payment Methods */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-foreground mb-4">
              Métodos de Pagamento
            </h2>
            <div className="space-y-4">
              {methods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <div
                    key={method.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                      method.enabled
                        ? "border-primary/50 bg-primary/5"
                        : "border-border bg-background"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          method.enabled
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{method.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={method.enabled}
                      onCheckedChange={() => toggleMethod(method.id)}
                    />
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Gateway Configuration */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-foreground mb-4">
              Configuração do Gateway
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gateway">Gateway de Pagamento</Label>
                <Input
                  id="gateway"
                  placeholder="Selecione o gateway"
                  className="bg-white dark:bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api_key">Chave de API</Label>
                <Input
                  id="api_key"
                  type="password"
                  placeholder="Insira sua chave de API"
                  className="bg-white dark:bg-background"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secret_key">Chave Secreta</Label>
                <Input
                  id="secret_key"
                  type="password"
                  placeholder="Insira sua chave secreta"
                  className="bg-white dark:bg-background"
                />
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/configuracoes")}
            >
              Cancelar
            </Button>
            <Button>Salvar Configurações</Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PagamentoOnlineConfig;
