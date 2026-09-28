import { useEffect, useRef, useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageLoading } from "@/components/layout/PageLoading";
import { PageHeader } from "@/components/layout/PageHeader";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageLoading } from "@/hooks/usePageLoading";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { CupomDetailsModal } from "@/components/cupons/CupomDetailsModal";
import { CupomEditModal } from "@/components/cupons/CupomEditModal";
import { Plus, Percent, DollarSign, Tag, Truck } from "lucide-react";
import { managerBackendBff } from "@/services/ManagerBackendBff";
import { toast } from "sonner";
import type { Coupon, CouponDiscountType, CouponFormData, CouponStatus, CouponUsage } from "@/types/coupon";

type CouponApiType = 1 | 2 | 3;

interface CouponListApiResponse {
  id: string;
  name?: string | null;
  code?: string | null;
  type: number;
  amount: number;
  purchaseMin: number;
  expiresAt?: string | null;
  limit: number;
  usages: number;
  active: boolean;
}

interface CouponUsageApiResponse {
  orderId: string;
  orderCode?: string | null;
  amount: number;
  createdAt?: string | null;
}

interface CouponDetailsApiResponse extends Omit<CouponListApiResponse, "usages"> {
  usages?: CouponUsageApiResponse[] | null;
}

interface CouponPayload {
  id?: string;
  name: string;
  code: string;
  type: CouponApiType;
  amount: number;
  purchaseMin: number;
  expiresAt: string | null;
  limit: number;
  active: boolean;
}

const statusLabels: Record<string, string> = {
  active: "Ativo",
  inactive: "Inativo",
  cancelled: "Expirado",
};

const couponTypes: Record<CouponDiscountType, CouponApiType> = {
  percentual: 1,
  fixo: 2,
  frete_gratis: 3,
};

const couponTypesByApi: Record<number, CouponDiscountType> = {
  1: "percentual",
  2: "fixo",
  3: "frete_gratis",
};

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR");
}

