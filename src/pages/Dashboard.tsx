import { useEffect, useMemo, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageLoading } from "@/components/layout/PageLoading";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageLoading } from "@/hooks/usePageLoading";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/ui/metric-card";
import { TabsFilter } from "@/components/ui/tabs-filter";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { WhatsAppConfigModal } from "@/components/whatsapp/WhatsAppConfigModal";
import {
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { managerBackendBff } from "@/services/ManagerBackendBff";
import { toast } from "sonner";

import ifoodLogo from "@/assets/channels/ifood.webp";
import keetaLogo from "@/assets/channels/keeta.png";
import farmaciaShopLogo from "@/assets/logo-farmacia-shop.png";
import pedeProntoLogo from "@/assets/channels/pede-pronto.png";
import aiqfomeLogo from "@/assets/channels/aiqfome.jfif";

type Origem = "ifood" | "keeta" | "farmacia-shop" | "pede-pronto" | "aiqfome" | "unknown";

const origemLogos: Record<Origem, string> = {
  ifood: ifoodLogo,
  keeta: keetaLogo,
  "farmacia-shop": farmaciaShopLogo,
  "pede-pronto": pedeProntoLogo,
  aiqfome: aiqfomeLogo,
  unknown: farmaciaShopLogo,
};

const origemNames: Record<Origem, string> = {
  ifood: "iFood",
  keeta: "Keeta",
  "farmacia-shop": "Farmácia Shop",
  "pede-pronto": "Pede Pronto",
  aiqfome: "aiqfome",
  unknown: "Canal não informado",
};

type OrderStatus = "pending" | "processing" | "concluded" | "cancelled";

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  status: OrderStatus;
  statusLabel?: string;
  total: number;
  items: number;
  date: string;
  origem: Origem;
  unidade: string;
}

interface OverviewSummaryItemApi {
  value?: number;
  percentual?: number;
  percentualType?: string | null;
  Value?: number;
  Percentual?: number;
  PercentualType?: string | null;
}

interface OverviewSummaryApi {
  orders?: OverviewSummaryItemApi;
  customers?: OverviewSummaryItemApi;
  averageTicket?: OverviewSummaryItemApi;
  revenue?: OverviewSummaryItemApi;
  Orders?: OverviewSummaryItemApi;
  Customers?: OverviewSummaryItemApi;
  AverageTicket?: OverviewSummaryItemApi;
  Revenue?: OverviewSummaryItemApi;
}

interface OverviewOrderApi {
  id?: string;
  displayId?: string | null;
  salesChannel?: string | null;
  merchantName?: string | null;
  customerName?: string | null;
  status?: string | null;
  itens?: number;
  amount?: number;
  createdAt?: string;
  Id?: string;
  DisplayId?: string | null;
  SalesChannel?: string | null;
  MerchantName?: string | null;
  CustomerName?: string | null;
  Status?: string | null;
  Itens?: number;
  Amount?: number;
  CreatedAt?: string;
}

interface OverviewResponse {
  summary?: OverviewSummaryApi;
  orders?: OverviewOrderApi[];
  Summary?: OverviewSummaryApi;
  Orders?: OverviewOrderApi[];
}

const emptySummaryItem: Required<Pick<OverviewSummaryItemApi, "value" | "percentual">> & { percentualType: string } = {
  value: 0,
  percentual: 0,
  percentualType: "neutral",
};

const ITEMS_PER_PAGE = 5;

const normalizeText = (value?: string | null) =>
  value
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") ?? "";

const resolveSummaryItem = (item?: OverviewSummaryItemApi) => ({
  value: item?.value ?? item?.Value ?? emptySummaryItem.value,
  percentual: item?.percentual ?? item?.Percentual ?? emptySummaryItem.percentual,
  percentualType: item?.percentualType ?? item?.PercentualType ?? emptySummaryItem.percentualType,
});

