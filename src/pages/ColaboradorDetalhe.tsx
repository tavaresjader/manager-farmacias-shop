import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageLoading } from "@/components/layout/PageLoading";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageLoading } from "@/hooks/usePageLoading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { User, Building2, Save, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { managerBackendBff } from "@/services/ManagerBackendBff";
import { MerchantListApiResponse } from "@/types/merchant";
import {
  EmployeeDetailsApiResponse,
  EmployeeForm,
  EmployeeMerchantDto,
  createEmptyEmployee,
  toEmployeeForm,
  toEmployeePayload,
} from "@/types/employee";
import { toast } from "sonner";

function filterMerchantsBySession(
  merchants: EmployeeMerchantDto[],
  sessionMerchants: Array<{ id: string; name?: string }> | undefined,
): EmployeeMerchantDto[] {
  if (!sessionMerchants?.length) return merchants;

  const allowedIds = new Set(sessionMerchants.map((merchant) => merchant.id));
  return merchants.filter((merchant) => allowedIds.has(merchant.id));
}

function toEmployeeMerchants(
  merchants: MerchantListApiResponse[],
  sessionMerchants: Array<{ id: string; name?: string }> | undefined,
): EmployeeMerchantDto[] {
  const allowedIds = sessionMerchants?.length
    ? new Set(sessionMerchants.map((merchant) => merchant.id))
    : null;

  return merchants
    .filter((merchant) => !allowedIds || allowedIds.has(merchant.id))
    .map((merchant) => ({
      id: merchant.id,
      name: merchant.name?.trim() || "Unidade sem nome",
      checked: false,
    }));
}

