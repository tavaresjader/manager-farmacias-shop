import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageLoading } from "@/components/layout/PageLoading";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageLoading } from "@/hooks/usePageLoading";
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
  Printer,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from "recharts";
import { managerBackendBff } from "@/services/ManagerBackendBff";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ReportMetricApi {
  value?: number;
  percentual?: number;
  percentualType?: string | null;
  Value?: number;
  Percentual?: number;
  PercentualType?: string | null;
}

interface ReportSummaryApi {
  revenue?: ReportMetricApi | number;
  orders?: ReportMetricApi | number;
  cancellations?: ReportMetricApi | number;
  averageTicket?: ReportMetricApi | number;
  conversionRate?: ReportMetricApi | number;
  customers?: ReportMetricApi | number;
  Revenue?: ReportMetricApi | number;
  Orders?: ReportMetricApi | number;
  Cancellations?: ReportMetricApi | number;
  AverageTicket?: ReportMetricApi | number;
  ConversionRate?: ReportMetricApi | number;
  Customers?: ReportMetricApi | number;
}

interface ReportChartPointApi {
  label?: string | null;
  day?: string | null;
  date?: string | null;
  hour?: string | null;
  value?: number;
  sales?: number;
  amount?: number;
  revenue?: number;
  vendas?: number;
  Label?: string | null;
  Day?: string | null;
  Date?: string | null;
  Hour?: string | null;
  Value?: number;
  Sales?: number;
  Amount?: number;
  Revenue?: number;
  Vendas?: number;
}

interface ReportProductApi {
  name?: string | null;
  productName?: string | null;
  quantity?: number;
  qty?: number;
  searches?: number;
  count?: number;
  value?: number;
  Name?: string | null;
  ProductName?: string | null;
  Quantity?: number;
  Qty?: number;
  Searches?: number;
  Count?: number;
  Value?: number;
}

interface ReportsResponse {
  summary?: ReportSummaryApi;
  dailySales?: ReportChartPointApi[];
  salesByDay?: ReportChartPointApi[];
  hourlySales?: ReportChartPointApi[];
  salesByHour?: ReportChartPointApi[];
  topPurchasedProducts?: ReportProductApi[];
  topProducts?: ReportProductApi[];
  topUnavailableProducts?: ReportProductApi[];
  topVisitedOutOfStockProducts?: ReportProductApi[];
  Summary?: ReportSummaryApi;
  DailySales?: ReportChartPointApi[];
  SalesByDay?: ReportChartPointApi[];
  HourlySales?: ReportChartPointApi[];
  SalesByHour?: ReportChartPointApi[];
  TopPurchasedProducts?: ReportProductApi[];
  TopProducts?: ReportProductApi[];
  TopUnavailableProducts?: ReportProductApi[];
  TopVisitedOutOfStockProducts?: ReportProductApi[];
}

interface ReportsEnvelope {
  data?: ReportsResponse;
  report?: ReportsResponse;
  result?: ReportsResponse;
  items?: ReportsResponse[];
  results?: ReportsResponse[];
  Data?: ReportsResponse;
  Report?: ReportsResponse;
  Result?: ReportsResponse;
  Items?: ReportsResponse[];
  Results?: ReportsResponse[];
}

interface ChartPoint {
  label: string;
  vendas: number;
}

interface ProductRanking {
  name: string;
  value: number;
}

const chartConfig = {
  vendas: {
    label: "Vendas",
    color: "hsl(var(--primary))",
  },
};

const emptyMetric = {
  value: 0,
  percentual: 0,
  percentualType: "neutral",
};

const resolveReport = (payload: ReportsResponse | ReportsResponse[] | ReportsEnvelope | null): ReportsResponse | null => {
  if (!payload) return null;
  if (Array.isArray(payload)) return payload[0] ?? null;

  const envelope = payload as ReportsEnvelope;
  return (
    envelope.data ??
    envelope.Data ??
    envelope.report ??
    envelope.Report ??
    envelope.result ??
    envelope.Result ??
    envelope.items?.[0] ??
    envelope.Items?.[0] ??
    envelope.results?.[0] ??
    envelope.Results?.[0] ??
    (payload as ReportsResponse)
  );
};

