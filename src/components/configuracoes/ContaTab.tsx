import { FormEvent, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { managerBackendBff } from "@/services/ManagerBackendBff";
import { toast } from "sonner";

interface Empresa {
  cnpj: string;
  nome: string;
  situacao: "ativo" | "inativo";
  endereco: string;
  telefone: string;
  farmaceutico: string;
  horarioAtendimento: string;
  autorizacaoFuncionamento: string;
}

interface AccountApiResponse {
  document?: string | null;
  cnpj?: string | null;
  name?: string | null;
  companyName?: string | null;
  legalName?: string | null;
  active?: boolean | null;
  status?: boolean | string | null;
  situation?: string | null;
  address?: string | null;
  fullAddress?: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  whatsApp?: string | null;
  whatsapp?: string | null;
  pharmacist?: string | null;
  responsiblePharmacist?: string | null;
  technicalResponsible?: string | null;
  openingHours?: string | null;
  businessHours?: string | null;
  serviceHours?: string | null;
  operatingAuthorization?: string | null;
  afe?: string | null;
  authorization?: string | null;
}

interface AccountPayload {
  document: string | null;
  name: string;
  active: boolean;
  address: string | null;
  phone: string | null;
  responsiblePharmacist: string | null;
  openingHours: string | null;
  operatingAuthorization: string | null;
}

const DEFAULT_EMPRESA: Empresa = {
  cnpj: "",
  nome: "",
  situacao: "ativo",
  endereco: "",
  telefone: "",
  farmaceutico: "",
  horarioAtendimento: "",
  autorizacaoFuncionamento: "",
};

function firstString(...values: Array<string | null | undefined>): string {
  return values.find((value) => typeof value === "string" && value.trim())?.trim() ?? "";
}

function normalizeCnpjAlphanumeric(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 14);
}

function formatCnpjAlphanumeric(value: string): string {
  const normalized = normalizeCnpjAlphanumeric(value);
  const parts = [
    normalized.slice(0, 2),
    normalized.slice(2, 5),
    normalized.slice(5, 8),
    normalized.slice(8, 12),
    normalized.slice(12, 14),
  ].filter(Boolean);

  let formatted = parts[0] ?? "";
  if (parts[1]) formatted += `.${parts[1]}`;
  if (parts[2]) formatted += `.${parts[2]}`;
  if (parts[3]) formatted += `/${parts[3]}`;
  if (parts[4]) formatted += `-${parts[4]}`;

  return formatted;
}

function toEmpresa(account: AccountApiResponse): Empresa {
  const status = account.active ?? account.status ?? account.situation;
  const isActive =
    typeof status === "boolean"
      ? status
      : !["inactive", "inativo", "false", "disabled", "desabilitado"].includes(
          String(status ?? "ativo").trim().toLowerCase(),
        );

  return {
    cnpj: normalizeCnpjAlphanumeric(firstString(account.document, account.cnpj)),
    nome: firstString(account.name, account.companyName, account.legalName),
    situacao: isActive ? "ativo" : "inativo",
    endereco: firstString(account.address, account.fullAddress),
    telefone: firstString(account.phone, account.phoneNumber, account.whatsApp, account.whatsapp),
    farmaceutico: firstString(
      account.responsiblePharmacist,
      account.technicalResponsible,
      account.pharmacist,
    ),
    horarioAtendimento: firstString(account.openingHours, account.businessHours, account.serviceHours),
    autorizacaoFuncionamento: firstString(
      account.operatingAuthorization,
      account.afe,
      account.authorization,
    ),
  };
}

function cleanNullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function toAccountPayload(empresa: Empresa): AccountPayload {
  return {
    document: cleanNullable(normalizeCnpjAlphanumeric(empresa.cnpj)),
    name: empresa.nome.trim(),
    active: empresa.situacao === "ativo",
    address: cleanNullable(empresa.endereco),
    phone: cleanNullable(empresa.telefone),
    responsiblePharmacist: cleanNullable(empresa.farmaceutico),
    openingHours: cleanNullable(empresa.horarioAtendimento),
    operatingAuthorization: cleanNullable(empresa.autorizacaoFuncionamento),
  };
}

