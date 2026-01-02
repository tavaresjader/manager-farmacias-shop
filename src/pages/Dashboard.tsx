import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/ui/metric-card";
import { SearchBar } from "@/components/ui/search-bar";
import { TabsFilter } from "@/components/ui/tabs-filter";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  Megaphone,
  Users,
  TrendingUp,
  Target,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for recent campaigns
interface Campaign {
  id: string;
  name: string;
  client: string;
  status: "active" | "pending" | "completed" | "draft";
  budget: number;
  spent: number;
  leads: number;
  startDate: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Black Friday 2024",
    client: "Loja Virtual ABC",
    status: "active",
    budget: 15000,
    spent: 8500,
    leads: 342,
    startDate: "2024-11-01",
  },
  {
    id: "2",
    name: "Lançamento Produto X",
    client: "Tech Solutions",
    status: "active",
    budget: 25000,
    spent: 12000,
    leads: 567,
    startDate: "2024-10-15",
  },
  {
    id: "3",
    name: "Campanha Natal",
    client: "Moda Express",
    status: "pending",
    budget: 8000,
    spent: 0,
    leads: 0,
    startDate: "2024-12-01",
  },
  {
    id: "4",
    name: "Remarketing Q4",
    client: "E-commerce Plus",
    status: "active",
    budget: 5000,
    spent: 3200,
    leads: 189,
    startDate: "2024-09-01",
  },
  {
    id: "5",
    name: "Awareness Brand",
    client: "StartUp Inc",
    status: "completed",
    budget: 10000,
    spent: 9800,
    leads: 423,
    startDate: "2024-08-01",
  },
];

const tabs = [
  { id: "all", label: "Todas", count: 12 },
  { id: "active", label: "Ativas", count: 5 },
  { id: "pending", label: "Pendentes", count: 3 },
  { id: "completed", label: "Concluídas", count: 4 },
];

const columns: Column<Campaign>[] = [
  {
    key: "name",
    label: "Campanha",
    sortable: true,
    render: (item) => (
      <div>
        <span className="font-medium text-foreground">{item.name}</span>
        <p className="text-xs text-muted-foreground mt-0.5">{item.client}</p>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    key: "budget",
    label: "Orçamento",
    sortable: true,
    render: (item) => (
      <span className="text-foreground">
        {item.budget.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </span>
    ),
  },
  {
    key: "spent",
    label: "Gasto",
    sortable: true,
    render: (item) => (
      <span className="text-muted-foreground">
        {item.spent.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </span>
    ),
  },
  {
    key: "leads",
    label: "Contatos",
    sortable: true,
    render: (item) => (
      <span className="text-primary font-medium">{item.leads}</span>
    ),
  },
  {
    key: "startDate",
    label: "Início",
    sortable: true,
    render: (item) => (
      <span className="text-muted-foreground">
        {new Date(item.startDate).toLocaleDateString("pt-BR")}
      </span>
    ),
  },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" || campaign.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <MainLayout>
      <PageHeader
        title="Início"
        breadcrumbs={[]}
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Campanhas Ativas"
          value="12"
          change={{ value: 8, type: "positive" }}
          icon={Megaphone}
        />
        <MetricCard
          title="Total de Clientes"
          value="48"
          change={{ value: 12, type: "positive" }}
          icon={Users}
        />
        <MetricCard
          title="Contatos Gerados"
          value="1.521"
          change={{ value: 23, type: "positive" }}
          icon={Target}
        />
        <MetricCard
          title="ROI Médio"
          value="3.2x"
          change={{ value: 5, type: "positive" }}
          icon={TrendingUp}
        />
      </div>

      {/* Recent Campaigns Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Campanhas Recentes
          </h2>
        </div>

        <SearchBar
          placeholder="Pesquisar por nome ou cliente..."
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
          data={filteredCampaigns}
          emptyMessage="Nenhuma campanha encontrada"
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
