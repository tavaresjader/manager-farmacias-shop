import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/ui/search-bar";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { usePageTitle } from "@/hooks/usePageTitle";
import { PedidoDetailsModal } from "@/components/pedidos/PedidoDetailsModal";

interface Pedido {
  id: string;
  numero: string;
  cliente: string;
  data: string;
  status: "active" | "inactive" | "pending" | "processing" | "cancelled";
  total: number;
  itens: number;
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
  },
  {
    id: "2",
    numero: "#001235",
    cliente: "Maria Santos",
    data: "05/01/2026",
    status: "processing",
    total: 189.50,
    itens: 2,
  },
  {
    id: "3",
    numero: "#001236",
    cliente: "Carlos Oliveira",
    data: "04/01/2026",
    status: "active",
    total: 1250.00,
    itens: 5,
  },
  {
    id: "4",
    numero: "#001237",
    cliente: "Ana Costa",
    data: "04/01/2026",
    status: "inactive",
    total: 89.90,
    itens: 1,
  },
  {
    id: "5",
    numero: "#001238",
    cliente: "Pedro Mendes",
    data: "03/01/2026",
    status: "cancelled",
    total: 567.80,
    itens: 4,
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

const Pedidos = () => {
  usePageTitle("Pedidos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredPedidos = mockPedidos.filter((pedido) =>
    pedido.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pedido.cliente.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRowClick = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setModalOpen(true);
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
          onFilter={() => {}}
          className="max-w-md"
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
    </MainLayout>
  );
};

export default Pedidos;
