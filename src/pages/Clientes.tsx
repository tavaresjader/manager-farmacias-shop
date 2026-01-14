import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageLoading } from "@/components/layout/PageLoading";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/ui/search-bar";
import { TabsFilter } from "@/components/ui/tabs-filter";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageLoading } from "@/hooks/usePageLoading";
import { Mail, Phone } from "lucide-react";
import { ClienteFilterModal, ClienteFilters } from "@/components/clientes/ClienteFilterModal";
import { ClienteDetailsModal } from "@/components/clientes/ClienteDetailsModal";

interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  segment: string;
  status: "active" | "inactive";
  campaigns: number;
  totalSpent: number;
  createdAt: string;
  addresses: Address[];
}

const mockClients: Client[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@lojavirtualabc.com",
    phone: "(11) 99999-1234",
    document: "123.456.789-00",
    segment: "São Paulo, SP",
    status: "active",
    campaigns: 5,
    totalSpent: 45000,
    createdAt: "2024-01-15",
    addresses: [
      {
        id: "1",
        street: "Rua das Flores",
        number: "123",
        complement: "Apto 45",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        zipCode: "01234-567",
        isDefault: true,
      },
    ],
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@techsolutions.com",
    phone: "(11) 98888-5678",
    document: "987.654.321-00",
    segment: "São Paulo, SP",
    status: "active",
    campaigns: 3,
    totalSpent: 75000,
    createdAt: "2024-02-20",
    addresses: [
      {
        id: "1",
        street: "Av. Paulista",
        number: "1000",
        neighborhood: "Bela Vista",
        city: "São Paulo",
        state: "SP",
        zipCode: "01310-100",
        isDefault: true,
      },
      {
        id: "2",
        street: "Rua Augusta",
        number: "500",
        complement: "Sala 10",
        neighborhood: "Consolação",
        city: "São Paulo",
        state: "SP",
        zipCode: "01305-000",
      },
    ],
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro@modaexpress.com",
    phone: "(21) 97777-9012",
    document: "456.789.123-00",
    segment: "Rio de Janeiro, RJ",
    status: "active",
    campaigns: 2,
    totalSpent: 18000,
    createdAt: "2024-03-10",
    addresses: [],
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana@ecommerceplus.com",
    phone: "(31) 96666-3456",
    document: "789.123.456-00",
    segment: "Belo Horizonte, MG",
    status: "active",
    campaigns: 1,
    totalSpent: 5000,
    createdAt: "2024-06-05",
    addresses: [
      {
        id: "1",
        street: "Rua da Bahia",
        number: "200",
        neighborhood: "Centro",
        city: "Belo Horizonte",
        state: "MG",
        zipCode: "30160-011",
        isDefault: true,
      },
    ],
  },
  {
    id: "5",
    name: "Carlos Ferreira",
    email: "carlos@startupinc.com",
    phone: "(41) 95555-7890",
    document: "321.654.987-00",
    segment: "Curitiba, PR",
    status: "active",
    campaigns: 4,
    totalSpent: 32000,
    createdAt: "2024-04-18",
    addresses: [
      {
        id: "1",
        street: "Rua XV de Novembro",
        number: "300",
        neighborhood: "Centro",
        city: "Curitiba",
        state: "PR",
        zipCode: "80020-310",
        isDefault: true,
      },
    ],
  },
  {
    id: "6",
    name: "Fernanda Lima",
    email: "fernanda@consultoriaxyz.com",
    phone: "(51) 94444-1234",
    document: "654.987.321-00",
    segment: "Porto Alegre, RS",
    status: "inactive",
    campaigns: 0,
    totalSpent: 0,
    createdAt: "2024-07-22",
    addresses: [],
  },
];

const tabs = [
  { id: "all", label: "Todos", count: 6 },
  { id: "active", label: "Ativos", count: 5 },
  { id: "inactive", label: "Inativos", count: 1 },
];

const columns: Column<Client>[] = [
  {
    key: "name",
    label: "Cliente",
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-medium text-primary">
            {item.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </span>
        </div>
        <div>
          <span className="font-medium text-foreground">{item.name}</span>
          <p className="text-xs text-muted-foreground mt-0.5">{item.document}</p>
        </div>
      </div>
    ),
  },
  {
    key: "contact",
    label: "Contato",
    render: (item) => (
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Mail className="w-3 h-3" />
          {item.email}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Phone className="w-3 h-3" />
          {item.phone}
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
        label={item.status === "active" ? "Ativo" : "Inativo"}
      />
    ),
  },
  {
    key: "totalSpent",
    label: "Total Compras",
    sortable: true,
    render: (item) => (
      <span className="text-foreground font-medium">
        {item.totalSpent.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Cliente desde",
    sortable: true,
    render: (item) => (
      <span className="text-muted-foreground">
        {new Date(item.createdAt).toLocaleDateString("pt-BR")}
      </span>
    ),
  },
];

const Clientes = () => {
  usePageTitle("Clientes");
  const isLoading = usePageLoading();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [filters, setFilters] = useState<ClienteFilters>({
    nome: "",
    status: "all",
    email: "",
    dataCadastro: undefined,
  });

  const handleRowClick = (client: Client) => {
    setSelectedClient(client);
    setDetailsModalOpen(true);
  };

  const filteredClients = mockClients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.document.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || client.status === activeTab;
    
    // Filtros da modal
    const matchesNome = !filters.nome || client.name.toLowerCase().includes(filters.nome.toLowerCase());
    const matchesStatus = filters.status === "all" || client.status === filters.status;
    const matchesEmail = !filters.email || client.email.toLowerCase().includes(filters.email.toLowerCase());
    const matchesData = !filters.dataCadastro || client.createdAt === filters.dataCadastro.toISOString().split("T")[0];
    
    return matchesSearch && matchesTab && matchesNome && matchesStatus && matchesEmail && matchesData;
  });

  if (isLoading) {
    return (
      <MainLayout>
        <PageLoading />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title="Clientes"
        breadcrumbs={[]}
      />

      <div className="space-y-4">
        <SearchBar
          placeholder="Pesquisar por nome, empresa ou e-mail..."
          onSearch={setSearchQuery}
          onFilter={() => setFilterModalOpen(true)}
        />

        <TabsFilter
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <DataTable
          columns={columns}
          data={filteredClients}
          emptyMessage="Nenhum cliente encontrado"
          onRowClick={handleRowClick}
        />

        <ClienteFilterModal
          open={filterModalOpen}
          onOpenChange={setFilterModalOpen}
          filters={filters}
          onApplyFilters={setFilters}
        />

        <ClienteDetailsModal
          client={selectedClient}
          open={detailsModalOpen}
          onOpenChange={setDetailsModalOpen}
        />
      </div>
    </MainLayout>
  );
};

export default Clientes;