const resolveChangeType = (type?: string | null, percentual = 0): "positive" | "negative" | "neutral" => {
  const normalizedType = normalizeText(type);
  if (["positive", "positivo", "increase", "up"].includes(normalizedType)) return "positive";
  if (["negative", "negativo", "decrease", "down"].includes(normalizedType)) return "negative";
  if (percentual > 0) return "positive";
  if (percentual < 0) return "negative";
  return "neutral";
};

const resolveOrigem = (salesChannel?: string | null): Origem => {
  const normalized = normalizeText(salesChannel);
  if (normalized.includes("ifood")) return "ifood";
  if (normalized.includes("keeta")) return "keeta";
  if (normalized.includes("farmacia-shop")) return "farmacia-shop";
  if (normalized.includes("pede-pronto")) return "pede-pronto";
  if (normalized.includes("aiqfome")) return "aiqfome";
  return "unknown";
};

const resolveStatus = (status?: string | null): OrderStatus => {
  const normalized = normalizeText(status);
  if (["concluded", "complete", "concluido", "delivered", "entregue", "finished", "finalizado"].includes(normalized)) {
    return "concluded";
  }
  if (["cancelled", "canceled", "cancelado"].includes(normalized)) return "cancelled";
  if (["processing", "processando", "in-progress", "em-andamento", "confirmed", "confirmado", "accepted", "aceito"].includes(normalized)) {
    return "processing";
  }
  return "pending";
};

const formatNumber = (value: number) => value.toLocaleString("pt-BR");

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Não informado";
  return date.toLocaleDateString("pt-BR");
};

const toOrder = (order: OverviewOrderApi, index: number): Order => {
  const status = order.status ?? order.Status ?? null;
  const displayId = order.displayId ?? order.DisplayId;
  const customerName = order.customerName ?? order.CustomerName;
  const merchantName = order.merchantName ?? order.MerchantName;
  const salesChannel = order.salesChannel ?? order.SalesChannel;

  return {
    id: order.id ?? order.Id ?? `${displayId ?? "order"}-${index}`,
    orderNumber: displayId?.trim() || "Pedido sem código",
    customer: customerName?.trim() || "Cliente não informado",
    status: resolveStatus(status),
    statusLabel: status?.trim() || undefined,
    total: order.amount ?? order.Amount ?? 0,
    items: order.itens ?? order.Itens ?? 0,
    date: order.createdAt ?? order.CreatedAt ?? "",
    origem: resolveOrigem(salesChannel),
    unidade: merchantName?.trim() || "Unidade não informada",
  };
};