const toDateTimeParam = (date: Date, endOfDay = false) => {
  const value = new Date(date);
  if (endOfDay) {
    value.setHours(23, 59, 59, 999);
  } else {
    value.setHours(0, 0, 0, 0);
  }
  return value.toISOString();
};

const formatCurrency = (value: number) =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const formatNumber = (value: number) => value.toLocaleString("pt-BR");

const formatPercent = (value: number) =>
  `${value.toLocaleString("pt-BR", { maximumFractionDigits: 2 })}%`;

const normalizeText = (value?: string | null) =>
  value
    ?.replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") ?? "";

const resolveChangeType = (type?: string | null, percentual = 0): "positive" | "negative" | "neutral" => {
  const normalizedType = normalizeText(type);
  if (["positive", "positivo", "increase", "up"].includes(normalizedType)) return "positive";
  if (["negative", "negativo", "decrease", "down"].includes(normalizedType)) return "negative";
  if (percentual > 0) return "positive";
  if (percentual < 0) return "negative";
  return "neutral";
};

const resolveMetric = (metric?: ReportMetricApi | number) => {
  if (typeof metric === "number") {
    return { ...emptyMetric, value: metric };
  }

  return {
    value: metric?.value ?? metric?.Value ?? emptyMetric.value,
    percentual: metric?.percentual ?? metric?.Percentual ?? emptyMetric.percentual,
    percentualType: metric?.percentualType ?? metric?.PercentualType ?? emptyMetric.percentualType,
  };
};

const formatChartLabel = (point: ReportChartPointApi, fallback: string) => {
  const label = point.label ?? point.Label ?? point.day ?? point.Day ?? point.hour ?? point.Hour;
  if (label) return label;

  const dateValue = point.date ?? point.Date;
  if (dateValue) {
    const date = new Date(dateValue);
    if (!Number.isNaN(date.getTime())) {
      return format(date, "dd/MM", { locale: ptBR });
    }
  }

  return fallback;
};

const toChartPoint = (point: ReportChartPointApi, index: number): ChartPoint => ({
  label: formatChartLabel(point, String(index + 1)),
  vendas: point.vendas ?? point.Vendas ?? point.value ?? point.Value ?? point.sales ?? point.Sales ?? point.amount ?? point.Amount ?? point.revenue ?? point.Revenue ?? 0,
});

const toProductRanking = (product: ReportProductApi): ProductRanking => ({
  name: (product.name ?? product.Name ?? product.productName ?? product.ProductName)?.trim() || "Produto não informado",
  value: product.quantity ?? product.Quantity ?? product.qty ?? product.Qty ?? product.searches ?? product.Searches ?? product.count ?? product.Count ?? product.value ?? product.Value ?? 0,
});

const getDailySales = (report: ReportsResponse | null) =>
  (report?.dailySales ?? report?.DailySales ?? report?.salesByDay ?? report?.SalesByDay ?? []).map(toChartPoint);

const getHourlySales = (report: ReportsResponse | null) =>
  (report?.hourlySales ?? report?.HourlySales ?? report?.salesByHour ?? report?.SalesByHour ?? []).map(toChartPoint);

const getTopPurchasedProducts = (report: ReportsResponse | null) =>
  (report?.topPurchasedProducts ?? report?.TopPurchasedProducts ?? report?.topProducts ?? report?.TopProducts ?? [])
    .map(toProductRanking)
    .slice(0, 10);

const getTopUnavailableProducts = (report: ReportsResponse | null) =>
  (report?.topUnavailableProducts ??
    report?.TopUnavailableProducts ??
    report?.topVisitedOutOfStockProducts ??
    report?.TopVisitedOutOfStockProducts ??
    [])
    .map(toProductRanking)
    .slice(0, 10);

