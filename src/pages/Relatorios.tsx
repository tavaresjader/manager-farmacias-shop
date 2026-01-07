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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

// Mock data for daily sales chart
const dailySalesData = [
  { day: "Seg", vendas: 4200 },
  { day: "Ter", vendas: 3800 },
  { day: "Qua", vendas: 5100 },
  { day: "Qui", vendas: 4600 },
  { day: "Sex", vendas: 6200 },
  { day: "Sáb", vendas: 7800 },
  { day: "Dom", vendas: 3200 },
];

// Mock data for hourly sales chart
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

const dailyChartConfig = {
  vendas: {
    label: "Vendas",
    color: "hsl(var(--primary))",
  },
};

const hourlyChartConfig = {
  vendas: {
    label: "Vendas",
    color: "hsl(var(--primary))",
  },
};

const unidadeOptions = [
  { value: "todas", label: "Todas as unidades" },
  { value: "matriz", label: "Matriz" },
  { value: "filial-1", label: "Filial 1" },
  { value: "filial-2", label: "Filial 2" },
  { value: "filial-3", label: "Filial 3" },
];

const Relatorios = () => {
  usePageTitle("Relatórios");
  
  const [unidade, setUnidade] = useState<string>("todas");
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
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">Unidade:</span>
          <Select value={unidade} onValueChange={setUnidade}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecione a unidade" />
            </SelectTrigger>
            <SelectContent>
              {unidadeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="text-sm font-medium text-muted-foreground ml-2">Período:</span>
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-elevated p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">
              Vendas (Diária)
            </h3>
            <ChartContainer config={dailyChartConfig} className="h-64 w-full">
              <BarChart data={dailySalesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
                  className="fill-muted-foreground"
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Vendas']}
                />
                <Bar 
                  dataKey="vendas" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
          <div className="card-elevated p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">
              Vendas (Horário)
            </h3>
            <ChartContainer config={hourlyChartConfig} className="h-64 w-full">
              <LineChart data={hourlySalesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="hora" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R$${value}`}
                  className="fill-muted-foreground"
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Vendas']}
                />
                <Line 
                  type="monotone"
                  dataKey="vendas" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ChartContainer>
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