const ColaboradorDetalhe = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const isNew = id === "novo";
  const isPageLoading = usePageLoading();

  const [colaborador, setColaborador] = useState<EmployeeForm | null>(null);
  const [senha, setSenha] = useState("");
  const [isLoadingColaborador, setIsLoadingColaborador] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  usePageTitle(isNew ? "Novo Colaborador" : "Editar Colaborador");

  const selectedMerchantIds = useMemo(
    () =>
      new Set(
        (colaborador?.merchants ?? [])
          .filter((merchant) => merchant.checked)
          .map((merchant) => merchant.id),
      ),
    [colaborador?.merchants],
  );

  useEffect(() => {
    let cancelled = false;

    const fetchColaborador = async () => {
      setIsLoadingColaborador(true);

      if (isNew) {
        const response = await managerBackendBff.get<MerchantListApiResponse[]>("/v1/Merchants");
        if (cancelled) return;

        if (response.data) {
          setColaborador({
            ...createEmptyEmployee(),
            merchants: toEmployeeMerchants(response.data, session?.merchants),
          });
        } else {
          setColaborador(createEmptyEmployee());
          toast.error(`Erro ao carregar unidades: ${response.error ?? "Tente novamente."}`);
        }

        setIsLoadingColaborador(false);
        return;
      }

      if (!id) {
        setColaborador(null);
        setIsLoadingColaborador(false);
        return;
      }

      const response = await managerBackendBff.get<EmployeeDetailsApiResponse>(
        `/v1/Employees/${encodeURIComponent(id)}`,
      );

      if (cancelled) return;

      if (response.data) {
        const mappedEmployee = toEmployeeForm(response.data);
        setColaborador({
          ...mappedEmployee,
          merchants: mappedEmployee.master
            ? mappedEmployee.merchants
            : filterMerchantsBySession(mappedEmployee.merchants, session?.merchants),
        });
      } else {
        setColaborador(null);
        toast.error(`Erro ao carregar colaborador: ${response.error ?? "Tente novamente."}`);
      }

      setIsLoadingColaborador(false);
    };

    fetchColaborador();

    return () => {
      cancelled = true;
    };
  }, [id, isNew, session?.merchants]);

  const updateColaborador = (changes: Partial<EmployeeForm>) => {
    setColaborador((current) => (current ? { ...current, ...changes } : current));
  };

  const handleUnidadeToggle = (unidadeId: string) => {
    setColaborador((current) =>
      current
        ? {
            ...current,
            merchants: current.merchants.map((merchant) =>
              merchant.id === unidadeId ? { ...merchant, checked: !merchant.checked } : merchant,
            ),
          }
        : current,
    );
  };

  const handleSave = async () => {
    if (!colaborador) return;

    if (!colaborador.name.trim()) {
      toast.error("Informe o nome do colaborador.");
      return;
    }

    if (!colaborador.email.trim()) {
      toast.error("Informe o e-mail do colaborador.");
      return;
    }

    if (isNew && !senha.trim()) {
      toast.error("Defina a senha de acesso.");
      return;
    }

    setIsSaving(true);

    const payload = toEmployeePayload(colaborador, senha);
    const response = isNew
      ? await managerBackendBff.post<unknown>("/v1/Employees", payload)
      : await managerBackendBff.put<unknown>(
          `/v1/Employees/${encodeURIComponent(colaborador.id)}`,
          payload,
        );

    if (response.error) {
      toast.error(`Erro ao ${isNew ? "cadastrar" : "atualizar"} colaborador: ${response.error}`);
      setIsSaving(false);
      return;
    }

    toast.success(`Colaborador ${isNew ? "cadastrado" : "atualizado"} com sucesso.`);
    navigate("/configuracoes/colaboradores");
  };

  const handleRemove = async () => {
    if (!colaborador?.id) return;

    setIsDeleting(true);
    const response = await managerBackendBff.delete<unknown>(
      `/v1/Employees/${encodeURIComponent(colaborador.id)}`,
    );

    if (response.error) {
      toast.error(`Erro ao excluir colaborador: ${response.error}`);
      setIsDeleting(false);
      return;
    }

    toast.success("Colaborador excluído com sucesso.");
    navigate("/configuracoes/colaboradores");
  };

  if (isPageLoading || isLoadingColaborador) {
    return (
      <MainLayout>
        <PageLoading />
      </MainLayout>
    );
  }

  if (!colaborador) {
    return (
      <MainLayout>
        <div className="p-6">
          <p className="text-muted-foreground">Colaborador não encontrado.</p>
          <Button variant="outline" onClick={() => navigate("/configuracoes/colaboradores")} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 max-w-4xl">
        <h1 className="text-2xl font-semibold text-foreground mb-6">
          {isNew ? "Novo Colaborador" : "Colaborador"}
        </h1>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="w-5 h-5" />
                Dados do Colaborador
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={colaborador.name}
                    onChange={(event) => updateColaborador({ name: event.target.value })}
                    placeholder="Nome do colaborador"
                    className="bg-white dark:bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={colaborador.email}
                    onChange={(event) => updateColaborador({ email: event.target.value })}
                    placeholder="email@empresa.com"
                    className="bg-white dark:bg-background"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    placeholder={isNew ? "Defina a senha de acesso" : "Deixe em branco para manter a senha atual"}
                    autoComplete="new-password"
                    className="bg-white dark:bg-background"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="ativo">Situação</Label>
                    <p className="text-sm text-muted-foreground">
                      {colaborador.active ? "Ativo" : "Inativo"}
                    </p>
                  </div>
                  <Switch
                    id="ativo"
                    checked={colaborador.active}
                    onCheckedChange={(active) => updateColaborador({ active })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="master">Perfil Master</Label>
                    <p className="text-sm text-muted-foreground">
                      {colaborador.master ? "Master" : "Padrão"}
                    </p>
                  </div>
                  <Switch
                    id="master"
                    checked={colaborador.master}
                    onCheckedChange={(master) => updateColaborador({ master })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {!colaborador.master && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="w-5 h-5" />
                  Unidades de Acesso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Selecione as unidades que este colaborador pode acessar
                </p>
                <div className="space-y-3">
                  {colaborador.merchants.length === 0 ? (
                    <div className="p-3 border border-border rounded-lg text-sm text-muted-foreground">
                      Nenhuma unidade disponível para este colaborador.
                    </div>
                  ) : (
                    colaborador.merchants.map((unidade) => (
                      <div
                        key={unidade.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            id={`unidade-${unidade.id}`}
                            checked={selectedMerchantIds.has(unidade.id)}
                            onCheckedChange={() => handleUnidadeToggle(unidade.id)}
                          />
                          <div>
                            <Label
                              htmlFor={`unidade-${unidade.id}`}
                              className="font-medium cursor-pointer"
                            >
                              {unidade.name || "Unidade sem nome"}
                            </Label>
                          </div>
                        </div>
                        {selectedMerchantIds.has(unidade.id) && (
                          <Badge variant="default" className="text-xs">
                            Acesso liberado
                          </Badge>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between">
            {!isNew ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={isSaving || isDeleting}>
                    {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                    Remover
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remover colaborador</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja remover este colaborador? Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRemove} disabled={isDeleting}>
                      Confirmar remoção
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <div />
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/configuracoes/colaboradores")}
                disabled={isSaving || isDeleting}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button onClick={handleSave} disabled={isSaving || isDeleting}>
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {isNew ? "Criar colaborador" : "Salvar alterações"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ColaboradorDetalhe;
