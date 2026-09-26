import { useEffect, useMemo, useRef, useState } from "react";
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
import { managerBackendBff } from "@/services/ManagerBackendBff";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ifoodLogo from "@/assets/channels/ifood.webp";
import keetaLogo from "@/assets/channels/keeta.png";
import farmaciaShopLogo from "@/assets/logo-farmacia-shop.png";
import pedeProntoLogo from "@/assets/channels/pede-pronto.png";
import aiqfomeLogo from "@/assets/channels/aiqfome.jfif";

type Origem = "ifood" | "keeta" | "farmacia-shop" | "pede-pronto" | "aiqfome" | "unknown";
type PedidoStatus = "active" | "inactive" | "pending" | "processing" | "cancelled";
type PedidoStatusKey =
  | "created"
  | "ready-for-handling"
  | "ready-for-pickup"
  | "ready-for-delivery"
  | "dispatched"
  | "in-delivery"
  | "completed"
  | "cancelled";

const origemLogos: Record<Origem, string> = {
  ifood: ifoodLogo,
  keeta: keetaLogo,
  "farmacia-shop": farmaciaShopLogo,
  "pede-pronto": pedeProntoLogo,
  aiqfome: aiqfomeLogo,
  unknown: farmaciaShopLogo,
};

const origemNames: Record<Origem, string> = {
  ifood: "iFood",
  keeta: "Keeta",
  "farmacia-shop": "Farmácia Shop",
  "pede-pronto": "Pede Pronto",
  aiqfome: "aiqfome",
  unknown: "Canal não informado",
};

interface Pedido {
  id: string;
  numero: string;
  cliente: string;
  telefone?: string;
  endereco?: string;
  data: string;
  status: PedidoStatus;
  statusKey: PedidoStatusKey;
  statusLabel?: string;
  tipo: "delivery" | "retirada";
  total: number;
  taxaEntrega: number;
  itens: number;
  items?: PedidoItem[];
  hasPrescription?: boolean;
  origem: Origem;
  origemLogoUrl?: string;
  origemLabel: string;
  unidade: string;
  merchantId?: string;
}

interface PedidoItem {
  nome: string;
  quantidade: number;
  preco: number;
}

interface PedidoApi {
  id?: string;
  salesChannelIconUrl?: string | null;
  merchantId?: string | null;
  merchantName?: string | null;
  displayId?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
  customerAddress?: string | null;
  createdAt?: string;
  status?: string | null;
  type?: string | null;
  itens?: number;
  amount?: number;
  shippingValue?: number;
  hasPrescription?: boolean;
  Id?: string;
  SalesChannelIconUrl?: string | null;
  MerchantId?: string | null;
  MerchantName?: string | null;
  DisplayId?: string | null;
  CustomerName?: string | null;
  CustomerPhone?: string | null;
  CustomerAddress?: string | null;
  CreatedAt?: string;
  Status?: string | null;
  Type?: string | null;
  Itens?: number;
  Amount?: number;
  ShippingValue?: number;
  HasPrescription?: boolean;
}

interface PedidoItemApi {
  productName?: string | null;
  quantity?: number;
  amount?: number;
  ProductName?: string | null;
  Quantity?: number;
  Amount?: number;
}

interface PedidoDetalheApi extends PedidoApi {
  itens?: PedidoItemApi[] | number | null;
  Itens?: PedidoItemApi[] | number | null;
}

const normalizeText = (value?: string | null) =>
  value
    ?.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") ?? "";

const resolveOrigem = (iconUrl?: string | null): Origem => {
  const normalized = normalizeText(iconUrl);
  if (normalized.includes("ifood")) return "ifood";
  if (normalized.includes("keeta")) return "keeta";
  if (normalized.includes("pede-pronto")) return "pede-pronto";
  if (normalized.includes("aiqfome")) return "aiqfome";
  if (normalized.includes("farmacia-shop")) return "farmacia-shop";
  return "unknown";
};

