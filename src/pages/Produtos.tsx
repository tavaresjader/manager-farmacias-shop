import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/ui/search-bar";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Package } from "lucide-react";
import { ProdutoFilterModal, ProdutoFilters } from "@/components/produtos/ProdutoFilterModal";
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
}

const mockProdutos: Produto[] = [
  {
    id: "1",
    nome: "Camiseta Básica",
    sku: "CAM-001",
    ean: "7891234567890",
    categoria: "Vestuário",
    preco: 59.90,
    estoque: 150,
    status: "active",
  },
  {
    id: "2",
    nome: "Tênis Esportivo",
    sku: "TEN-002",
    ean: "7891234567891",
    categoria: "Calçados",
    preco: 299.90,
    estoque: 45,
    status: "active",
  },
  {
    id: "3",
    nome: "Bolsa Couro",
    sku: "BOL-003",
    ean: "7891234567892",
    categoria: "Acessórios",
    preco: 189.90,
    estoque: 0,
    status: "inactive",
  },
  {
    id: "4",
    nome: "Relógio Digital",
    sku: "REL-004",
    ean: "7891234567893",
    categoria: "Acessórios",
    preco: 459.90,
    estoque: 23,
    status: "active",
  },
  {
    id: "5",
    nome: "Jaqueta Jeans",
    sku: "JAQ-005",
    ean: "7891234567894",
    categoria: "Vestuário",
    preco: 349.90,
    estoque: 8,
    status: "pending",
  },
];

const initialFilters: ProdutoFilters = {
  categoria: "all",
  nome: "",
  sku: "",
  ean: "",
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
  {
    key: "preco",
    label: "Preço",
    sortable: true,
    render: (item) => (
      <span className="text-primary font-medium">
        {item.preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </span>
    ),
  },
  {
    key: "estoque",
    label: "Estoque",
    sortable: true,
    render: (item) => (
      <span className={item.estoque === 0 ? "text-destructive font-medium" : "text-foreground"}>
        {item.estoque}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    key: "actions",
    label: "Ações",
    render: (item) => (
      <Button
        variant={item.status === "active" ? "outline" : "default"}
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          const newStatus = item.status === "active" ? "inactive" : "active";
          toast.success(
            newStatus === "active"
              ? `Produto "${item.nome}" ativado com sucesso!`
              : `Produto "${item.nome}" inativado com sucesso!`
          );
        }}
      >
        {item.status === "active" ? "Inativar" : "Ativar"}
      </Button>
    ),
  },
];

const Produtos = () => {
  usePageTitle("Produtos");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState<ProdutoFilters>(initialFilters);

  const filteredProdutos = mockProdutos.filter((produto) => {
    const matchesSearch =
      produto.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      produto.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      produto.categoria.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategoria =
      filters.categoria === "all" || produto.categoria === filters.categoria;

    const matchesNome =
      !filters.nome ||
      produto.nome.toLowerCase().includes(filters.nome.toLowerCase());

    const matchesSku =
      !filters.sku ||
      produto.sku.toLowerCase().includes(filters.sku.toLowerCase());

    const matchesEan =
      !filters.ean ||
      produto.ean.toLowerCase().includes(filters.ean.toLowerCase());

    return matchesSearch && matchesCategoria && matchesNome && matchesSku && matchesEan;
  });

  const totalPages = Math.ceil(filteredProdutos.length / pageSize);
  const paginatedProdutos = filteredProdutos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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

  return (
    <MainLayout>
      <PageHeader
        title="Produtos"
        breadcrumbs={[{ label: "produtos" }]}
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
          data={paginatedProdutos}
          emptyMessage="Nenhum produto encontrado"
          pagination={{
            currentPage,
            totalPages,
            pageSize,
            totalItems: filteredProdutos.length,
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
      />
    </MainLayout>
  );
};

export default Produtos;
