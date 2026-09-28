export type CouponDiscountType = "percentual" | "fixo" | "frete_gratis";
export type CouponStatus = "active" | "inactive" | "cancelled";

export interface CouponUsage {
  orderId: string;
  orderCode: string;
  amount: number;
  createdAt: string | null;
}

export interface Coupon {
  id: string;
  name: string;
  codigo: string;
  desconto: string;
  tipo: CouponDiscountType;
  minimo: number;
  usos: number;
  limite: number;
  validade: string;
  expiresAt: string | null;
  amount: number;
  active: boolean;
  status: CouponStatus;
  utilizacoes: CouponUsage[];
}

export interface CouponFormData {
  name: string;
  codigo: string;
  desconto: string;
  tipo: CouponDiscountType;
  minimo: string;
  limite: string;
  validade: string;
  status: CouponStatus;
}
