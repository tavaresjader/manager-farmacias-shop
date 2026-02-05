import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Truck, 
  Banknote, 
  Building2,
  Globe,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

interface PaymentOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  hasConfig?: boolean;
}

const initialPaymentOptions: PaymentOption[] = [
  {
    id: "delivery",
    name: "Pagamento na entrega",
    description: "Aceitar pagamentos no momento da entrega ou retirada",
    icon: Truck,
    enabled: true,
  },
  {
    id: "online",
    name: "Pagamento Online",
    description: "Aceitar pagamentos online (cartão, pix, boleto)",
    icon: Globe,
    enabled: false,
    hasConfig: true,
  },
  {
    id: "agreement",
    name: "Convênio",
    description: "Aceitar pagamentos via convênio empresarial",
    icon: Building2,
    enabled: false,
  },
];

const initialCashEnabled = false;

export function PagamentosTab() {
  const navigate = useNavigate();
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>(initialPaymentOptions);
  const [cashEnabled, setCashEnabled] = useState(initialCashEnabled);

  const togglePaymentOption = (id: string) => {
    setPaymentOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, enabled: !option.enabled } : option
      )
    );
    // Reset cash option when delivery is disabled
    if (id === "delivery") {
      const deliveryOption = paymentOptions.find(o => o.id === "delivery");
      if (deliveryOption?.enabled) {
        setCashEnabled(false);
      }
    }
  };

  const isDeliveryEnabled = paymentOptions.find(o => o.id === "delivery")?.enabled ?? false;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Pagamentos</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Configure as formas de pagamento aceitas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paymentOptions.map((option) => {
          const IconComponent = option.icon;
          return (
            <Card
              key={option.id}
              className={`p-4 transition-all duration-200 ${
                option.enabled
                  ? "border-primary/50 bg-primary/5"
                  : "border-border bg-background"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      option.enabled
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <Label
                      htmlFor={option.id}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {option.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                    {option.hasConfig && option.enabled && (
                      <button
                        onClick={() => navigate("/configuracoes/pagamento-online")}
                        className="text-xs text-primary hover:underline mt-1"
                      >
                        Configurar pagamento online
                      </button>
                    )}
                    {option.id === "agreement" && option.enabled && (
                      <Link
                        to="/configuracoes?tab=unidades"
                        className="flex items-center gap-1 text-xs text-destructive hover:underline mt-1"
                      >
                        Configure os convênios em suas unidades
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
                <Switch
                  id={option.id}
                  checked={option.enabled}
                  onCheckedChange={() => togglePaymentOption(option.id)}
                />
              </div>
              {/* Cash option nested under delivery */}
              {option.id === "delivery" && option.enabled && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between gap-4 pl-10">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          cashEnabled
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <Label
                          htmlFor="cash"
                          className="text-sm font-medium cursor-pointer"
                        >
                          Dinheiro
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Aceitar pagamentos em dinheiro
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="cash"
                      checked={cashEnabled}
                      onCheckedChange={setCashEnabled}
                    />
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
