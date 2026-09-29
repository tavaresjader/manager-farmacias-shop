import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Copy, Loader2, Mail, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { managerBackendBff } from "@/services/ManagerBackendBff";
import { toast } from "sonner";

interface IntegrationApiResponse {
  id?: string | number | null;
  Id?: string | number | null;
  integrationId?: string | number | null;
  IntegrationId?: string | number | null;
  name?: string | null;
  Name?: string | null;
  clientId?: string | null;
  ClientId?: string | null;
  merchantId?: string | number | null;
  MerchantId?: string | number | null;
  merchantName?: string | null;
  MerchantName?: string | null;
  merchant?: {
    id?: string | number | null;
    Id?: string | number | null;
    name?: string | null;
    Name?: string | null;
  } | null;
  Merchant?: {
    id?: string | number | null;
    Id?: string | number | null;
    name?: string | null;
    Name?: string | null;
  } | null;
}

type IntegrationListApiResponse =
  | IntegrationApiResponse[]
  | {
      data?: IntegrationApiResponse[] | null;
      Data?: IntegrationApiResponse[] | null;
      items?: IntegrationApiResponse[] | null;
      Items?: IntegrationApiResponse[] | null;
    };

interface Integration {
  id: string;
  name: string;
  clientId: string;
  merchantId: string;
  merchantName: string;
}

interface AvailableMerchantApiResponse {
  id: string;
  name?: string | null;
}

interface CreateIntegrationPayload {
  name: string;
  merchantId: string;
}

const toText = (value: string | number | null | undefined) =>
  value === null || value === undefined ? "" : String(value).trim();

const normalizeLookup = (value: string) => value.trim().toLowerCase();

const getIntegrationId = (integration: IntegrationApiResponse) =>
  toText(integration.id ?? integration.Id ?? integration.integrationId ?? integration.IntegrationId);

const getIntegrationName = (integration: IntegrationApiResponse) =>
  integration.name ?? integration.Name ?? "";

const getIntegrationClientId = (integration: IntegrationApiResponse) =>
  integration.clientId ?? integration.ClientId ?? "";

const getIntegrationMerchantId = (integration: IntegrationApiResponse) =>
  toText(
    integration.merchantId ??
      integration.MerchantId ??
      integration.merchant?.id ??
      integration.merchant?.Id ??
      integration.Merchant?.id ??
      integration.Merchant?.Id,
  );

const getIntegrationMerchantName = (integration: IntegrationApiResponse) =>
  integration.merchantName ??
  integration.MerchantName ??
  integration.merchant?.name ??
  integration.merchant?.Name ??
  integration.Merchant?.name ??
  integration.Merchant?.Name ??
  "";

const getIntegrationList = (response: IntegrationListApiResponse): IntegrationApiResponse[] => {
  if (Array.isArray(response)) return response;
  return response.data ?? response.Data ?? response.items ?? response.Items ?? [];
};

