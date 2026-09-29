import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { managerBackendBff } from "@/services/ManagerBackendBff";

interface InvoiceApiResponse {
  [key: string]: string | number | null | undefined;
}

interface InvoiceListApiResponse {
  data?: InvoiceApiResponse[] | null;
  Data?: InvoiceApiResponse[] | null;
  items?: InvoiceApiResponse[] | null;
  Items?: InvoiceApiResponse[] | null;
  results?: InvoiceApiResponse[] | null;
  Results?: InvoiceApiResponse[] | null;
  invoices?: InvoiceApiResponse[] | null;
  Invoices?: InvoiceApiResponse[] | null;
}

interface Invoice {
  id: string | null;
  key: string;
  number: string;
  amount: number;
  status: string;
  dueDate: string | null;
  paidAt: string | null;
}

const INVOICES_ENDPOINT = "/v1/invoices";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  paid: { label: "Paga", variant: "default" },
  paga: { label: "Paga", variant: "default" },
  open: { label: "A vencer", variant: "secondary" },
  pending: { label: "A vencer", variant: "secondary" },
  a_vencer: { label: "A vencer", variant: "secondary" },
  overdue: { label: "Vencida", variant: "destructive" },
  vencida: { label: "Vencida", variant: "destructive" },
  canceled: { label: "Excluída", variant: "outline" },
  cancelled: { label: "Excluída", variant: "outline" },
  excluida: { label: "Excluída", variant: "outline" },
};

function normalizeStatus(status: string | null | undefined): string {
  return status?.trim().toLowerCase() || "unknown";
}

function formatStatus(status: string): string {
  const config = statusConfig[status];
  if (config) return config.label;

  return status
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ") || "-";
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value: string | null): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("pt-BR");
}

function normalizeFieldName(fieldName: string): string {
  return fieldName.replace(/[^a-z0-9]/gi, "").toLowerCase();
}

function getFieldValue(invoice: InvoiceApiResponse, fieldNames: string[]): string | number | null | undefined {
  const normalizedFieldNames = new Set(fieldNames.map(normalizeFieldName));
  const entry = Object.entries(invoice).find(([key]) => normalizedFieldNames.has(normalizeFieldName(key)));
  return entry?.[1];
}

function toStringValue(value: string | number | null | undefined): string | null {
  if (value === null || value === undefined || value === "") return null;
  return String(value);
}

function parseAmount(value: number | string | null | undefined): number {
  if (typeof value === "number") return value;
  if (!value) return 0;

  const normalizedValue = value
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");

  const amount = Number(normalizedValue);
  return Number.isFinite(amount) ? amount : 0;
}

function getInvoiceAmount(invoice: InvoiceApiResponse): number {
  return parseAmount(
    getFieldValue(invoice, [
      "amount",
      "value",
      "total",
      "totalAmount",
      "valor",
      "valorTotal",
      "invoiceAmount",
      "invoiceValue",
    ]),
  );
}

function getInvoiceList(data: InvoiceApiResponse[] | InvoiceListApiResponse | null): InvoiceApiResponse[] {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];

  return (
    data.data ??
    data.Data ??
    data.items ??
    data.Items ??
    data.results ??
    data.Results ??
    data.invoices ??
    data.Invoices ??
    []
  );
}

function toInvoice(invoice: InvoiceApiResponse, index: number): Invoice {
  const id = toStringValue(
    getFieldValue(invoice, [
      "id",
      "invoiceId",
      "invoiceID",
      "faturaId",
      "faturaID",
      "billingId",
      "documentId",
    ]),
  );
  const number =
    toStringValue(
      getFieldValue(invoice, [
        "number",
        "invoiceNumber",
        "invoiceNo",
        "invoiceCode",
        "code",
        "numero",
        "numeroFatura",
        "faturaNumero",
      ]),
    ) ??
    id ??
    "-";

  const status = toStringValue(getFieldValue(invoice, ["status", "situacao", "state"])) ?? "unknown";
  const dueDate = toStringValue(
    getFieldValue(invoice, ["dueDate", "expiresAt", "dueAt", "dataVencimento", "vencimento", "due"]),
  );
  const paidAt = toStringValue(
    getFieldValue(invoice, ["paidAt", "paymentDate", "paidDate", "dataPagamento", "pagamento", "paymentAt"]),
  );

  return {
    id,
    key: id ?? `${number}-${index}`,
    number,
    amount: getInvoiceAmount(invoice),
    status: normalizeStatus(status),
    dueDate,
    paidAt,
  };
}

function getFileExtension(contentType: string | null): string {
  if (contentType?.includes("pdf")) return "pdf";
  if (contentType?.includes("zip")) return "zip";
  if (contentType?.includes("json")) return "json";
  return "pdf";
}

function saveBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function FaturaTab() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchInvoices = async () => {
      setIsLoading(true);
      const response = await managerBackendBff.get<InvoiceApiResponse[] | InvoiceListApiResponse>(INVOICES_ENDPOINT);

      if (cancelled) return;

      if (response.data) {
        setInvoices(getInvoiceList(response.data).map(toInvoice));
      } else {
        setInvoices([]);
        toast.error(`Erro ao carregar faturas: ${response.error ?? "Tente novamente."}`);
      }

      setIsLoading(false);
    };

    fetchInvoices();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDownload = async (invoice: Invoice) => {
    if (isLoading) return;

    if (!invoice.id) {
      toast.error("Não foi possível identificar a fatura para download.");
      return;
    }

    setDownloadingInvoiceId(invoice.id);

    const response = await managerBackendBff.download(
      `${INVOICES_ENDPOINT}/${encodeURIComponent(invoice.id)}/download`,
    );

    if (response.data) {
      const fileName =
        response.data.fileName ?? `fatura-${invoice.number}.${getFileExtension(response.data.contentType)}`;
      saveBlob(response.data.blob, fileName);
      toast.success("Download da fatura iniciado.");
    } else {
      toast.error(`Erro ao baixar fatura: ${response.error ?? "Tente novamente."}`);
    }

    setDownloadingInvoiceId(null);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">Minhas faturas</h2>
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº Fatura</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Carregando faturas...
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhuma fatura encontrada.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => {
                const status = statusConfig[invoice.status] ?? {
                  label: formatStatus(invoice.status),
                  variant: "outline" as const,
                };
                const isDownloading = downloadingInvoiceId === invoice.id;

                return (
                  <TableRow key={invoice.key}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell>{formatDate(invoice.paidAt)}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 px-3"
                          disabled={isLoading || isDownloading || !invoice.id}
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDownload(invoice);
                          }}
                        >
                          {isDownloading ? (
                            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4 mr-1" />
                          )}
                          Download
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
