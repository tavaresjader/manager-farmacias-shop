import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageLoading } from "@/components/layout/PageLoading";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/ui/search-bar";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { TabsFilter } from "@/components/ui/tabs-filter";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageLoading } from "@/hooks/usePageLoading";
import { PedidoDetailsModal } from "@/components/pedidos/PedidoDetailsModal";
import { PedidoFilterModal, PedidoFilters } from "@/components/pedidos/PedidoFilterModal";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface Pedido {
  id: string;
  numero: string;
  cliente: string;
  data: string;
  status: "active" | "inactive" | "pending" | "processing" | "cancelled";
  total: number;
  itens: number;
  origem: Origem;
}

const mockPedidos: Pedido[] = [
  {
    id: "1",
    numero: "#001234",
    cliente: "João Silva",
    data: "05/01/2026",
    status: "pending",
    total: 459.90,
    itens: 3,
    origem: "ifood",
  },
  {
    id: "2",
    numero: "#001235",
    cliente: "Maria Santos",
    data: "05/01/2026",
    status: "processing",
    total: 189.50,
    itens: 2,
    origem: "keeta",
  },
  {
    id: "3",
    numero: "#001236",
    cliente: "Carlos Oliveira",
    data: "04/01/2026",
    status: "active",
    total: 1250.00,
    itens: 5,
    origem: "farmacia-shop",
  },
  {
    id: "4",
    numero: "#001237",
    cliente: "Ana Costa",
    data: "04/01/2026",
    status: "inactive",
    total: 89.90,
    itens: 1,
    origem: "pede-pronto",
  },
  {
    id: "5",
    numero: "#001238",
    cliente: "Pedro Mendes",
    data: "03/01/2026",
    status: "cancelled",
    total: 567.80,
    itens: 4,
    origem: "aiqfome",
  },
];

const columns: Column<Pedido>[] = [
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
    key: "numero",
    label: "Pedido",
    sortable: true,
    render: (item) => (
      <span className="font-medium text-foreground">{item.numero}</span>
    ),
  },
  {
    key: "cliente",
    label: "Cliente",
    sortable: true,
    render: (item) => (
      <span className="text-foreground">{item.cliente}</span>
    ),
  },
  {
    key: "data",
    label: "Data",
    sortable: true,
    render: (item) => (
      <span className="text-muted-foreground">{item.data}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    key: "itens",
    label: "Itens",
    sortable: true,
    render: (item) => (
      <span className="text-foreground">{item.itens}</span>
    ),
  },
  {
    key: "total",
    label: "Total",
    sortable: true,
    render: (item) => (
      <span className="text-primary font-medium">
        {item.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </span>
    ),
  },
];

const initialFilters: PedidoFilters = {
  dataInicio: undefined,
  dataFim: undefined,
  cliente: "",
  status: "all",
  unidade: "all",
};

const ITEMS_PER_PAGE = 10;

const Pedidos = () => {
  usePageTitle("Pedidos");
  const isLoading = usePageLoading();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<PedidoFilters>(initialFilters);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUnidade, setSelectedUnidade] = useState("all");

  const statusCounts = useMemo(() => {
    return {
      all: mockPedidos.length,
      pending: mockPedidos.filter(p => p.status === "pending").length,
      processing: mockPedidos.filter(p => p.status === "processing").length,
      active: mockPedidos.filter(p => p.status === "active").length,
      inactive: mockPedidos.filter(p => p.status === "inactive").length,
      cancelled: mockPedidos.filter(p => p.status === "cancelled").length,
    };
  }, []);

  const statusTabs = [
    { id: "all", label: "Todos", count: statusCounts.all },
    { id: "pending", label: "Pendentes", count: statusCounts.pending },
    { id: "processing", label: "Em andamento", count: statusCounts.processing },
    { id: "active", label: "Concluídos", count: statusCounts.active },
    { id: "inactive", label: "Inativos", count: statusCounts.inactive },
    { id: "cancelled", label: "Cancelados", count: statusCounts.cancelled },
  ];

  const filteredPedidos = mockPedidos.filter((pedido) => {
    const matchesSearch =
      pedido.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pedido.cliente.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === "all" || pedido.status === activeTab;

    const matchesStatus =
      filters.status === "all" || pedido.status === filters.status;

    const matchesCliente =
      !filters.cliente ||
      pedido.cliente.toLowerCase().includes(filters.cliente.toLowerCase());

    return matchesSearch && matchesTab && matchesStatus && matchesCliente;
  });

  const totalPages = Math.ceil(filteredPedidos.length / ITEMS_PER_PAGE);
  const paginatedPedidos = filteredPedidos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleRowClick = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setModalOpen(true);
  };

  const handleApplyFilters = (newFilters: PedidoFilters) => {
    setFilters(newFilters);
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
      <PageHeader
        title="Pedidos"
        breadcrumbs={[]}
      />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Select value={selectedUnidade} onValueChange={setSelectedUnidade}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecione a unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as unidades</SelectItem>
              <SelectItem value="1">Unidade Centro</SelectItem>
              <SelectItem value="2">Unidade Norte</SelectItem>
              <SelectItem value="3">Unidade Sul</SelectItem>
            </SelectContent>
          </Select>
          <SearchBar
            placeholder="Pesquisar por número ou cliente..."
            onSearch={handleSearch}
            onFilter={() => setFilterModalOpen(true)}
            className="flex-1 max-w-md"
          />
        </div>

        <TabsFilter
          tabs={statusTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        <DataTable
          columns={columns}
          data={paginatedPedidos}
          emptyMessage="Nenhum pedido encontrado"
          onRowClick={handleRowClick}
        />

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-sm text-muted-foreground">
            {filteredPedidos.length} pedido{filteredPedidos.length !== 1 ? 's' : ''} encontrado{filteredPedidos.length !== 1 ? 's' : ''}
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-4">
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
      </div>

      <PedidoDetailsModal
        pedido={selectedPedido}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <PedidoFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={filters}
        onApplyFilters={handleApplyFilters}
      />
    </MainLayout>
  );
};

export default Pedidos;
