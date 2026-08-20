import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { usePageTitle } from "@/hooks/usePageTitle";
import { MetricCard } from "@/components/ui/metric-card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from "recharts";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Megaphone,
} from "lucide-react";

const dailySalesData = [
  { day: "Seg", vendas: 4200 },
  { day: "Ter", vendas: 3800 },
  { day: "Qua", vendas: 5100 },
  { day: "Qui", vendas: 4600 },
  { day: "Sex", vendas: 6200 },
  { day: "Sáb", vendas: 7800 },
  { day: "Dom", vendas: 3200 },
];

const hourlySalesData = [
  { hora: "08h", vendas: 450 },
  { hora: "09h", vendas: 780 },
  { hora: "10h", vendas: 1200 },
  { hora: "11h", vendas: 1450 },
  { hora: "12h", vendas: 980 },
  { hora: "13h", vendas: 650 },
  { hora: "14h", vendas: 890 },
  { hora: "15h", vendas: 1100 },
  { hora: "16h", vendas: 1350 },
  { hora: "17h", vendas: 1680 },
  { hora: "18h", vendas: 1950 },
  { hora: "19h", vendas: 1420 },
  { hora: "20h", vendas: 980 },
  { hora: "21h", vendas: 520 },
];

const chartConfig = {
  vendas: {
    label: "Vendas",
    color: "hsl(var(--primary))",
  },
};

const topComprados = [
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
];

const topVisitadosSemEstoque = [
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
];

const parseDate = (value: string | null) => {
  if (!value) return undefined;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : undefined;
};

const formatDate = (date?: Date) =>
  date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "—";

const RelatorioImpressao = () => {
  usePageTitle("Relatórios - Impressão");
  const [searchParams] = useSearchParams();

  const unidadeLabel = searchParams.get("unidade") || "Todas as unidades";
  const dateFrom = parseDate(searchParams.get("de"));
  const dateTo = parseDate(searchParams.get("ate"));

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <h1 className="font-heading text-2xl font-semibold text-foreground mb-4">
        Relatórios
      </h1>

      <div className="text-sm text-muted-foreground border-b pb-4 mb-6">
        <span className="font-medium">Unidade:</span> {unidadeLabel}
        <span className="mx-2">|</span>
        <span className="font-medium">Período:</span> {formatDate(dateFrom)} até{" "}
        {formatDate(dateTo)}
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            title="Faturamento"
            value="R$ 175.000"
            change={{ value: 15, type: "positive" }}
            icon={DollarSign}
          />
          <MetricCard
            title="Pedidos"
            value="1.432"
            change={{ value: 18, type: "positive" }}
            icon={BarChart3}
          />
          <MetricCard
            title="Cancelamentos"
            value="24"
            change={{ value: 8, type: "negative" }}
            icon={Megaphone}
          />
          <MetricCard
            title="Ticket Médio"
            value="R$ 89,50"
            change={{ value: 12, type: "positive" }}
            icon={Target}
          />
          <MetricCard
            title="Taxa de Conversão"
            value="4.2%"
            change={{ value: 0.5, type: "positive" }}
            icon={TrendingUp}
          />
          <MetricCard
            title="Clientes"
            value="2.847"
            change={{ value: 23, type: "positive" }}
            icon={Users}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-elevated p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">Vendas (Diária)</h3>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart data={dailySalesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} className="fill-muted-foreground" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                  className="fill-muted-foreground"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="vendas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
          <div className="card-elevated p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">Vendas (Horário)</h3>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <LineChart data={hourlySalesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="hora" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} className="fill-muted-foreground" />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R$${value}`}
                  className="fill-muted-foreground"
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="vendas"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-elevated p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">
              Top 10 Produtos Mais Comprados
            </h3>
            <div className="space-y-2">
              {topComprados.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {index + 1}
                    </span>
                    <span className="font-medium text-foreground text-sm">{product.name}</span>
                  </div>
                  <span className="text-success font-semibold text-sm">{product.qty} un</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-elevated p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">
              Top 10 Produtos Visitados Sem Estoque
            </h3>
            <div className="space-y-2">
              {topVisitadosSemEstoque.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center text-xs font-medium text-destructive">
                      {index + 1}
                    </span>
                    <span className="font-medium text-foreground text-sm">{product.name}</span>
                  </div>
                  <span className="text-muted-foreground font-semibold text-sm">
                    {product.searches} buscas
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatorioImpressao;
