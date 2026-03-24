import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageLoading } from "@/components/layout/PageLoading";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/ui/search-bar";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageLoading } from "@/hooks/usePageLoading";
import { Package } from "lucide-react";
import { ProdutoFilterModal, ProdutoFilters, CategoriaOption } from "@/components/produtos/ProdutoFilterModal";
import { ProdutoDetailsModal } from "@/components/produtos/ProdutoDetailsModal";
import { managerBackendBff } from "@/services/ManagerBackendBff";
import { toast } from "sonner";

interface Produto {
  id: string;
  nome: string;
  sku: string;
  ean: string;
  categoria: string;
  preco: number;
  estoque: number;
  status: "active" | "inactive" | "pending";
  controlado: boolean;
}

const initialFilters: ProdutoFilters = {
  categoria: "all",
  nome: "",
};

const columns: Column<Produto>[] = [
  {
    key: "nome",
    label: "Produto",
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Package className="w-4 h-4 text-primary" />
        </div>
        <div>
          <span className="font-medium text-foreground block">{item.nome}</span>
          <span className="text-xs text-muted-foreground">{item.sku}</span>
        </div>
      </div>
    ),
  },
  {
    key: "categoria",
    label: "Categoria",
    sortable: true,
    render: (item) => (
      <span className="text-foreground">{item.categoria}</span>
    ),
  },
];

const Produtos = () => {
  usePageTitle("Produtos");
  const isLoading = usePageLoading();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<ProdutoFilters>(initialFilters);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaOption[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loadingProdutos, setLoadingProdutos] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      const response = await managerBackendBff.get<Array<{ id: string; name: string }>>("/v1/Products/categories");
      if (response.data) {
        setCategorias(response.data.map((cat) => ({ value: cat.name, label: cat.name })));
      } else if (response.error) {
        toast.error("Erro ao carregar categorias: " + response.error);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoadingProdutos(true);
      const params: Record<string, string | number | boolean> = {
        page: currentPage,
        pageSize,
      };
      if (searchQuery) params.search = searchQuery;
      if (filters.categoria && filters.categoria !== "all") params.category = filters.categoria;
      if (filters.nome) params.name = filters.nome;

      const response = await managerBackendBff.get<{ items: Produto[]; totalItems: number }>("/v1/Products", { params });
      if (response.data) {
        setProdutos(response.data.items ?? response.data as any);
        setTotalItems(response.data.totalItems ?? (Array.isArray(response.data) ? (response.data as any).length : 0));
      } else if (response.error) {
        toast.error("Erro ao carregar produtos: " + response.error);
      }
      setLoadingProdutos(false);
    };
    fetchProdutos();
  }, [currentPage, pageSize, searchQuery, filters]);

  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleApplyFilters = (newFilters: ProdutoFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleRowClick = (produto: Produto) => {
    setSelectedProduto(produto);
    setDetailsModalOpen(true);
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
        title="Produtos"
        breadcrumbs={[]}
      />

      <div className="space-y-4">
        <SearchBar
          placeholder="Pesquisar por nome, SKU ou categoria..."
          onSearch={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
          onFilter={() => setFilterModalOpen(true)}
          className="max-w-md"
        />

        <DataTable
          columns={columns}
          data={produtos}
          emptyMessage="Nenhum produto encontrado"
          onRowClick={handleRowClick}
          pagination={{
            currentPage,
            totalPages,
            pageSize,
            totalItems,
            onPageChange: handlePageChange,
            onPageSizeChange: handlePageSizeChange,
          }}
        />
      </div>

      <ProdutoFilterModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        filters={filters}
        onApplyFilters={handleApplyFilters}
        categorias={categorias}
      />

      <ProdutoDetailsModal
        produto={selectedProduto}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
    </MainLayout>
  );
};

export default Produtos;
