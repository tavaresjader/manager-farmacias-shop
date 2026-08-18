import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageLoading } from "@/hooks/usePageLoading";
import { PageLoading } from "@/components/layout/PageLoading";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { EntregaCard } from "@/components/entregas/EntregaCard";
import { NovaEntregaModal } from "@/components/entregas/NovaEntregaModal";
import { EntregaTrackingModal } from "@/components/entregas/EntregaTrackingModal";
import type { Entrega, EntregaSituacao } from "@/types/entrega";

const mockEntregas: Entrega[] = [
  {
    id: "1",
    codigo: "AV-1042",
    origem: "avulsa",
    unidade: "Unidade Centro",
    cliente: "Maria Oliveira",
    telefone: "(11) 98888-1234",
    endereco: "Rua das Flores, 123 - Centro, São Paulo - SP",
    valor: 89.9,
    status: "em_rota",
    situacao: "ok",
    entregador: { nome: "Carlos Souza", telefone: "(11) 97777-4321", veiculo: "Moto - Honda CG" },
    solicitadaEm: "18/08/2026 09:12",
    previsaoMinutos: 12,
    progresso: 70,
  },
  {
    id: "2",
    codigo: "PD-8871",
    origem: "farmacia-shop",
    unidade: "Unidade Jardins",
    cliente: "João Pereira",
    telefone: "(11) 96666-9090",
    endereco: "Av. Paulista, 900 - Bela Vista, São Paulo - SP",
    valor: 154.3,
    status: "coletando",
    situacao: "atraso",
    entregador: { nome: "Rafael Lima", telefone: "(11) 95555-1010", veiculo: "Moto - Yamaha Factor" },
    solicitadaEm: "18/08/2026 08:40",
    previsaoMinutos: 35,
    progresso: 35,
    motivoProblema: "Entregador atrasado na coleta em 15 minutos.",
  },
  {
    id: "3",
    codigo: "AV-1039",
    origem: "avulsa",
    unidade: "Unidade Zona Sul",
    cliente: "Ana Costa",
    telefone: "(11) 94444-3322",
    endereco: "Rua Domingos de Morais, 45 - Vila Mariana, São Paulo - SP",
    valor: 42.0,
    status: "problema",
    situacao: "problema",
    entregador: { nome: "Bruno Alves", telefone: "(11) 93333-2211", veiculo: "Moto - Honda Biz" },
    solicitadaEm: "18/08/2026 07:55",
    previsaoMinutos: 0,
    progresso: 55,
    motivoProblema: "Cliente ausente no endereço informado. Aguardando novo contato.",
  },
  {
    id: "4",
    codigo: "PD-8865",
    origem: "ifood",
    unidade: "Unidade Centro",
    cliente: "Fernanda Lima",
    telefone: "(11) 92222-7788",
    endereco: "Rua Augusta, 1200 - Consolação, São Paulo - SP",
    valor: 67.5,
    status: "entregue",
    situacao: "ok",
    entregador: { nome: "Carlos Souza", telefone: "(11) 97777-4321", veiculo: "Moto - Honda CG" },
    solicitadaEm: "18/08/2026 07:20",
    previsaoMinutos: 0,
    progresso: 100,
  },
  {
    id: "5",
    codigo: "AV-1035",
    origem: "avulsa",
    unidade: "Unidade Jardins",
    cliente: "Ricardo Menezes",
    telefone: "(11) 91111-5544",
    endereco: "Alameda Santos, 500 - Jardins, São Paulo - SP",
    valor: 120.0,
    status: "aguardando",
    situacao: "atraso",
    entregador: null,
    solicitadaEm: "18/08/2026 09:30",
    previsaoMinutos: 50,
    progresso: 10,
    motivoProblema: "Sem entregador disponível há mais de 10 minutos.",
  },
];

const filtros: { key: EntregaSituacao | "todas"; label: string; dot?: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "ok", label: "Em andamento", dot: "bg-success" },
  { key: "atraso", label: "Em atraso", dot: "bg-warning" },
  { key: "problema", label: "Problemas", dot: "bg-destructive" },
];

const Entregas = () => {
  usePageTitle("Entregas");
  const isLoading = usePageLoading();

  const [entregas, setEntregas] = useState<Entrega[]>(mockEntregas);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtro, setFiltro] = useState<EntregaSituacao | "todas">("todas");
  const [novaOpen, setNovaOpen] = useState(false);
  const [selecionada, setSelecionada] = useState<Entrega | null>(null);
  const [trackingOpen, setTrackingOpen] = useState(false);

  const filtradas = entregas.filter((e) => {
    const matchFiltro = filtro === "todas" || e.situacao === filtro;
    const q = searchQuery.toLowerCase();
    const matchBusca =
      e.codigo.toLowerCase().includes(q) ||
      e.cliente.toLowerCase().includes(q) ||
      e.endereco.toLowerCase().includes(q);
    return matchFiltro && matchBusca;
  });

  const contagem = (key: EntregaSituacao | "todas") =>
    key === "todas" ? entregas.length : entregas.filter((e) => e.situacao === key).length;

  const handleCardClick = (entrega: Entrega) => {
    setSelecionada(entrega);
    setTrackingOpen(true);
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
          <h1 className="text-2xl font-semibold text-foreground">Entregas</h1>
          <Button onClick={() => setNovaOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Nova entrega avulsa
          </Button>
        </div>

        {/* Search */}
        <SearchBar
          placeholder="Buscar por código, cliente ou endereço..."
          onSearch={setSearchQuery}
        />

        {/* Semáforo */}
        <div className="flex flex-wrap items-center gap-2">
          {filtros.map((f) => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              className={cn(
                "btn-filter",
                filtro === f.key && "border-primary text-foreground"
              )}
            >
              {f.dot && <span className={cn("w-2.5 h-2.5 rounded-full", f.dot)} />}
              <span>
                {f.label} ({contagem(f.key)})
              </span>
            </button>
          ))}
        </div>

        {/* Cards */}
        {filtradas.length === 0 ? (
          <div className="card-elevated p-10 text-center text-muted-foreground">
            Nenhuma entrega encontrada.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtradas.map((entrega) => (
              <EntregaCard key={entrega.id} entrega={entrega} onClick={handleCardClick} />
            ))}
          </div>
        )}
      </div>

      <NovaEntregaModal
        open={novaOpen}
        onOpenChange={setNovaOpen}
        onCreate={(entrega) => setEntregas((prev) => [entrega, ...prev])}
      />

      <EntregaTrackingModal
        entrega={selecionada}
        open={trackingOpen}
        onOpenChange={setTrackingOpen}
      />
    </MainLayout>
  );
};

export default Entregas;