const RankingEmptyState = ({ label }: { label: string }) => (
  <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
    {label}
  </div>
);

const Relatorios = () => {
  usePageTitle("Relatórios");
  const isLoading = usePageLoading();
  const { session } = useAuth();

  const [unidade, setUnidade] = useState<string>("todas");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(new Date());
  const [report, setReport] = useState<ReportsResponse | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const unidadeOptions = useMemo(
    () => [
      { value: "todas", label: "Todas as unidades" },
      ...(session?.merchants?.map((merchant) => ({
        value: merchant.id,
        label: merchant.name ?? "Unidade sem nome",
      })) ?? []),
    ],
    [session?.merchants],
  );

  useEffect(() => {
    let cancelled = false;

    const fetchReport = async () => {
      setLoadingReport(true);
      setReportError(null);

      const params: Record<string, string | number | boolean> = {};
      if (unidade !== "todas") params.merchantId = unidade;
      if (dateFrom) params.startAt = toDateTimeParam(dateFrom);
      if (dateTo) params.endAt = toDateTimeParam(dateTo, true);

      const response = await managerBackendBff.get<ReportsResponse | ReportsResponse[] | ReportsEnvelope>("/v1/reports", { params });

      if (cancelled) return;

      if (response.data) {
        setReport(resolveReport(response.data));
      } else {
        setReport(null);
        const message = response.error ?? "Tente novamente.";
        setReportError(message);
        toast.error(`Erro ao carregar relatórios: ${message}`);
      }

      setLoadingReport(false);
    };

    fetchReport();

    return () => {
      cancelled = true;
    };
  }, [dateFrom, dateTo, unidade, reloadKey]);

  const unidadeLabel = unidadeOptions.find((o) => o.value === unidade)?.label || unidade;
  const summary = report?.summary ?? report?.Summary;
  const metrics = {
    revenue: resolveMetric(summary?.revenue ?? summary?.Revenue),
    orders: resolveMetric(summary?.orders ?? summary?.Orders),
    cancellations: resolveMetric(summary?.cancellations ?? summary?.Cancellations),
    averageTicket: resolveMetric(summary?.averageTicket ?? summary?.AverageTicket),
    conversionRate: resolveMetric(summary?.conversionRate ?? summary?.ConversionRate),
    customers: resolveMetric(summary?.customers ?? summary?.Customers),
  };
  const dailySalesData = getDailySales(report);
  const hourlySalesData = getHourlySales(report);
  const topPurchasedProducts = getTopPurchasedProducts(report);
  const topUnavailableProducts = getTopUnavailableProducts(report);

  const handlePrint = () => {
    const params = new URLSearchParams({ unidade: unidadeLabel });
    if (dateFrom) params.set("de", format(dateFrom, "yyyy-MM-dd"));
    if (dateTo) params.set("ate", format(dateTo, "yyyy-MM-dd"));
    window.open(
      `${window.location.origin}/relatorios/impressao?${params.toString()}`,
      "_blank",
      "width=1200,height=800,scrollbars=yes"
    );
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
        title="Relatórios"
        breadcrumbs={[]}
      />

      <div className="space-y-6">
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
          <Button className="gap-2" onClick={() => setReloadKey((current) => current + 1)} disabled={loadingReport}>
            <Filter className="h-4 w-4" />
            {loadingReport ? "Filtrando..." : "Filtrar"}
          </Button>
          <Button variant="outline" className="gap-2" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
        </div>

        {reportError && (
          <Alert variant="destructive">
            <AlertDescription>
              Não foi possível carregar os relatórios. {reportError}
            </AlertDescription>
          </Alert>
        )}

        <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", loadingReport && "opacity-60")}>
          <MetricCard
            title="Faturamento"
            value={formatCurrency(metrics.revenue.value)}
            change={{
              value: metrics.revenue.percentual,
              type: resolveChangeType(metrics.revenue.percentualType, metrics.revenue.percentual),
            }}
            icon={DollarSign}
          />
          <MetricCard
            title="Pedidos"
            value={formatNumber(metrics.orders.value)}
            change={{
              value: metrics.orders.percentual,
              type: resolveChangeType(metrics.orders.percentualType, metrics.orders.percentual),
            }}
            icon={BarChart3}
          />
          <MetricCard
            title="Cancelamentos"
            value={formatNumber(metrics.cancellations.value)}
            change={{
              value: metrics.cancellations.percentual,
              type: resolveChangeType(metrics.cancellations.percentualType, metrics.cancellations.percentual),
            }}
            icon={Megaphone}
          />
          <MetricCard
            title="Ticket Médio"
            value={formatCurrency(metrics.averageTicket.value)}
            change={{
              value: metrics.averageTicket.percentual,
              type: resolveChangeType(metrics.averageTicket.percentualType, metrics.averageTicket.percentual),
            }}
            icon={Target}
          />
          <MetricCard
            title="Taxa de Conversão"
            value={formatPercent(metrics.conversionRate.value)}
            change={{
              value: metrics.conversionRate.percentual,
              type: resolveChangeType(metrics.conversionRate.percentualType, metrics.conversionRate.percentual),
            }}
            icon={TrendingUp}
          />
          <MetricCard
            title="Clientes"
            value={formatNumber(metrics.customers.value)}
            change={{
              value: metrics.customers.percentual,
              type: resolveChangeType(metrics.customers.percentualType, metrics.customers.percentual),
            }}
            icon={Users}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-elevated p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">
              Vendas (Diária)
            </h3>
            {dailySalesData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <BarChart data={dailySalesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="label"
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
                    formatter={(value: number) => [formatCurrency(value), "Vendas"]}
                  />
                  <Bar
                    dataKey="vendas"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <RankingEmptyState label={loadingReport ? "Carregando vendas diarias..." : "Nenhuma venda diaria encontrada."} />
            )}
          </div>
          <div className="card-elevated p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">
              Vendas (Horário)
            </h3>
            {hourlySalesData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-64 w-full">
                <LineChart data={hourlySalesData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="label"
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
                    formatter={(value: number) => [formatCurrency(value), "Vendas"]}
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
            ) : (
              <RankingEmptyState label={loadingReport ? "Carregando vendas por horario..." : "Nenhuma venda por horario encontrada."} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-elevated p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">
              Top 10 Produtos Mais Comprados
            </h3>
            {topPurchasedProducts.length > 0 ? (
              <div className="space-y-2">
                {topPurchasedProducts.map((product, index) => (
                  <div
                    key={`${product.name}-${index}`}
                    className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary shrink-0">
                        {index + 1}
                      </span>
                      <span className="font-medium text-foreground text-sm truncate">
                        {product.name}
                      </span>
                    </div>
                    <span className="text-success font-semibold text-sm shrink-0">{product.value} un</span>
                  </div>
                ))}
              </div>
            ) : (
              <RankingEmptyState label={loadingReport ? "Carregando produtos..." : "Nenhum produto comprado encontrado."} />
            )}
          </div>

          <div className="card-elevated p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">
              Top 10 Produtos Visitados Sem Estoque
            </h3>
            {topUnavailableProducts.length > 0 ? (
              <div className="space-y-2">
                {topUnavailableProducts.map((product, index) => (
                  <div
                    key={`${product.name}-${index}`}
                    className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center text-xs font-medium text-destructive shrink-0">
                        {index + 1}
                      </span>
                      <span className="font-medium text-foreground text-sm truncate">
                        {product.name}
                      </span>
                    </div>
                    <span className="text-muted-foreground font-semibold text-sm shrink-0">{product.value} buscas</span>
                  </div>
                ))}
              </div>
            ) : (
              <RankingEmptyState label={loadingReport ? "Carregando buscas..." : "Nenhum produto sem estoque encontrado."} />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Relatorios;
