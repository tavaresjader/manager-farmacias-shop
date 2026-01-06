import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/ui/search-bar";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Package } from "lucide-react";

interface Produto {
  id: string;
  nome: string;
  sku: string;
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
    categoria: "Vestuário",
    preco: 59.90,
    estoque: 150,
    status: "active",
  },
  {
    id: "2",
    nome: "Tênis Esportivo",
    sku: "TEN-002",
    categoria: "Calçados",
    preco: 299.90,
    estoque: 45,
    status: "active",
  },
  {
    id: "3",
    nome: "Bolsa Couro",
    sku: "BOL-003",
    categoria: "Acessórios",
    preco: 189.90,
    estoque: 0,
    status: "inactive",
  },
  {
    id: "4",
    nome: "Relógio Digital",
    sku: "REL-004",
    categoria: "Acessórios",
    preco: 459.90,
    estoque: 23,
    status: "active",
  },
  {
    id: "5",
    nome: "Jaqueta Jeans",
    sku: "JAQ-005",
    categoria: "Vestuário",
    preco: 349.90,
    estoque: 8,
    status: "pending",
  },
];

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
];

const Produtos = () => {
  usePageTitle("Produtos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProdutos = mockProdutos.filter((produto) =>
    produto.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
    produto.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <PageHeader
        title="Produtos"
        breadcrumbs={[{ label: "produtos" }]}
      />

      <div className="space-y-4">
        <SearchBar
          placeholder="Pesquisar por nome, SKU ou categoria..."
          onSearch={setSearchQuery}
          onFilter={() => {}}
          className="max-w-md"
        />

        <DataTable
          columns={columns}
          data={filteredProdutos}
          emptyMessage="Nenhum produto encontrado"
        />
      </div>
    </MainLayout>
  );
};

export default Produtos;
