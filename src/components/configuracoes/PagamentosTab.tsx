import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Truck, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Building2 
} from "lucide-react";

interface PaymentOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

const initialPaymentOptions: PaymentOption[] = [
  {
    id: "delivery",
    name: "Pagamento na entrega / retirada",
    description: "Aceitar pagamentos no momento da entrega ou retirada",
    icon: Truck,
    enabled: true,
  },
  {
    id: "credit_card",
    name: "Cartão de crédito",
    description: "Aceitar pagamentos via cartão de crédito",
    icon: CreditCard,
    enabled: true,
  },
  {
    id: "pix",
    name: "Pix",
    description: "Aceitar pagamentos via Pix",
    icon: QrCode,
    enabled: true,
  },
  {
    id: "cash",
    name: "Dinheiro",
    description: "Aceitar pagamentos em dinheiro",
    icon: Banknote,
    enabled: false,
  },
  {
    id: "agreement",
    name: "Convênio",
    description: "Aceitar pagamentos via convênio empresarial",
    icon: Building2,
    enabled: false,
  },
];

export function PagamentosTab() {
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>(initialPaymentOptions);

  const togglePaymentOption = (id: string) => {
    setPaymentOptions((prev) =>
      prev.map((option) =>
        option.id === id ? { ...option, enabled: !option.enabled } : option
      )
    );
  };

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
                  </div>
                </div>
                <Switch
                  id={option.id}
                  checked={option.enabled}
                  onCheckedChange={() => togglePaymentOption(option.id)}
                />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