const statusLabels: Record<PedidoStatusKey, string> = {
  created: "Criado",
  "ready-for-handling": "Pronto para manuseio",
  "ready-for-pickup": "Pronto para retirada",
  "ready-for-delivery": "Pronto para entrega",
  dispatched: "Despachado",
  "in-delivery": "Em entrega",
  completed: "Concluído",
  cancelled: "Cancelado",
};

const resolveStatusInfo = (status?: string | null): {
  status: PedidoStatus;
  statusKey: PedidoStatusKey;
  statusLabel: string;
} => {
  const normalized = normalizeText(status);

  if (["cancelled", "canceled", "cancelado"].includes(normalized)) {
    return { status: "cancelled", statusKey: "cancelled", statusLabel: statusLabels.cancelled };
  }

  if (["delivered", "entregue", "completed", "complete", "concluded", "concluido", "finished", "finalizado"].includes(normalized)) {
    return { status: "active", statusKey: "completed", statusLabel: statusLabels.completed };
  }

  if (["in-delivery", "em-entrega", "delivering", "out-for-delivery", "saiu-para-entrega"].includes(normalized)) {
    return { status: "processing", statusKey: "in-delivery", statusLabel: statusLabels["in-delivery"] };
  }

  if (["dispatched", "despachado", "dispatch", "despachada"].includes(normalized)) {
    return { status: "processing", statusKey: "dispatched", statusLabel: statusLabels.dispatched };
  }

  if (["ready-for-delivery", "pronto-para-entrega", "ready-to-deliver"].includes(normalized)) {
    return { status: "processing", statusKey: "ready-for-delivery", statusLabel: statusLabels["ready-for-delivery"] };
  }

  if (["ready-for-pickup", "pronto-para-retirada", "ready-to-pickup", "ready-for-collect"].includes(normalized)) {
    return { status: "processing", statusKey: "ready-for-pickup", statusLabel: statusLabels["ready-for-pickup"] };
  }

  if (["ready-for-handling", "pronto-para-manuseio", "ready-to-handle", "ready-for-preparation"].includes(normalized)) {
    return { status: "processing", statusKey: "ready-for-handling", statusLabel: statusLabels["ready-for-handling"] };
  }

  if (["handling", "preparing", "processing", "processando", "in-progress", "em-andamento", "confirmed", "confirmado", "accepted", "aceito", "ready-for-pickup", "dispatched"].includes(normalized)) {
    return { status: "processing", statusKey: "ready-for-handling", statusLabel: statusLabels["ready-for-handling"] };
  }

  return { status: "pending", statusKey: "created", statusLabel: statusLabels.created };
};

const resolveTipo = (type?: string | null): Pedido["tipo"] => {
  const normalized = normalizeText(type);
  if (["pickup", "retirada", "takeout", "balcao"].includes(normalized)) return "retirada";
  return "delivery";
};

const formatDate = (value?: string) => {
  if (!value) return "Não informado";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Não informado";
  return date.toLocaleDateString("pt-BR");
};

const toDateTimeParam = (date: Date, endOfDay = false) => {
  const value = new Date(date);
  if (endOfDay) {
    value.setHours(23, 59, 59, 999);
  } else {
    value.setHours(0, 0, 0, 0);
  }
  return value.toISOString();
};

