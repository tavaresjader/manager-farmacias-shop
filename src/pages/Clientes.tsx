import { useEffect, useRef, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageLoading } from "@/components/layout/PageLoading";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/ui/search-bar";
import { TabsFilter } from "@/components/ui/tabs-filter";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageLoading } from "@/hooks/usePageLoading";
import { Mail, Phone } from "lucide-react";
import { ClienteFilterModal, ClienteFilters } from "@/components/clientes/ClienteFilterModal";
import { ClienteDetailsModal } from "@/components/clientes/ClienteDetailsModal";
import { managerBackendBff } from "@/services/ManagerBackendBff";
import { toast } from "sonner";

interface Address { id: string; street: string; number: string; complement?: string; neighborhood: string; city: string; state: string; zipCode: string; isDefault?: boolean; }
type CustomerStatus = "active" | "inactive" | "blocked";
interface Client { id: string; name: string; email: string; phone: string; document: string; status: CustomerStatus; totalSpent: number; createdAt: string; addresses: Address[]; }
interface CustomerApiResponse { id: string; name?: string | null; document?: string | null; email?: string | null; phone?: string | null; status?: "ACTIVE" | "INACTIVE" | "BLOCKED" | null; purchaseTotal: number; createdAt: string; }
interface CustomerAddressApiResponse {
  id?: string;
  address?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  district?: string | null;
  state?: string | null;
  postalCode?: string | null;
  default?: boolean | null;
}
interface CustomerDetailsApiResponse extends CustomerApiResponse {
  addresses?: CustomerAddressApiResponse[] | null;
}

const initialFilters: ClienteFilters = { status: "all", dataCadastro: undefined };
const tabs = [{ id: "all", label: "Todos" }, { id: "active", label: "Ativos" }, { id: "inactive", label: "Inativos" }, { id: "blocked", label: "Bloqueados" }];
const statusLabels: Record<CustomerStatus, string> = { active: "Ativo", inactive: "Inativo", blocked: "Bloqueado" };
const statusParams: Record<string, number> = { active: 1, inactive: 2, blocked: 3 };

function toClient(customer: CustomerApiResponse): Client {
  const statuses: Record<NonNullable<CustomerApiResponse["status"]>, CustomerStatus> = { ACTIVE: "active", INACTIVE: "inactive", BLOCKED: "blocked" };
  return {
    id: customer.id,
    name: customer.name?.trim() || "Cliente sem nome",
    document: customer.document?.trim() || "Não informado",
    email: customer.email?.trim() || "Não informado",
    phone: customer.phone?.trim() || "Não informado",
    status: customer.status ? statuses[customer.status] : "inactive",
    totalSpent: customer.purchaseTotal,
    createdAt: customer.createdAt,
    addresses: [],
  };
}

function toClientDetails(customer: CustomerDetailsApiResponse): Client {
  const client = toClient(customer);

  return {
    ...client,
    addresses: (customer.addresses ?? []).map((address, index) => ({
      id: address.id ?? `${customer.id}-${index}`,
      street: address.address?.trim() || "Não informado",
      number: address.number?.trim() || "S/N",
      complement: address.complement?.trim() || undefined,
      neighborhood: address.neighborhood?.trim() || "Não informado",
      city: address.city?.trim() || "Não informado",
      state: address.district?.trim() || address.state?.trim() || "Não informado",
      zipCode: address.postalCode?.trim() || "Não informado",
      isDefault: address.default ?? false,
    })),
  };
}

