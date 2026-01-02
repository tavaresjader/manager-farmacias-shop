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

        {/* Top Campaigns */}
        <div className="card-elevated p-6">
          <h3 className="font-heading text-lg font-semibold mb-4">
            Top 5 Campanhas por ROI
          </h3>
          <div className="space-y-3">
            {[
              { name: "Black Friday 2024", roi: "4.5x", client: "Loja Virtual ABC" },
              { name: "Lançamento Produto X", roi: "4.2x", client: "Tech Solutions" },
              { name: "Awareness Brand", roi: "3.8x", client: "StartUp Inc" },
              { name: "Remarketing Q4", roi: "3.2x", client: "E-commerce Plus" },
              { name: "Campanha Verão", roi: "2.9x", client: "Moda Express" },
            ].map((campaign, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <span className="font-medium text-foreground">
                      {campaign.name}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {campaign.client}
                    </p>
                  </div>
                </div>
                <span className="text-success font-semibold">{campaign.roi}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Relatorios;