const toPedido = (pedido: PedidoApi, index: number): Pedido => {
  const id = pedido.id ?? pedido.Id ?? `${pedido.displayId ?? pedido.DisplayId ?? "pedido"}-${index}`;
  const iconUrl = pedido.salesChannelIconUrl ?? pedido.SalesChannelIconUrl;
  const origem = resolveOrigem(iconUrl);
  const status = pedido.status ?? pedido.Status;
  const statusInfo = resolveStatusInfo(status);
  const displayId = pedido.displayId ?? pedido.DisplayId;
  const type = pedido.type ?? pedido.Type;
  const itens = pedido.itens ?? pedido.Itens;

  return {
    id,
    numero: displayId?.trim() || "Pedido sem código",
    cliente: (pedido.customerName ?? pedido.CustomerName)?.trim() || "Cliente não informado",
    telefone: (pedido.customerPhone ?? pedido.CustomerPhone)?.trim() || undefined,
    endereco: (pedido.customerAddress ?? pedido.CustomerAddress)?.trim() || undefined,
    data: formatDate(pedido.createdAt ?? pedido.CreatedAt),
    status: statusInfo.status,
    statusKey: statusInfo.statusKey,
    statusLabel: statusInfo.statusLabel,
    tipo: resolveTipo(type),
    total: pedido.amount ?? pedido.Amount ?? 0,
    taxaEntrega: pedido.shippingValue ?? pedido.ShippingValue ?? 0,
    itens: typeof itens === "number" ? itens : 0,
    hasPrescription: pedido.hasPrescription ?? pedido.HasPrescription ?? false,
    origem,
    origemLogoUrl: iconUrl || undefined,
    origemLabel: origemNames[origem],
    unidade: (pedido.merchantName ?? pedido.MerchantName)?.trim() || "Unidade não informada",
    merchantId: pedido.merchantId ?? pedido.MerchantId ?? undefined,
  };
};

const toPedidoDetalhe = (pedido: PedidoDetalheApi, fallback: Pedido): Pedido => {
  const base = toPedido(pedido, 0);
  const itens = pedido.itens ?? pedido.Itens;
  const items = Array.isArray(itens)
    ? itens.map((item) => ({
        nome: (item.productName ?? item.ProductName)?.trim() || "Produto não informado",
        quantidade: item.quantity ?? item.Quantity ?? 0,
        preco: item.amount ?? item.Amount ?? 0,
      }))
    : undefined;

  return {
    ...fallback,
    ...base,
    id: base.id || fallback.id,
    origem: base.origem === "unknown" ? fallback.origem : base.origem,
    origemLogoUrl: base.origemLogoUrl ?? fallback.origemLogoUrl,
    origemLabel: base.origemLabel || fallback.origemLabel,
    items,
    itens: items?.length ?? base.itens,
  };
};