export function ContaTab() {
  const [empresa, setEmpresa] = useState<Empresa>(DEFAULT_EMPRESA);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [savingAccount, setSavingAccount] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadAccount = async () => {
      setLoadingAccount(true);
      const response = await managerBackendBff.get<AccountApiResponse>("/v1/accounts");

      if (cancelled) return;

      if (response.data) {
        setEmpresa(toEmpresa(response.data));
      } else {
        toast.error(`Erro ao carregar dados da conta: ${response.error ?? "Tente novamente."}`);
      }

      setLoadingAccount(false);
    };

    loadAccount();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleEmpresaChange = (field: keyof Empresa, value: string) => {
    setEmpresa((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!empresa.nome.trim()) {
      toast.error("Informe o nome da empresa.");
      return;
    }

    setSavingAccount(true);
    const response = await managerBackendBff.put<AccountApiResponse>(
      "/v1/accounts",
      toAccountPayload(empresa),
    );

    setSavingAccount(false);

    if (response.error) {
      toast.error(`Erro ao salvar dados da conta: ${response.error}`);
      return;
    }

    toast.success("Dados da conta salvos com sucesso.");
  };

  const controlsDisabled = loadingAccount || savingAccount;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">Dados da empresa</h2>
        {loadingAccount && (
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando conta...
          </span>
        )}
      </div>
      <form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="cnpj">CNPJ</Label>
          <Input
            id="cnpj"
            placeholder="XX.XXX.XXX/XXXX-XX"
            value={formatCnpjAlphanumeric(empresa.cnpj)}
            onChange={(e) => handleEmpresaChange("cnpj", normalizeCnpjAlphanumeric(e.target.value))}
            maxLength={18}
            disabled={controlsDisabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nome">Nome da empresa</Label>
          <Input
            id="nome"
            placeholder="Nome da empresa"
            value={empresa.nome}
            onChange={(e) => handleEmpresaChange("nome", e.target.value)}
            disabled={controlsDisabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endereco">Endereço completo</Label>
          <Input
            id="endereco"
            placeholder="Rua, número, bairro, cidade - UF, CEP"
            value={empresa.endereco}
            onChange={(e) => handleEmpresaChange("endereco", e.target.value)}
            disabled={controlsDisabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone / WhatsApp</Label>
          <Input
            id="telefone"
            placeholder="(00) 00000-0000"
            value={empresa.telefone}
            onChange={(e) => handleEmpresaChange("telefone", e.target.value)}
            disabled={controlsDisabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="farmaceutico">Farmacêutico Responsável</Label>
          <Input
            id="farmaceutico"
            placeholder="Nome e CRF do responsável técnico"
            value={empresa.farmaceutico}
            onChange={(e) => handleEmpresaChange("farmaceutico", e.target.value)}
            disabled={controlsDisabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="horarioAtendimento">Horário de atendimento</Label>
          <Input
            id="horarioAtendimento"
            placeholder="Seg a Sex, 08h às 18h"
            value={empresa.horarioAtendimento}
            onChange={(e) => handleEmpresaChange("horarioAtendimento", e.target.value)}
            disabled={controlsDisabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="autorizacaoFuncionamento">Autorização de Funcionamento da Empresa</Label>
          <Input
            id="autorizacaoFuncionamento"
            placeholder="Número da AFE"
            value={empresa.autorizacaoFuncionamento}
            onChange={(e) => handleEmpresaChange("autorizacaoFuncionamento", e.target.value)}
            disabled={controlsDisabled}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="situacao">Situação</Label>
          <Select
            value={empresa.situacao}
            onValueChange={(value: Empresa["situacao"]) => handleEmpresaChange("situacao", value)}
            disabled={controlsDisabled}
          >
            <SelectTrigger id="situacao">
              <SelectValue placeholder="Selecione a situação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="mt-4" disabled={controlsDisabled}>
          {savingAccount && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Salvar alterações
        </Button>
      </form>
    </div>
  );
}
