import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/ui/metric-card";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Megaphone,
} from "lucide-react";

const Relatorios = () => {
  usePageTitle("Relatórios");
  return (
    <MainLayout>
      <PageHeader
        title="Relatórios"
        breadcrumbs={[
          { label: "relatórios" },
        ]}
      />

      <div className="space-y-6">
        {/* Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Investimento Total"
            value="R$ 175.000"
            change={{ value: 15, type: "positive" }}
            icon={DollarSign}
          />
          <MetricCard
            title="Contatos Gerados"
            value="2.847"
            change={{ value: 23, type: "positive" }}
            icon={Target}
          />
          <MetricCard
            title="Taxa de Conversão"
            value="4.2%"
            change={{ value: 0.5, type: "positive" }}
            icon={TrendingUp}
          />
          <MetricCard
            title="Campanhas Realizadas"
            value="24"
            change={{ value: 8, type: "positive" }}
            icon={Megaphone}
          />
          <MetricCard
            title="Clientes Atendidos"
            value="18"
            change={{ value: 3, type: "positive" }}
            icon={Users}
          />
          <MetricCard
            title="ROI Médio"
            value="3.8x"
            change={{ value: 12, type: "positive" }}
            icon={BarChart3}
          />
        </div>

        {/* Placeholder for Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-elevated p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">
              Performance Mensal
            </h3>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">
                Gráfico de performance em breve
              </p>
            </div>
          </div>
          <div className="card-elevated p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">
              Distribuição por Segmento
            </h3>
            <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">
                Gráfico de segmentos em breve
              </p>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 10 Produtos Mais Comprados */}
          <div className="card-elevated p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">
              Top 10 Produtos Mais Comprados
            </h3>
            <div className="space-y-2">
              {[
                { name: "Dipirona 500mg", qty: 1250 },
                { name: "Paracetamol 750mg", qty: 1180 },
                { name: "Ibuprofeno 400mg", qty: 985 },
                { name: "Vitamina C 1g", qty: 870 },
                { name: "Omeprazol 20mg", qty: 756 },
                { name: "Loratadina 10mg", qty: 680 },
                { name: "Dorflex", qty: 645 },
                { name: "Buscopan Composto", qty: 590 },
                { name: "Neosaldina", qty: 520 },
                { name: "Rivotril 2mg", qty: 485 },
              ].map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                    <span className="font-medium text-foreground text-sm">
                      {product.name}
                    </span>
                  </div>
                  <span className="text-success font-semibold text-sm">{product.qty} un</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top 10 Produtos Mais Pesquisados Sem Disponibilidade */}
          <div className="card-elevated p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">
              Top 10 Produtos Pesquisados Sem Estoque
            </h3>
            <div className="space-y-2">
              {[
                { name: "Ozempic 1mg", searches: 890 },
                { name: "Wegovy 2.4mg", searches: 756 },
                { name: "Mounjaro 5mg", searches: 680 },
                { name: "Saxenda 6mg/ml", searches: 540 },
                { name: "Rybelsus 14mg", searches: 485 },
                { name: "Victoza 6mg/ml", searches: 420 },
                { name: "Trulicity 1.5mg", searches: 380 },
                { name: "Jardiance 25mg", searches: 320 },
                { name: "Forxiga 10mg", searches: 290 },
                { name: "Glifage XR 500mg", searches: 265 },
              ].map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center text-xs font-medium text-destructive">
                      {index + 1}
                    </span>
                    <span className="font-medium text-foreground text-sm">
                      {product.name}
                    </span>
                  </div>
                  <span className="text-muted-foreground font-semibold text-sm">{product.searches} buscas</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Relatorios;
