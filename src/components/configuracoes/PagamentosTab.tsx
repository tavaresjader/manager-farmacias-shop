import type { ElementType } from "react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Banknote, Loader2, Truck } from "lucide-react";
import { managerBackendBff } from "@/services/ManagerBackendBff";
import { toast } from "sonner";

interface PaymentOption {
  id: string;
  name: string;
  description: string;
  icon: ElementType;
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
];

type PaymentStatusApiResponse =
  | boolean
  | {
      active?: boolean | null;
      enabled?: boolean | null;
      status?: boolean | string | null;
      value?: boolean | null;
      payAtDeliveryStatus?: boolean | null;
      payCashAtDeliveryStatus?: boolean | null;
    };

const PAY_AT_DELIVERY_ENDPOINT = "/v1/payments/PayAtDeliveryStatus";
const PAY_CASH_AT_DELIVERY_ENDPOINT = "/v1/payments/PayCashAtDeliveryStatus";

function toPaymentStatus(data: PaymentStatusApiResponse | null | undefined): boolean {
  if (typeof data === "boolean") return data;
  if (!data || typeof data !== "object") return false;

  const status =
    data.enabled ??
    data.active ??
    data.value ??
    data.payAtDeliveryStatus ??
    data.payCashAtDeliveryStatus ??
    data.status;

  if (typeof status === "boolean") return status;
  if (typeof status === "string") {
    return ["true", "active", "enabled", "ativo", "habilitado"].includes(status.trim().toLowerCase());
  }

  return false;
}

export function PagamentosTab() {
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>(initialPaymentOptions);
  const [cashEnabled, setCashEnabled] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [savingDelivery, setSavingDelivery] = useState(false);
  const [savingCash, setSavingCash] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadPaymentSettings = async () => {
      setLoadingPayments(true);

      const [deliveryResponse, cashResponse] = await Promise.all([
        managerBackendBff.get<PaymentStatusApiResponse>(PAY_AT_DELIVERY_ENDPOINT),
        managerBackendBff.get<PaymentStatusApiResponse>(PAY_CASH_AT_DELIVERY_ENDPOINT),
      ]);

      if (cancelled) return;

      if (deliveryResponse.data !== null) {
        const deliveryEnabled = toPaymentStatus(deliveryResponse.data);
        setPaymentOptions((prev) =>
          prev.map((option) =>
            option.id === "delivery" ? { ...option, enabled: deliveryEnabled } : option
          )
        );
      } else {
        toast.error(`Erro ao carregar pagamento na entrega: ${deliveryResponse.error ?? "Tente novamente."}`);
      }

      if (cashResponse.data !== null) {
        setCashEnabled(toPaymentStatus(cashResponse.data));
      } else {
        toast.error(`Erro ao carregar pagamento em dinheiro: ${cashResponse.error ?? "Tente novamente."}`);
      }

      setLoadingPayments(false);
    };

    loadPaymentSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const setDeliveryEnabled = (enabled: boolean) => {
    setPaymentOptions((prev) =>
      prev.map((option) =>
        option.id === "delivery" ? { ...option, enabled } : option
      )
    );
  };

  const togglePaymentOption = async (id: string, enabled: boolean) => {
    if (id !== "delivery") return;

    const previousDeliveryEnabled = isDeliveryEnabled;
    const previousCashEnabled = cashEnabled;

    setSavingDelivery(true);
    setDeliveryEnabled(enabled);
    if (!enabled) setCashEnabled(false);

    const response = await managerBackendBff.patch<unknown>(PAY_AT_DELIVERY_ENDPOINT, { Active: enabled });

    if (response.error) {
      setDeliveryEnabled(previousDeliveryEnabled);
      setCashEnabled(previousCashEnabled);
      toast.error(`Erro ao atualizar pagamento na entrega: ${response.error}`);
    } else {
      toast.success("Pagamento na entrega atualizado com sucesso.");
    }

    setSavingDelivery(false);
  };

  const toggleCashPayment = async (enabled: boolean) => {
    const previousCashEnabled = cashEnabled;

    setSavingCash(true);
    setCashEnabled(enabled);

    const response = await managerBackendBff.patch<unknown>(PAY_CASH_AT_DELIVERY_ENDPOINT, { Active: enabled });

    if (response.error) {
      setCashEnabled(previousCashEnabled);
      toast.error(`Erro ao atualizar pagamento em dinheiro: ${response.error}`);
    } else {
      toast.success("Pagamento em dinheiro atualizado com sucesso.");
    }

    setSavingCash(false);
  };

  const isDeliveryEnabled = paymentOptions.find(o => o.id === "delivery")?.enabled ?? false;
  const controlsDisabled = loadingPayments || savingDelivery || savingCash;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Pagamentos</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure as formas de pagamento aceitas
          </p>
        </div>
        {loadingPayments && (
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando pagamentos...
          </span>
        )}
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
                <div className="flex items-center gap-2">
                  {savingDelivery && option.id === "delivery" && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  <Switch
                    id={option.id}
                    checked={option.enabled}
                    disabled={controlsDisabled}
                    onCheckedChange={(checked) => togglePaymentOption(option.id, checked)}
                  />
                </div>
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
                          Aceitar pagamentos em dinheiro na entrega
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {savingCash && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                      <Switch
                        id="cash"
                        checked={cashEnabled}
                        disabled={controlsDisabled}
                        onCheckedChange={toggleCashPayment}
                      />
                    </div>
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