const columns: Column<Pedido>[] = [
  {
    key: "origem",
    label: "Origem",
    render: (item) => (
      <div className="flex items-center gap-2">
        <img 
          src={item.origemLogoUrl || origemLogos[item.origem]} 
          alt={item.origemLabel} 
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
    render: (item) => <StatusBadge status={item.status} label={item.statusLabel} />,
  },
  {
    key: "tipo",
    label: "Tipo",
    render: (item) => (
      <span className="text-foreground capitalize">{item.tipo === "delivery" ? "Delivery" : "Retirada"}</span>
    ),
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
};

const Pedidos = () => {
  usePageTitle("Pedidos");
  const isLoading = usePageLoading();
  const { session } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<PedidoFilters>(initialFilters);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUnidade, setSelectedUnidade] = useState("all");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [loadingPedidoDetails, setLoadingPedidoDetails] = useState(false);
  const [ordersReloadKey, setOrdersReloadKey] = useState(0);
  const detailRequestRef = useRef(0);

  const unidades = session?.merchants ?? [];

  useEffect(() => {
    let cancelled = false;

    const fetchPedidos = async () => {
      setLoadingPedidos(true);

      const params: Record<string, string | number | boolean> = {};
      const term = searchQuery || filters.cliente;

      if (selectedUnidade !== "all") params.merchantId = selectedUnidade;
      if (filters.dataInicio) params.startAt = toDateTimeParam(filters.dataInicio);
      if (filters.dataFim) params.endAt = toDateTimeParam(filters.dataFim, true);
      if (term) params.term = term;

      const response = await managerBackendBff.get<PedidoApi[]>("/v1/Orders", { params });

      if (cancelled) return;

      if (response.data) {
        setPedidos(response.data.map(toPedido));
      } else {
        setPedidos([]);
        toast.error(`Erro ao carregar pedidos: ${response.error ?? "Tente novamente."}`);
      }

      setLoadingPedidos(false);
    };

    fetchPedidos();

    return () => {
      cancelled = true;
    };
  }, [filters.dataFim, filters.dataInicio, filters.cliente, searchQuery, selectedUnidade, ordersReloadKey]);

  const statusCounts = useMemo(() => {
    return {
      all: pedidos.length,
      pending: pedidos.filter(p => p.status === "pending").length,
      processing: pedidos.filter(p => p.status === "processing").length,
      active: pedidos.filter(p => p.status === "active").length,
      cancelled: pedidos.filter(p => p.status === "cancelled").length,
    };
  }, [pedidos]);

  const statusTabs = [
    { id: "all", label: "Todos", count: statusCounts.all },
    { id: "pending", label: "Novos", count: statusCounts.pending },
    { id: "processing", label: "Em andamento", count: statusCounts.processing },
    { id: "active", label: "Concluídos", count: statusCounts.active },
    { id: "cancelled", label: "Cancelados", count: statusCounts.cancelled },
  ];

  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesSearch =
      pedido.numero.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pedido.cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pedido.unidade.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = activeTab === "all" || pedido.status === activeTab;

    const matchesStatus =
      filters.status === "all" ||
      pedido.status === filters.status ||
      pedido.statusKey === filters.status;

    const matchesCliente =
      !filters.cliente ||
      pedido.cliente.toLowerCase().includes(filters.cliente.toLowerCase());

    return matchesSearch && matchesTab && matchesStatus && matchesCliente;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPedidos.length / pageSize));
  const paginatedPedidos = filteredPedidos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleRowClick = async (pedido: Pedido) => {
    const requestId = detailRequestRef.current + 1;
    detailRequestRef.current = requestId;

    setSelectedPedido(pedido);
    setModalOpen(true);
    setLoadingPedidoDetails(true);

    const response = await managerBackendBff.get<PedidoDetalheApi>(`/v1/Orders/${encodeURIComponent(pedido.id)}`);

    if (detailRequestRef.current !== requestId) return;

    if (response.data) {
      setSelectedPedido(toPedidoDetalhe(response.data, pedido));
    } else {
      toast.error(`Erro ao carregar detalhes do pedido: ${response.error ?? "Tente novamente."}`);
    }

    setLoadingPedidoDetails(false);
  };

  const handleApplyFilters = (newFilters: PedidoFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setOrdersReloadKey((value) => value + 1);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
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
      <PageHeader
        title="Pedidos"
        breadcrumbs={[]}
      />

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Select
            value={selectedUnidade}
            onValueChange={(value) => {
              setSelectedUnidade(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[200px] bg-white dark:bg-background">
              <SelectValue placeholder="Selecione a unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as unidades</SelectItem>
              {unidades.map((unidade) => (
                <SelectItem key={unidade.id} value={unidade.id}>
                  {unidade.name ?? "Unidade sem nome"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <SearchBar
            placeholder="Pesquisar por número ou cliente..."
            value={searchQuery}
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
          loading={loadingPedidos}
          onRowClick={handleRowClick}
          pagination={
            filteredPedidos.length > 0
              ? {
                  currentPage,
                  totalPages,
                  pageSize,
                  totalItems: filteredPedidos.length,
                  onPageChange: setCurrentPage,
                  onPageSizeChange: handlePageSizeChange,
                }
              : undefined
          }
        />
      </div>

      <PedidoDetailsModal
        pedido={selectedPedido}
        loading={loadingPedidoDetails}
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open) {
            detailRequestRef.current += 1;
            setLoadingPedidoDetails(false);
          }
        }}
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