export function IntegracoesTab() {
  const { session } = useAuth();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loadingIntegrations, setLoadingIntegrations] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sendingMailId, setSendingMailId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [fallbackMerchants, setFallbackMerchants] = useState<AvailableMerchantApiResponse[]>([]);
  const [loadingMerchants, setLoadingMerchants] = useState(false);
  const [newIntegration, setNewIntegration] = useState({ name: "", merchantId: "" });

  const sessionMerchants = session?.merchants ?? [];
  const merchantSource = sessionMerchants.length > 0 ? sessionMerchants : fallbackMerchants;

  const availableMerchants = useMemo(
    () =>
      merchantSource
        .filter((merchant) => merchant.id)
        .map((merchant) => ({
          id: merchant.id,
          name: merchant.name?.trim() || "Unidade sem nome",
        })),
    [merchantSource],
  );

  const merchantNameById = useMemo(
    () => new Map(availableMerchants.map((merchant) => [normalizeLookup(merchant.id), merchant.name])),
    [availableMerchants],
  );

  const merchantByName = useMemo(
    () => new Map(availableMerchants.map((merchant) => [normalizeLookup(merchant.name), merchant])),
    [availableMerchants],
  );

  const mapAllowedIntegrations = useCallback((data: IntegrationApiResponse[]): Integration[] => {
    const allowedMerchantIds = new Set(availableMerchants.map((merchant) => normalizeLookup(merchant.id)));

    return data
      .map((integration): Integration | null => {
        const rawMerchantId = getIntegrationMerchantId(integration);
        const rawMerchantName = getIntegrationMerchantName(integration).trim();
        const merchantIdLookup = normalizeLookup(rawMerchantId);
        const merchantFromName = rawMerchantName ? merchantByName.get(normalizeLookup(rawMerchantName)) : undefined;
        const allowedMerchantId = allowedMerchantIds.has(merchantIdLookup)
          ? rawMerchantId
          : merchantFromName?.id ?? "";

        if (!allowedMerchantId || !allowedMerchantIds.has(normalizeLookup(allowedMerchantId))) {
          return null;
        }

        return {
          id: getIntegrationId(integration),
          name: getIntegrationName(integration).trim() || "Integração sem nome",
          clientId: getIntegrationClientId(integration),
          merchantId: allowedMerchantId,
          merchantName:
            merchantNameById.get(normalizeLookup(allowedMerchantId)) ||
            rawMerchantName ||
            "Unidade não informada",
        };
      })
      .filter((integration): integration is Integration => Boolean(integration?.id));
  }, [availableMerchants, merchantByName, merchantNameById]);

  const loadIntegrations = async () => {
    setLoadingIntegrations(true);
    const response = await managerBackendBff.get<IntegrationListApiResponse>("/v1/integrations");

    if (response.data) {
      setIntegrations(mapAllowedIntegrations(getIntegrationList(response.data)));
    } else {
      setIntegrations([]);
      toast.error(`Erro ao carregar integrações: ${response.error ?? "Tente novamente."}`);
    }

    setLoadingIntegrations(false);
  };

  useEffect(() => {
    if (sessionMerchants.length > 0) {
      setFallbackMerchants([]);
      return;
    }

    let cancelled = false;

    const fetchFallbackMerchants = async () => {
      setLoadingMerchants(true);
      const response = await managerBackendBff.get<AvailableMerchantApiResponse[]>("/v1/Merchants");

      if (cancelled) return;

      if (response.data) {
        setFallbackMerchants(response.data);
      } else {
        setFallbackMerchants([]);
        toast.error(`Erro ao carregar unidades disponíveis: ${response.error ?? "Tente novamente."}`);
      }

      setLoadingMerchants(false);
    };

    fetchFallbackMerchants();

    return () => {
      cancelled = true;
    };
  }, [sessionMerchants.length]);

  useEffect(() => {
    let cancelled = false;

    const fetchIntegrations = async () => {
      setLoadingIntegrations(true);
      const response = await managerBackendBff.get<IntegrationListApiResponse>("/v1/integrations");

      if (cancelled) return;

      if (response.data) {
        setIntegrations(mapAllowedIntegrations(getIntegrationList(response.data)));
      } else {
        setIntegrations([]);
        toast.error(`Erro ao carregar integrações: ${response.error ?? "Tente novamente."}`);
      }

      setLoadingIntegrations(false);
    };

    fetchIntegrations();

    return () => {
      cancelled = true;
    };
  }, [mapAllowedIntegrations]);

  const resetCreateForm = () => {
    setNewIntegration({ name: "", merchantId: "" });
  };

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) resetCreateForm();
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copiado para a área de transferência.`);
    } catch {
      toast.error(`Não foi possível copiar ${label}.`);
    }
  };

  const handleCreateIntegration = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = newIntegration.name.trim();
    const merchantId = newIntegration.merchantId;
    const merchantIsAllowed = availableMerchants.some((merchant) => merchant.id === merchantId);

    if (!name) {
      toast.error("Informe o nome da integração.");
      return;
    }

    if (!merchantId || !merchantIsAllowed) {
      toast.error("Selecione uma unidade disponível para o seu usuário.");
      return;
    }

    const payload: CreateIntegrationPayload = { name, merchantId };
    setIsCreating(true);
    const response = await managerBackendBff.post<unknown>("/v1/integrations", payload);
    setIsCreating(false);

    if (response.error) {
      toast.error(`Erro ao cadastrar integração: ${response.error}`);
      return;
    }

    toast.success("Integração cadastrada com sucesso.");
    resetCreateForm();
    setIsModalOpen(false);
    await loadIntegrations();
  };

  const handleDeleteIntegration = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const response = await managerBackendBff.delete<unknown>(
      `/v1/integrations/${encodeURIComponent(deleteId)}`,
    );
    setIsDeleting(false);

    if (response.error) {
      toast.error(`Erro ao excluir integração: ${response.error}`);
      return;
    }

    toast.success("Integração excluída com sucesso.");
    setIntegrations((prev) => prev.filter((integration) => integration.id !== deleteId));
    setDeleteId(null);
  };

  const handleSendCredentials = async (integrationId: string) => {
    setSendingMailId(integrationId);
    const response = await managerBackendBff.post<unknown>(
      `/v1/Integrations/send/mail/${encodeURIComponent(integrationId)}`,
    );
    setSendingMailId(null);

    if (response.error) {
      toast.error(`Erro ao enviar credencial por e-mail: ${response.error}`);
      return;
    }

    toast.success("Credencial enviada por e-mail com sucesso.");
  };

  const canCreateIntegration =
    newIntegration.name.trim().length > 0 &&
    availableMerchants.some((merchant) => merchant.id === newIntegration.merchantId);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-lg font-semibold text-foreground">Integrações</h2>
        <Button onClick={() => setIsModalOpen(true)} disabled={loadingMerchants || availableMerchants.length === 0}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar integração
        </Button>
      </div>
      
      <Dialog open={isModalOpen} onOpenChange={handleModalOpenChange}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleCreateIntegration}>
            <DialogHeader>
              <DialogTitle>Adicionar integração</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome-integracao">Nome da integração</Label>
                <Input
                  id="nome-integracao"
                  placeholder="Ex: Integração 01"
                  value={newIntegration.name}
                  onChange={(event) =>
                    setNewIntegration((prev) => ({ ...prev, name: event.target.value }))
                  }
                  disabled={isCreating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidade-integracao">Unidade</Label>
                <Select
                  value={newIntegration.merchantId}
                  onValueChange={(value) =>
                    setNewIntegration((prev) => ({ ...prev, merchantId: value }))
                  }
                  disabled={isCreating}
                >
                  <SelectTrigger id="unidade-integracao">
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMerchants.map((merchant) => (
                      <SelectItem key={merchant.id} value={merchant.id}>
                        {merchant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} disabled={isCreating}>
                Cancelar
              </Button>
              <Button type="submit" disabled={!canCreateIntegration || isCreating}>
                {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Adicionar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Client ID</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Credencial</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingIntegrations ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  <div className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Carregando integrações...
                  </div>
                </TableCell>
              </TableRow>
            ) : integrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  Nenhuma integração encontrada.
                </TableCell>
              </TableRow>
            ) : (
              integrations.map((integration) => (
                <TableRow key={integration.id}>
                  <TableCell className="font-medium">{integration.name}</TableCell>
                  <TableCell>
                    {integration.clientId ? (
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded break-all">
                          {integration.clientId}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground shrink-0"
                          onClick={() => copyToClipboard(integration.clientId, "Client ID")}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Não informado</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{integration.merchantName}</span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white dark:bg-background"
                      disabled={sendingMailId === integration.id}
                      onClick={() => handleSendCredentials(integration.id)}
                    >
                      {sendingMailId === integration.id ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Mail className="w-4 h-4 mr-2" />
                      )}
                      Enviar por e-mail
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteId(integration.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir integração</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta integração? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(event) => {
                event.preventDefault();
                handleDeleteIntegration();
              }}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
