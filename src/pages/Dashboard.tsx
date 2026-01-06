import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/ui/metric-card";
import { SearchBar } from "@/components/ui/search-bar";
import { TabsFilter } from "@/components/ui/tabs-filter";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { WhatsAppConfigModal } from "@/components/whatsapp/WhatsAppConfigModal";
import {
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
} from "lucide-react";

// Mock data for recent orders
interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  total: number;
  items: number;
  date: string;
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
  },
  {
    id: "2",
    orderNumber: "#001233",
    customer: "João Santos",
    status: "processing",
    total: 189.50,
    items: 3,
    date: "2024-01-05",
  },
  {
    id: "3",
    orderNumber: "#001232",
    customer: "Ana Oliveira",
    status: "pending",
    total: 78.00,
    items: 2,
    date: "2024-01-04",
  },
  {
    id: "4",
    orderNumber: "#001231",
    customer: "Carlos Pereira",
    status: "completed",
    total: 456.30,
    items: 8,
    date: "2024-01-04",
  },
  {
    id: "5",
    orderNumber: "#001230",
    customer: "Fernanda Costa",
    status: "cancelled",
    total: 125.00,
    items: 2,
    date: "2024-01-03",
  },
];

const tabs = [
  { id: "all", label: "Todos", count: 156 },
  { id: "pending", label: "Pendentes", count: 12 },
  { id: "processing", label: "Processando", count: 8 },
  { id: "completed", label: "Concluídos", count: 130 },
];

const columns: Column<Order>[] = [
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
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
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
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" || order.status === activeTab;
    return matchesSearch && matchesTab;
  });

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
          title="Pedidos Hoje"
          value="24"
          change={{ value: 12, type: "positive" }}
          icon={ShoppingCart}
        />
        <MetricCard
          title="Total de Clientes"
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
          title="Faturamento Mensal"
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

        <SearchBar
          placeholder="Pesquisar por número ou cliente..."
          onSearch={setSearchQuery}
          onFilter={() => {}}
          className="max-w-2xl"
        />

        <TabsFilter
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <DataTable
          columns={columns}
          data={filteredOrders}
          emptyMessage="Nenhum pedido encontrado"
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