function toDateInputValue(value: string): string | null {
  if (!value) return null;

  const isoDateMatch = value.match(/^\d{4}-\d{2}-\d{2}/);
  if (isoDateMatch) return `${isoDateMatch[0]}T00:00:00`;

  const brazilianDateMatch = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (brazilianDateMatch) {
    const [, day, month, year] = brazilianDateMatch;
    return `${year}-${month}-${day}T00:00:00`;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function getCouponStatus(active: boolean, expiresAt?: string | null): CouponStatus {
  if (!active) return "inactive";
  if (expiresAt) {
    const expiresDate = new Date(expiresAt);
    if (!Number.isNaN(expiresDate.getTime()) && expiresDate < new Date()) return "cancelled";
  }
  return "active";
}

function getDiscountLabel(type: CouponDiscountType, amount: number): string {
  if (type === "frete_gratis") return "Frete Grátis";
  if (type === "percentual") return `${amount.toLocaleString("pt-BR")}%`;
  return formatCurrency(amount);
}

function toCouponUsage(usage: CouponUsageApiResponse): CouponUsage {
  return {
    orderId: usage.orderId,
    orderCode: usage.orderCode?.trim() || usage.orderId,
    amount: usage.amount,
    createdAt: usage.createdAt ?? null,
  };
}

function toCoupon(coupon: CouponListApiResponse | CouponDetailsApiResponse): Coupon {
  const type = couponTypesByApi[coupon.type] ?? "percentual";
  const usages = Array.isArray(coupon.usages)
    ? coupon.usages.map(toCouponUsage)
    : [];
  const usagesCount = Array.isArray(coupon.usages) ? coupon.usages.length : coupon.usages ?? 0;

  return {
    id: coupon.id,
    name: coupon.name?.trim() || "",
    codigo: coupon.code?.trim() || "",
    desconto: getDiscountLabel(type, coupon.amount),
    tipo: type,
    minimo: coupon.purchaseMin,
    usos: usagesCount,
    limite: coupon.limit,
    validade: formatDate(coupon.expiresAt),
    expiresAt: coupon.expiresAt ?? null,
    amount: coupon.amount,
    active: coupon.active,
    status: getCouponStatus(coupon.active, coupon.expiresAt),
    utilizacoes: usages,
  };
}

function toCouponPayload(formData: CouponFormData, id?: string): CouponPayload {
  const type = couponTypes[formData.tipo];
  const amount = formData.tipo === "frete_gratis" ? 0 : Number(formData.desconto.replace(",", ".")) || 0;

  return {
    ...(id ? { id } : {}),
    name: formData.name.trim(),
    code: formData.codigo.trim().toUpperCase(),
    type,
    amount,
    purchaseMin: Number(formData.minimo.replace(",", ".")) || 0,
    expiresAt: toDateInputValue(formData.validade),
    limit: Number.parseInt(formData.limite, 10) || 0,
    active: formData.status === "active",
  };
}

const columns: Column<Coupon>[] = [
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
        ) : cupom.tipo === "fixo" ? (
          <DollarSign className="w-4 h-4 text-muted-foreground" />
        ) : (
          <Truck className="w-4 h-4 text-muted-foreground" />
        )}
        <span>
          {cupom.tipo === "percentual"
            ? "Percentual"
            : cupom.tipo === "fixo"
            ? "Valor Fixo"
            : "Frete Grátis"}
        </span>
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
  const isPageLoading = usePageLoading();
  const [searchQuery, setSearchQuery] = useState("");
  const [cupons, setCupons] = useState<Coupon[]>([]);
  const [selectedCupom, setSelectedCupom] = useState<Coupon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loadingCupons, setLoadingCupons] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const detailsRequestId = useRef(0);

  useEffect(() => {
    let cancelled = false;

    const fetchCoupons = async () => {
      setLoadingCupons(true);
      const params: Record<string, string | number | boolean> = {};
      if (searchQuery.trim()) params.term = searchQuery.trim();

      const response = await managerBackendBff.get<CouponListApiResponse[]>("/v1/Coupons", { params });

      if (cancelled) return;

      if (response.data) {
        setCupons(response.data.map(toCoupon));
      } else {
        setCupons([]);
        toast.error(`Erro ao carregar cupons: ${response.error ?? "Tente novamente."}`);
      }

      setLoadingCupons(false);
    };

    fetchCoupons();

    return () => {
      cancelled = true;
    };
  }, [searchQuery]);

  const handleRowClick = async (cupom: Coupon) => {
    const requestId = ++detailsRequestId.current;
    setSelectedCupom(cupom);
    setIsModalOpen(true);
    setLoadingDetails(true);

    const response = await managerBackendBff.get<CouponDetailsApiResponse>(
      `/v1/Coupons/${encodeURIComponent(cupom.id)}`,
    );

    if (requestId !== detailsRequestId.current) return;

    if (response.data) {
      setSelectedCupom(toCoupon(response.data));
    } else {
      setIsModalOpen(false);
      toast.error(`Erro ao carregar cupom: ${response.error ?? "Tente novamente."}`);
    }

    setLoadingDetails(false);
  };

  const handleDetailsModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      detailsRequestId.current += 1;
      setLoadingDetails(false);
      setSelectedCupom(null);
    }
  };

  const reloadCoupons = async () => {
    const params: Record<string, string | number | boolean> = {};
    if (searchQuery.trim()) params.term = searchQuery.trim();
    const response = await managerBackendBff.get<CouponListApiResponse[]>("/v1/Coupons", { params });
    if (response.data) setCupons(response.data.map(toCoupon));
  };

  const handleCupomSave = async (formData: CouponFormData, cupom?: Coupon | null) => {
    const payload = toCouponPayload(formData, cupom?.id);
    const response = cupom
      ? await managerBackendBff.put<unknown>(`/v1/Coupons/${encodeURIComponent(cupom.id)}`, payload)
      : await managerBackendBff.post<unknown>("/v1/Coupons", payload);

    if (response.error) {
      toast.error(`Erro ao ${cupom ? "atualizar" : "cadastrar"} cupom: ${response.error}`);
      return false;
    }

    toast.success(`Cupom ${cupom ? "atualizado" : "cadastrado"} com sucesso.`);
    await reloadCoupons();

    if (cupom) {
      const detailsResponse = await managerBackendBff.get<CouponDetailsApiResponse>(
        `/v1/Coupons/${encodeURIComponent(cupom.id)}`,
      );
      if (detailsResponse.data) setSelectedCupom(toCoupon(detailsResponse.data));
    }

    return true;
  };

  const handleCupomDelete = async (cupom: Coupon) => {
    const response = await managerBackendBff.delete<unknown>(
      `/v1/Coupons/${encodeURIComponent(cupom.id)}`,
    );

    if (response.error) {
      toast.error(`Erro ao excluir cupom: ${response.error}`);
      return false;
    }

    toast.success("Cupom excluído com sucesso.");
    setCupons((currentCoupons) => currentCoupons.filter((currentCoupon) => currentCoupon.id !== cupom.id));
    handleDetailsModalOpenChange(false);
    return true;
  };

  if (isPageLoading) {
    return (
      <MainLayout>
        <PageLoading />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader title="Cupons" breadcrumbs={[]} />
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <SearchBar
            placeholder="Buscar por código..."
            value={searchQuery}
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
          data={cupons}
          emptyMessage="Nenhum cupom encontrado"
          loading={loadingCupons}
          onRowClick={handleRowClick}
        />
      </div>

      {/* Modal de Detalhes */}
      <CupomDetailsModal
        cupom={selectedCupom}
        open={isModalOpen}
        onOpenChange={handleDetailsModalOpenChange}
        onCupomUpdate={handleCupomSave}
        onCupomDelete={handleCupomDelete}
        loading={loadingDetails}
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

