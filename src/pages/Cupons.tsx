import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageLoading } from "@/components/layout/PageLoading";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageLoading } from "@/hooks/usePageLoading";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { CupomDetailsModal } from "@/components/cupons/CupomDetailsModal";
import { CupomEditModal } from "@/components/cupons/CupomEditModal";
import { Plus, Percent, DollarSign, Tag } from "lucide-react";

interface Cupom {
  id: string;
  codigo: string;
  desconto: string;
  tipo: "percentual" | "fixo";
  minimo: number;
  usos: number;
  limite: number;
  validade: string;
  status: "active" | "inactive" | "cancelled";
}

const mockCupons: Cupom[] = [
  {
    id: "1",
    codigo: "PRIMEIRACOMPRA",
    desconto: "10%",
    tipo: "percentual",
    minimo: 50,
    usos: 234,
    limite: 500,
    validade: "31/12/2026",
    status: "active",
  },
  {
    id: "2",
    codigo: "FRETEGRATIS",
    desconto: "R$ 15,00",
    tipo: "fixo",
    minimo: 100,
    usos: 89,
    limite: 100,
    validade: "15/02/2026",
    status: "active",
  },
  {
    id: "3",
    codigo: "BLACKFRIDAY",
    desconto: "25%",
    tipo: "percentual",
    minimo: 150,
    usos: 500,
    limite: 500,
    validade: "30/11/2025",
    status: "cancelled",
  },
  {
    id: "4",
    codigo: "VERAO2026",
    desconto: "15%",
    tipo: "percentual",
    minimo: 80,
    usos: 0,
    limite: 200,
    validade: "28/02/2026",
    status: "inactive",
  },
];

const statusLabels: Record<string, string> = {
  active: "Ativo",
  inactive: "Inativo",
  cancelled: "Expirado",
};

const columns: Column<Cupom>[] = [
  {
    key: "codigo",
    label: "Código",
    sortable: true,
    render: (cupom) => (
      <span className="font-mono font-semibold text-foreground">{cupom.codigo}</span>
    ),
  },
  {
    key: "tipo",
    label: "Tipo",
    sortable: true,
    render: (cupom) => (
      <div className="flex items-center gap-1.5">
        {cupom.tipo === "percentual" ? (
          <Percent className="w-4 h-4 text-muted-foreground" />
        ) : (
          <DollarSign className="w-4 h-4 text-muted-foreground" />
        )}
        <span>{cupom.tipo === "percentual" ? "Percentual" : "Valor Fixo"}</span>
      </div>
    ),
  },
  {
    key: "desconto",
    label: "Desconto",
    sortable: true,
    render: (cupom) => (
      <span className="font-medium">{cupom.desconto}</span>
    ),
  },
  {
    key: "minimo",
    label: "Mínimo",
    sortable: true,
    render: (cupom) => (
      <span>R$ {cupom.minimo.toFixed(2).replace(".", ",")}</span>
    ),
  },
  {
    key: "usos",
    label: "Usos",
    sortable: true,
    render: (cupom) => (
      <span>
        {cupom.usos}/{cupom.limite}
      </span>
    ),
  },
  {
    key: "validade",
    label: "Validade",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
    render: (cupom) => (
      <StatusBadge status={cupom.status} label={statusLabels[cupom.status]} />
    ),
  },
];

const Cupons = () => {
  usePageTitle("Cupons");
  const isLoading = usePageLoading();
  const [searchQuery, setSearchQuery] = useState("");
  const [cupons, setCupons] = useState<Cupom[]>(mockCupons);
  const [selectedCupom, setSelectedCupom] = useState<Cupom | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredCupons = cupons.filter((cupom) =>
    cupom.codigo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRowClick = (cupom: Cupom) => {
    setSelectedCupom(cupom);
    setIsModalOpen(true);
  };

  const handleCupomSave = (cupom: Cupom) => {
    setCupons((prev) => {
      const exists = prev.some((c) => c.id === cupom.id);
      return exists ? prev.map((c) => (c.id === cupom.id ? cupom : c)) : [cupom, ...prev];
    });
    setSelectedCupom((prev) => (prev && prev.id === cupom.id ? cupom : prev));
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">Cupons</h1>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-3">
          <SearchBar
            placeholder="Buscar por código..."
            onSearch={setSearchQuery}
            className="flex-1"
          />
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Adicionar cupom
          </Button>
        </div>

        {/* Table */}
        <DataTable
          columns={columns}
          data={filteredCupons}
          emptyMessage="Nenhum cupom encontrado"
          loading={isLoading}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Modal de Detalhes */}
      <CupomDetailsModal
        cupom={selectedCupom}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCupomUpdate={handleCupomSave}
      />

      {/* Modal de Cadastro */}
      <CupomEditModal
        cupom={null}
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSave={handleCupomSave}
      />
    </MainLayout>
  );
};

export default Cupons;