const columns: Column<Client>[] = [
  { key: "name", label: "Cliente", sortable: true, render: (item) => <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-sm font-medium text-primary">{item.name.split(" ").map((name) => name[0]).join("").slice(0, 2).toUpperCase()}</span></div><div><span className="font-medium text-foreground">{item.name}</span><p className="text-xs text-muted-foreground mt-0.5">{item.document}</p></div></div> },
  { key: "contact", label: "Contato", render: (item) => <div className="space-y-1"><div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Mail className="w-3 h-3" />{item.email}</div><div className="flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="w-3 h-3" />{item.phone}</div></div> },
  { key: "status", label: "Status", render: (item) => <StatusBadge status={item.status} label={statusLabels[item.status]} /> },
  { key: "totalSpent", label: "Total Compras", sortable: true, render: (item) => <span className="text-foreground font-medium">{item.totalSpent.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span> },
  { key: "createdAt", label: "Cliente desde", sortable: true, render: (item) => <span className="text-muted-foreground">{new Date(item.createdAt).toLocaleDateString("pt-BR")}</span> },
];

const Clientes = () => {
  usePageTitle("Clientes");
  const isPageLoading = usePageLoading();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [filters, setFilters] = useState<ClienteFilters>(initialFilters);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingCustomerDetails, setLoadingCustomerDetails] = useState(false);
  const detailsRequestId = useRef(0);

  const selectedStatus = activeTab;

  useEffect(() => {
    let cancelled = false;
    const fetchClients = async () => {
      setLoadingClients(true);
      const params: Record<string, string | number | boolean> = {};
      if (searchQuery.trim()) params.term = searchQuery.trim();
      if (selectedStatus !== "all") params.status = statusParams[selectedStatus];
      if (filters.dataCadastro) params.createdAt = filters.dataCadastro.toISOString();

      const response = await managerBackendBff.get<CustomerApiResponse[]>("/v1/Customers", { params });
      if (cancelled) return;
      if (response.data) {
        setClients(response.data.map(toClient));
      } else {
        setClients([]);
        toast.error(`Erro ao carregar clientes: ${response.error ?? "Tente novamente."}`);
      }
      setLoadingClients(false);
    };
    fetchClients();
    return () => { cancelled = true; };
  }, [filters.dataCadastro, searchQuery, selectedStatus]);

  const handleApplyFilters = (newFilters: ClienteFilters) => {
    setFilters(newFilters);
    setActiveTab(newFilters.status);
  };

  const handleTabChange = (status: string) => {
    setActiveTab(status);
    setFilters((currentFilters) => ({ ...currentFilters, status }));
  };

  const handleClientClick = async (client: Client) => {
    const requestId = ++detailsRequestId.current;
    setSelectedClient(null);
    setDetailsModalOpen(true);
    setLoadingCustomerDetails(true);

    const response = await managerBackendBff.get<CustomerDetailsApiResponse>(
      `/v1/Customers/${encodeURIComponent(client.id)}`,
    );

    if (requestId !== detailsRequestId.current) return;

    if (response.data) {
      setSelectedClient(toClientDetails(response.data));
    } else {
      setDetailsModalOpen(false);
      toast.error(`Erro ao carregar detalhes do cliente: ${response.error ?? "Tente novamente."}`);
    }

    setLoadingCustomerDetails(false);
  };

  const handleDetailsModalOpenChange = (open: boolean) => {
    setDetailsModalOpen(open);
    if (!open) {
      detailsRequestId.current += 1;
      setLoadingCustomerDetails(false);
      setSelectedClient(null);
    }
  };

  const handleCustomerStatusChange = async (client: Client): Promise<boolean> => {
    const endpoint = client.status === "active" ? "block" : "unlock";
    const response = await managerBackendBff.patch<unknown>(
      `/v1/Customers/${encodeURIComponent(client.id)}/${endpoint}`,
    );

    if (response.error) {
      toast.error(`Erro ao atualizar status do cliente: ${response.error}`);
      return false;
    }

    const detailsResponse = await managerBackendBff.get<CustomerDetailsApiResponse>(
      `/v1/Customers/${encodeURIComponent(client.id)}`,
    );

    if (!detailsResponse.data) {
      toast.error(`Status atualizado, mas não foi possível recarregar os detalhes: ${detailsResponse.error ?? "Tente novamente."}`);
      handleDetailsModalOpenChange(false);
      return true;
    }

    const updatedClient = toClientDetails(detailsResponse.data);
    setSelectedClient(updatedClient);
    setClients((currentClients) => currentClients.map((currentClient) => (
      currentClient.id === updatedClient.id
        ? { ...currentClient, status: updatedClient.status }
        : currentClient
    )));
    toast.success("Status do cliente atualizado com sucesso.");
    return true;
  };

  if (isPageLoading) return <MainLayout><PageLoading /></MainLayout>;

  return <MainLayout>
    <PageHeader title="Clientes" breadcrumbs={[]} />
    <div className="space-y-4">
      <SearchBar placeholder="Pesquisar por nome, documento ou e-mail..." value={searchQuery} onSearch={setSearchQuery} onFilter={() => setFilterModalOpen(true)} />
      <TabsFilter tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
      <DataTable columns={columns} data={clients} emptyMessage="Nenhum cliente encontrado" loading={loadingClients} onRowClick={handleClientClick} />
      <ClienteFilterModal open={filterModalOpen} onOpenChange={setFilterModalOpen} filters={filters} onApplyFilters={handleApplyFilters} />
      <ClienteDetailsModal client={selectedClient} open={detailsModalOpen} onOpenChange={handleDetailsModalOpenChange} loading={loadingCustomerDetails} onStatusChange={handleCustomerStatusChange} />
    </div>
  </MainLayout>;
};

export default Clientes;
