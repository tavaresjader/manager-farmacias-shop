import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/ui/search-bar";
import { TabsFilter } from "@/components/ui/tabs-filter";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Plus, GitBranch } from "lucide-react";

interface Jornada {
  id: string;
  name: string;
  description: string;
  status: "active" | "draft" | "inactive";
  trigger: "agendamento" | "recorrencia" | "api" | "manual";
  steps: number;
  contacts: number;
  conversions: number;
  createdAt: string;
}

const mockJornadas: Jornada[] = [
  {
    id: "1",
    name: "Onboarding Novos Clientes",
    description: "Jornada de boas-vindas para novos clientes",
    status: "active",
    trigger: "api",
    steps: 5,
    contacts: 1234,
    conversions: 456,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Recuperação de Carrinho",
    description: "Fluxo para recuperar carrinhos abandonados",
    status: "active",
    trigger: "agendamento",
    steps: 3,
    contacts: 890,
    conversions: 234,
    createdAt: "2024-02-20",
  },
  {
    id: "3",
    name: "Reengajamento",
    description: "Jornada para clientes inativos",
    status: "draft",
    trigger: "recorrencia",
    steps: 4,
    contacts: 0,
    conversions: 0,
    createdAt: "2024-03-10",
  },
  {
    id: "4",
    name: "Pós-Venda",
    description: "Acompanhamento após compra",
    status: "active",
    trigger: "manual",
    steps: 6,
    contacts: 2100,
    conversions: 678,
    createdAt: "2024-01-05",
  },
  {
    id: "5",
    name: "Upsell Premium",
    description: "Ofertas de upgrade para clientes ativos",
    status: "inactive",
    trigger: "recorrencia",
    steps: 4,
    contacts: 450,
    conversions: 89,
    createdAt: "2024-04-18",
  },
];

const tabs = [
  { id: "all", label: "Todas", count: 5 },
  { id: "active", label: "Ativas", count: 3 },
  { id: "draft", label: "Rascunhos", count: 1 },
  { id: "inactive", label: "Inativas", count: 1 },
];

const Jornadas = () => {
  usePageTitle("Jornadas");
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

const columns: Column<Jornada>[] = [
  {
    key: "name",
    label: "Jornada",
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
          <GitBranch className="w-4 h-4 text-primary" />
        </div>
        <div>
          <span className="font-medium text-foreground">{item.name}</span>
          <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
        </div>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (item) => (
      <StatusBadge
        status={item.status}
        label={
          item.status === "active"
            ? "Ativa"
            : item.status === "draft"
            ? "Rascunho"
            : "Inativa"
        }
      />
    ),
  },
  {
    key: "trigger",
    label: "Gatilho",
    render: (item) => {
      const triggerLabels: Record<string, string> = {
        agendamento: "Agendamento",
        recorrencia: "Recorrência",
        api: "API",
        manual: "Manual",
      };
      return (
        <span className="text-foreground">{triggerLabels[item.trigger]}</span>
      );
    },
  },
  {
    key: "steps",
    label: "Etapas",
    sortable: true,
    render: (item) => (
      <span className="text-foreground">{item.steps}</span>
    ),
  },
  {
    key: "contacts",
    label: "Contatos",
    sortable: true,
    render: (item) => (
      <span className="text-primary font-medium">{item.contacts.toLocaleString("pt-BR")}</span>
    ),
  },
  {
    key: "conversions",
    label: "Conversões",
    sortable: true,
    render: (item) => (
      <span className="text-success font-medium">{item.conversions.toLocaleString("pt-BR")}</span>
    ),
  },
  {
    key: "createdAt",
    label: "Criada em",
    sortable: true,
    render: (item) => (
      <span className="text-muted-foreground">
        {new Date(item.createdAt).toLocaleDateString("pt-BR")}
      </span>
    ),
  },
];

  const filteredJornadas = mockJornadas.filter((jornada) => {
    const matchesSearch =
      jornada.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jornada.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || jornada.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <MainLayout>
      <PageHeader
        title="Jornadas"
        breadcrumbs={[
          { label: "jornadas" },
        ]}
        actions={
          <Button className="gap-2" onClick={() => navigate("/jornadas/nova")}>
            <Plus className="w-4 h-4" />
            Nova Jornada
          </Button>
        }
      />

      <div className="space-y-4">
        <SearchBar
          placeholder="Pesquisar por nome ou descrição..."
          onSearch={setSearchQuery}
          onFilter={() => {}}
          className="max-w-lg"
        />

        <TabsFilter
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <DataTable
          columns={columns}
          data={filteredJornadas}
          emptyMessage="Nenhuma jornada encontrada"
        />
      </div>
    </MainLayout>
  );
};

export default Jornadas;
