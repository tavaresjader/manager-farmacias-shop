import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { MetricCard } from "@/components/ui/metric-card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePageTitle } from "@/hooks/usePageTitle";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Megaphone,
  CalendarIcon,
  Filter,
} from "lucide-react";

const Relatorios = () => {
  usePageTitle("Relatórios");
  
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date());

  return (
    <MainLayout>
      <PageHeader
        title="Relatórios"
        breadcrumbs={[
          { label: "relatórios" },
        ]}
      />

      <div className="space-y-6">
        {/* Period Filter */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Período:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[160px] justify-start text-left font-normal",
                  !dateFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Data inicial"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          <span className="text-sm text-muted-foreground">até</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[160px] justify-start text-left font-normal",
                  !dateTo && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Data final"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
          <Button className="gap-2">
            <Filter className="h-4 w-4" />
            Filtrar
          </Button>
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Faturamento"
            value="R$ 175.000"
            change={{ value: 15, type: "positive" }}
            icon={DollarSign}
          />
          <MetricCard
            title="Novos Clientes"
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
            title="Cancelamentos"
            value="24"
            change={{ value: 8, type: "positive" }}
            icon={Megaphone}
          />
          <MetricCard
            title="Clientes"
            value="18"
            change={{ value: 3, type: "positive" }}
            icon={Users}
          />
          <MetricCard
            title="Ticket Médio"
            value="R$ 89,50"
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
