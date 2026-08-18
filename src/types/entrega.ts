export type EntregaStatus =
  | "aguardando"
  | "coletando"
  | "em_rota"
  | "entregue"
  | "problema";

export type EntregaSituacao = "ok" | "atraso" | "problema";

export interface Entregador {
  nome: string;
  telefone: string;
  veiculo: string;
}

export interface Entrega {
  id: string;
  codigo: string;
  numeroPedido?: string;
  origem: "avulsa" | "farmacia-shop" | "ifood" | "keeta" | "pede-pronto" | "aiqfome";
  unidade: string;
  cliente: string;
  telefone: string;
  cep?: string;
  endereco: string;
  complemento?: string;
  valor: number;
  observacoes?: string;
  status: EntregaStatus;
  situacao: EntregaSituacao;
  entregador: Entregador | null;
  solicitadaEm: string;
  previsaoMinutos: number;
  progresso: number;
  motivoProblema?: string;
}

export const statusLabels: Record<EntregaStatus, string> = {
  aguardando: "Aguardando entregador",
  coletando: "Coletando na unidade",
  em_rota: "Em rota de entrega",
  entregue: "Entregue",
  problema: "Com problema",
};

export const situacaoLabels: Record<EntregaSituacao, string> = {
  ok: "Em andamento",
  atraso: "Em atraso",
  problema: "Problema",
};
