import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/ui/search-bar";
import { TabsFilter } from "@/components/ui/tabs-filter";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Plus, Download, Printer } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  client: string;
  type: string;
  status: "active" | "pending" | "completed" | "draft";
  budget: number;
  spent: number;
  leads: number;
  conversions: number;
  startDate: string;
  endDate: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Black Friday 2024",
    client: "Loja Virtual ABC",
    type: "Performance",
    status: "active",
    budget: 15000,
    spent: 8500,
    leads: 342,
    conversions: 89,
    startDate: "2024-11-01",
    endDate: "2024-11-30",
  },
  {
    id: "2",
    name: "Lançamento Produto X",
    client: "Tech Solutions",
    type: "Awareness",
    status: "active",
    budget: 25000,
    spent: 12000,
    leads: 567,
    conversions: 145,
    startDate: "2024-10-15",
    endDate: "2024-12-15",
  },
  {
    id: "3",
    name: "Campanha Natal",
    client: "Moda Express",
    type: "Sazonal",
    status: "pending",
    budget: 8000,
    spent: 0,
    leads: 0,
    conversions: 0,
    startDate: "2024-12-01",
    endDate: "2024-12-25",
  },
  {
    id: "4",
    name: "Remarketing Q4",
    client: "E-commerce Plus",
    type: "Remarketing",
    status: "active",
    budget: 5000,
    spent: 3200,
    leads: 189,
    conversions: 67,
    startDate: "2024-09-01",
    endDate: "2024-12-31",
  },
  {
    id: "5",
    name: "Awareness Brand",
    client: "StartUp Inc",
    type: "Branding",
    status: "completed",
    budget: 10000,
    spent: 9800,
    leads: 423,
    conversions: 112,
    startDate: "2024-08-01",
    endDate: "2024-10-31",
  },
  {
    id: "6",
    name: "Captação Contatos B2B",
    client: "Consultoria XYZ",
    type: "Contato Gen",
    status: "draft",
    budget: 12000,
    spent: 0,
    leads: 0,
    conversions: 0,
    startDate: "2025-01-01",
    endDate: "2025-03-31",
  },
  {
    id: "7",
    name: "Promoção Verão",
    client: "Loja Virtual ABC",
    type: "Sazonal",
    status: "pending",
    budget: 6000,
    spent: 0,
    leads: 0,
    conversions: 0,
    startDate: "2025-01-15",
    endDate: "2025-02-28",
  },
];

const tabs = [
  { id: "all", label: "Todas", count: 7 },
  { id: "active", label: "Ativas", count: 3 },
  { id: "pending", label: "Pendentes", count: 2 },
  { id: "completed", label: "Concluídas", count: 1 },
  { id: "draft", label: "Rascunhos", count: 1 },
];

const columns: Column<Campaign>[] = [
  {
    key: "name",
    label: "Campanha",
    sortable: true,
    render: (item) => (
      <div>
        <span className="font-medium text-foreground">{item.name}</span>
        <p className="text-xs text-muted-foreground mt-0.5">{item.type}</p>
      </div>
    ),
  },
  {
    key: "client",
    label: "Cliente",
    sortable: true,
    render: (item) => <span className="text-foreground">{item.client}</span>,
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
    key: "conversions",
    label: "Conversões",
    sortable: true,
    render: (item) => (
      <span className="text-success font-medium">{item.conversions}</span>
    ),
  },
  {
    key: "startDate",
    label: "Período",
    render: (item) => (
      <span className="text-muted-foreground text-xs">
        {new Date(item.startDate).toLocaleDateString("pt-BR")} -{" "}
        {new Date(item.endDate).toLocaleDateString("pt-BR")}
      </span>
    ),
  },
];

const Campanhas = () => {
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
        title="Campanhas"
        breadcrumbs={[
          { label: "campanhas" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Printer className="w-4 h-4" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Campanha
            </Button>
          </div>
        }
      />

      <div className="space-y-4">
        <SearchBar
          placeholder="Pesquisar por nome, cliente ou tipo..."
          onSearch={setSearchQuery}
          onFilter={() => {}}
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

export default Campanhas;
