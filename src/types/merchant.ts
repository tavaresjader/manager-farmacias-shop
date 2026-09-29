import type { Convenio } from "@/components/unidades/ConveniosSection";

export interface MerchantAvailabilityApi {
  dayOfWeek: number;
  opened: boolean;
  shiftStartAt?: string | null;
  shiftEndAt?: string | null;
}

export interface MerchantShippingAreaApi {
  radius: number;
  purchaseMin: number;
  amount: number;
  time: number;
}

export interface MerchantInsuranceApi {
  type: number;
  code?: string | null;
  password?: string | null;
  active: boolean;
}

export interface MerchantListApiResponse {
  id: string;
  name?: string | null;
  opened: boolean;
  active: boolean;
}

export interface MerchantDetailsApiResponse extends MerchantListApiResponse {
  document?: string | null;
  addressPostalCode?: string | null;
  address?: string | null;
  addressNumber?: string | null;
  availabilities?: MerchantAvailabilityApi[] | null;
  shippingAreas?: MerchantShippingAreaApi[] | null;
  insurances?: MerchantInsuranceApi[] | null;
}

export interface MerchantPayload {
  name: string;
  document: string | null;
  opened: boolean;
  active: boolean;
  addressPostalCode: string | null;
  address: string | null;
  addressNumber: string | null;
  availabilities: MerchantAvailabilityApi[];
  shippingAreas: MerchantShippingAreaApi[];
  insurances: MerchantInsuranceApi[];
}

export interface HorarioFuncionamento {
  dia: string;
  dayOfWeek: number;
  aberto: boolean;
  abertura: string;
  fechamento: string;
}

export interface AreaEntrega {
  id: string;
  raio: number;
  compraMinima: number;
  preco: number;
  tempo: number;
}

export interface Unidade {
  id: string;
  nome: string;
  documento: string;
  endereco: string;
  numero: string;
  cep: string;
  situacao: "aberta" | "fechada";
  status: "ativa" | "inativa";
  horarios: HorarioFuncionamento[];
  areasEntrega: AreaEntrega[];
  convenios: Convenio[];
}

const diasSemana = [
  { dia: "Segunda-feira", dayOfWeek: 1 },
  { dia: "Terça-feira", dayOfWeek: 2 },
  { dia: "Quarta-feira", dayOfWeek: 3 },
  { dia: "Quinta-feira", dayOfWeek: 4 },
  { dia: "Sexta-feira", dayOfWeek: 5 },
  { dia: "Sábado", dayOfWeek: 6 },
  { dia: "Domingo", dayOfWeek: 0 },
];

const insuranceNames: Record<number, string> = {
  1: "Convênio 1",
  2: "Convênio 2",
  3: "Convênio 3",
  4: "Convênio 4",
  5: "Convênio 5",
};

function normalizeTime(value?: string | null): string {
  if (!value) return "";
  return value.slice(0, 5);
}

export function getDefaultHorarios(): HorarioFuncionamento[] {
  return diasSemana.map(({ dia, dayOfWeek }) => ({
    dia,
    dayOfWeek,
    aberto: false,
    abertura: "08:00",
    fechamento: "18:00",
  }));
}

export function createEmptyUnidade(): Unidade {
  return {
    id: "",
    nome: "",
    documento: "",
    endereco: "",
    numero: "",
    cep: "",
    situacao: "fechada",
    status: "ativa",
    horarios: getDefaultHorarios(),
    areasEntrega: [],
    convenios: [],
  };
}

export function toUnidadeFromList(merchant: MerchantListApiResponse): Unidade {
  return {
    ...createEmptyUnidade(),
    id: merchant.id,
    nome: merchant.name?.trim() || "Unidade sem nome",
    situacao: merchant.opened ? "aberta" : "fechada",
    status: merchant.active ? "ativa" : "inativa",
  };
}

export function toUnidade(merchant: MerchantDetailsApiResponse): Unidade {
  const horariosByDay = new Map(
    (merchant.availabilities ?? []).map((availability) => [
      availability.dayOfWeek,
      availability,
    ]),
  );

  return {
    id: merchant.id,
    nome: merchant.name?.trim() || "Unidade sem nome",
    documento: merchant.document?.trim() || "",
    endereco: merchant.address?.trim() || "",
    numero: merchant.addressNumber?.trim() || "",
    cep: merchant.addressPostalCode?.trim() || "",
    situacao: merchant.opened ? "aberta" : "fechada",
    status: merchant.active ? "ativa" : "inativa",
    horarios: diasSemana.map(({ dia, dayOfWeek }) => {
      const availability = horariosByDay.get(dayOfWeek);
      return {
        dia,
        dayOfWeek,
        aberto: availability?.opened ?? false,
        abertura: normalizeTime(availability?.shiftStartAt) || "08:00",
        fechamento: normalizeTime(availability?.shiftEndAt) || "18:00",
      };
    }),
    areasEntrega: (merchant.shippingAreas ?? []).map((area, index) => ({
      id: `${index}-${area.radius}-${area.purchaseMin}-${area.amount}-${area.time}`,
      raio: area.radius,
      compraMinima: area.purchaseMin,
      preco: area.amount,
      tempo: area.time,
    })),
    convenios: (merchant.insurances ?? []).map((insurance) => ({
      id: String(insurance.type),
      nome: insuranceNames[insurance.type] ?? `Convênio ${insurance.type}`,
      codigo: insurance.code ?? "",
      senha: insurance.password ?? "",
      ativo: insurance.active,
    })),
  };
}

function cleanNullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function cleanDocument(value: string): string | null {
  const normalized = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return normalized ? normalized : null;
}

function cleanPostalCode(value: string): string | null {
  const normalized = value.replace(/\D/g, "");
  return normalized ? normalized : null;
}

export function toMerchantPayload(unidade: Unidade): MerchantPayload {
  return {
    name: unidade.nome.trim(),
    document: cleanDocument(unidade.documento),
    opened: unidade.situacao === "aberta",
    active: unidade.status === "ativa",
    addressPostalCode: cleanPostalCode(unidade.cep),
    address: cleanNullable(unidade.endereco),
    addressNumber: cleanNullable(unidade.numero),
    availabilities: unidade.horarios.map((horario) => ({
      dayOfWeek: horario.dayOfWeek,
      opened: horario.aberto,
      shiftStartAt: horario.abertura || "00:00",
      shiftEndAt: horario.fechamento || "00:00",
    })),
    shippingAreas: unidade.areasEntrega.map((area) => ({
      radius: Number(area.raio) || 0,
      purchaseMin: Number(area.compraMinima) || 0,
      amount: Number(area.preco) || 0,
      time: Number(area.tempo) || 0,
    })),
    insurances: unidade.convenios.map((convenio) => ({
      type: Number(convenio.id) || 1,
      code: cleanNullable(convenio.codigo),
      password: cleanNullable(convenio.senha),
      active: convenio.ativo,
    })),
  };
}
