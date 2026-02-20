import { useState } from "react";
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

import ifoodLogo from "@/assets/channels/ifood.webp";
import keetaLogo from "@/assets/channels/keeta.png";
import farmaciaShopLogo from "@/assets/channels/farmacia-shop.png";
import pedeProntoLogo from "@/assets/channels/pede-pronto.png";
import aiqfomeLogo from "@/assets/channels/aiqfome.jfif";

type Origem = "ifood" | "keeta" | "farmacia-shop" | "pede-pronto" | "aiqfome";

const origemLogos: Record<Origem, string> = {
  ifood: ifoodLogo,
  keeta: keetaLogo,
  "farmacia-shop": farmaciaShopLogo,
  "pede-pronto": pedeProntoLogo,
  aiqfome: aiqfomeLogo,
};

const origemNames: Record<Origem, string> = {
  ifood: "iFood",
  keeta: "Keeta",
  "farmacia-shop": "Farmácia Shop",
  "pede-pronto": "Pede Pronto",
  aiqfome: "aiqfome",
};

// Mock data for recent orders
interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  total: number;
  items: number;
  date: string;
  origem: Origem;
  unidade: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "#001234",
    customer: "Maria Silva",
    status: "completed",
    total: 245.90,
    items: 5,
    date: "2024-01-05",
    origem: "ifood",
    unidade: "Unidade Centro",
  },
  {
    id: "2",
    orderNumber: "#001233",
    customer: "João Santos",
    status: "processing",
    total: 189.50,
    items: 3,
    date: "2024-01-05",
    origem: "keeta",
    unidade: "Unidade Norte",
  },
  {
    id: "3",
    orderNumber: "#001232",
    customer: "Ana Oliveira",
    status: "pending",
    total: 78.00,
    items: 2,
    date: "2024-01-04",
    origem: "farmacia-shop",
    unidade: "Unidade Sul",
  },
  {
    id: "4",
    orderNumber: "#001231",
    customer: "Carlos Pereira",
    status: "completed",
    total: 456.30,
    items: 8,
    date: "2024-01-04",
    origem: "pede-pronto",
    unidade: "Unidade Centro",
  },
  {
    id: "5",
    orderNumber: "#001230",
    customer: "Fernanda Costa",
    status: "cancelled",
    total: 125.00,
    items: 2,
    date: "2024-01-03",
    origem: "aiqfome",
    unidade: "Unidade Norte",
  },
];

const tabs = [
  { id: "all", label: "Todos", count: 156 },
  { id: "pending", label: "Pendentes", count: 12 },
  { id: "processing", label: "Processando", count: 8 },
  { id: "completed", label: "Concluídos", count: 130 },
];

const ITEMS_PER_PAGE = 5;

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
    render: (item) => <StatusBadge status={item.status} />,
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
        {item.total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </span>
    ),
  },
  {
    key: "date",
    label: "Data",
    sortable: true,
    render: (item) => (
      <span className="text-muted-foreground">
        {new Date(item.date).toLocaleDateString("pt-BR")}
      </span>
    ),
  },
];

const Dashboard = () => {
  usePageTitle("Início");
  const isLoading = usePageLoading();
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(() => {
    return !localStorage.getItem("whatsapp-modal-dismissed");
  });

  const handleCloseWhatsAppModal = (open: boolean) => {
    if (!open) {
      localStorage.setItem("whatsapp-modal-dismissed", "true");
    }
    setShowWhatsAppModal(open);
  };

  const filteredOrders = mockOrders.filter((order) => {
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
          value="24"
          change={{ value: 12, type: "positive" }}
          icon={ShoppingCart}
        />
        <MetricCard
          title="Clientes"
          value="1.248"
          change={{ value: 8, type: "positive" }}
          icon={Users}
        />
        <MetricCard
          title="Ticket Médio"
          value="R$ 89,50"
          change={{ value: 5, type: "positive" }}
          icon={DollarSign}
        />
        <MetricCard
          title="Faturamento"
          value="R$ 45.8k"
          change={{ value: 18, type: "positive" }}
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