const columns: Column<Order>[] = [
  {
    key: "origem",
    label: "Origem",
    render: (item) => (
      <div className="flex items-center gap-2">
        <img 
          src={origemLogos[item.origem]} 
          alt={origemNames[item.origem]} 
          className="w-6 h-6 rounded object-cover"
        />
      </div>
    ),
  },
  {
    key: "unidade",
    label: "Unidade",
    sortable: true,
    render: (item) => (
      <span className="text-foreground">{item.unidade}</span>
    ),
  },
  {
    key: "orderNumber",
    label: "Pedido",
    sortable: true,
    render: (item) => (
      <div>
        <span className="font-medium text-foreground">{item.orderNumber}</span>
        <p className="text-xs text-muted-foreground mt-0.5">{item.customer}</p>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (item) => <StatusBadge status={item.status} label={item.statusLabel} />,
  },
  {
    key: "items",
    label: "Itens",
    sortable: true,
    render: (item) => (
      <span className="text-muted-foreground">{item.items}</span>
    ),
  },
  {
    key: "total",
    label: "Total",
    sortable: true,
    render: (item) => (
      <span className="text-primary font-medium">
        {formatCurrency(item.total)}
      </span>
    ),
  },
  {
    key: "date",
    label: "Data",
    sortable: true,
    render: (item) => (
      <span className="text-muted-foreground">
        {formatDate(item.date)}
      </span>
    ),
  },
];

const Dashboard = () => {
  usePageTitle("Início");
  const isLoading = usePageLoading();
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [overview, setOverview] = useState<OverviewResponse | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(() => {
    return !localStorage.getItem("whatsapp-modal-dismissed");
  });

  useEffect(() => {
    let cancelled = false;

    const fetchOverview = async () => {
      setLoadingOverview(true);
      const response = await managerBackendBff.get<OverviewResponse>("/v1/overview");

      if (cancelled) return;

      if (response.data) {
        setOverview(response.data);
      } else {
        setOverview(null);
        toast.error(`Erro ao carregar início: ${response.error ?? "Tente novamente."}`);
      }

      setLoadingOverview(false);
    };

    fetchOverview();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleCloseWhatsAppModal = (open: boolean) => {
    if (!open) {
      localStorage.setItem("whatsapp-modal-dismissed", "true");
    }
    setShowWhatsAppModal(open);
  };

  const summary = overview?.summary ?? overview?.Summary;
  const orders = useMemo(
    () => (overview?.orders ?? overview?.Orders ?? []).map(toOrder),
    [overview],
  );

  const tabs = useMemo(() => {
    const countByStatus = orders.reduce<Record<OrderStatus, number>>(
      (acc, order) => {
        acc[order.status] += 1;
        return acc;
      },
      { pending: 0, processing: 0, concluded: 0, cancelled: 0 },
    );

    return [
      { id: "all", label: "Todos", count: orders.length },
      { id: "pending", label: "Pendentes", count: countByStatus.pending },
      { id: "processing", label: "Processando", count: countByStatus.processing },
      { id: "concluded", label: "Concluídos", count: countByStatus.concluded },
    ];
  }, [orders]);

  const metrics = {
    orders: resolveSummaryItem(summary?.orders ?? summary?.Orders),
    customers: resolveSummaryItem(summary?.customers ?? summary?.Customers),
    averageTicket: resolveSummaryItem(summary?.averageTicket ?? summary?.AverageTicket),
    revenue: resolveSummaryItem(summary?.revenue ?? summary?.Revenue),
  };

  const filteredOrders = orders.filter((order) => {
    const matchesTab =
      activeTab === "all" || order.status === activeTab;
    return matchesTab;
  });

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
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
      <WhatsAppConfigModal
        open={showWhatsAppModal} 
        onOpenChange={handleCloseWhatsAppModal} 
      />
      <PageHeader
        title="Início"
        breadcrumbs={[]}
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Pedidos"
          value={formatNumber(metrics.orders.value)}
          change={{
            value: metrics.orders.percentual,
            type: resolveChangeType(metrics.orders.percentualType, metrics.orders.percentual),
          }}
          icon={ShoppingCart}
        />
        <MetricCard
          title="Clientes"
          value={formatNumber(metrics.customers.value)}
          change={{
            value: metrics.customers.percentual,
            type: resolveChangeType(metrics.customers.percentualType, metrics.customers.percentual),
          }}
          icon={Users}
        />
        <MetricCard
          title="Ticket Médio"
          value={formatCurrency(metrics.averageTicket.value)}
          change={{
            value: metrics.averageTicket.percentual,
            type: resolveChangeType(metrics.averageTicket.percentualType, metrics.averageTicket.percentual),
          }}
          icon={DollarSign}
        />
        <MetricCard
          title="Faturamento"
          value={formatCurrency(metrics.revenue.value)}
          change={{
            value: metrics.revenue.percentual,
            type: resolveChangeType(metrics.revenue.percentualType, metrics.revenue.percentual),
          }}
          icon={TrendingUp}
        />
      </div>

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Pedidos Recentes
          </h2>
        </div>


        <TabsFilter
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <DataTable
          columns={columns}
          data={paginatedOrders}
          emptyMessage="Nenhum pedido encontrado"
          loading={loadingOverview}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
