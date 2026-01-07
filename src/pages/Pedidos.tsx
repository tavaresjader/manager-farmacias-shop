import { useState, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/ui/search-bar";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { TabsFilter } from "@/components/ui/tabs-filter";
import { usePageTitle } from "@/hooks/usePageTitle";
import { PedidoDetailsModal } from "@/components/pedidos/PedidoDetailsModal";
import { PedidoFilterModal, PedidoFilters } from "@/components/pedidos/PedidoFilterModal";

import ifoodLogo from "@/assets/channels/ifood.webp";
import keetaLogo from "@/assets/channels/keeta.png";
import farmaciaShopLogo from "@/assets/channels/farmacia-shop.png";
import pedeProntoLogo from "@/assets/channels/pede-pronto.png";
import aiqfomeLogo from "@/assets/channels/aiqfome.jfif";

type Canal = "ifood" | "keeta" | "farmacia-shop" | "pede-pronto" | "aiqfome";

const channelLogos: Record<Canal, string> = {
  ifood: ifoodLogo,
  keeta: keetaLogo,
  "farmacia-shop": farmaciaShopLogo,
  "pede-pronto": pedeProntoLogo,
  aiqfome: aiqfomeLogo,
};

const channelNames: Record<Canal, string> = {
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
  canal: Canal;
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
    canal: "ifood",
  },
  {
    id: "2",
    numero: "#001235",
    cliente: "Maria Santos",
    data: "05/01/2026",
    status: "processing",
    total: 189.50,
    itens: 2,
    canal: "keeta",
  },
  {
    id: "3",
    numero: "#001236",
    cliente: "Carlos Oliveira",
    data: "04/01/2026",
    status: "active",
    total: 1250.00,
    itens: 5,
    canal: "farmacia-shop",
  },
  {
    id: "4",
    numero: "#001237",
    cliente: "Ana Costa",
    data: "04/01/2026",
    status: "inactive",
    total: 89.90,
    itens: 1,
    canal: "pede-pronto",
  },
  {
    id: "5",
    numero: "#001238",
    cliente: "Pedro Mendes",
    data: "03/01/2026",
    status: "cancelled",
    total: 567.80,
    itens: 4,
    canal: "aiqfome",
  },
];

const columns: Column<Pedido>[] = [
  {
    key: "numero",
    label: "Pedido",
    sortable: true,
    render: (item) => (
      <span className="font-medium text-foreground">{item.numero}</span>
    ),
  },
  {
    key: "canal",
    label: "Canal",
    render: (item) => (
      <div className="flex items-center gap-2">
        <img 
          src={channelLogos[item.canal]} 
          alt={channelNames[item.canal]} 
          className="w-6 h-6 rounded object-cover"
        />
      </div>
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

const Pedidos = () => {
  usePageTitle("Pedidos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<PedidoFilters>(initialFilters);
  const [activeTab, setActiveTab] = useState("all");

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

  const handleRowClick = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setModalOpen(true);
  };

  const handleApplyFilters = (newFilters: PedidoFilters) => {
    setFilters(newFilters);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Pedidos"
        breadcrumbs={[{ label: "pedidos" }]}
      />

      <div className="space-y-4">
        <SearchBar
          placeholder="Pesquisar por número ou cliente..."
          onSearch={setSearchQuery}
          onFilter={() => setFilterModalOpen(true)}
          className="max-w-md"
        />

        <TabsFilter
          tabs={statusTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <DataTable
          columns={columns}
          data={filteredPedidos}
          emptyMessage="Nenhum pedido encontrado"
          onRowClick={handleRowClick}
        />
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
