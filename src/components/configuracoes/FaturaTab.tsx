import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockFaturas = [
  { id: "FAT-001", valor: 1500.0, status: "paga", dataVencimento: "2024-01-15", dataPagamento: "2024-01-10" },
  { id: "FAT-002", valor: 1500.0, status: "a_vencer", dataVencimento: "2024-02-15", dataPagamento: null },
  { id: "FAT-003", valor: 1200.0, status: "vencida", dataVencimento: "2024-01-05", dataPagamento: null },
  { id: "FAT-004", valor: 800.0, status: "excluida", dataVencimento: "2023-12-15", dataPagamento: null },
  { id: "FAT-005", valor: 1500.0, status: "paga", dataVencimento: "2023-12-15", dataPagamento: "2023-12-12" },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  paga: { label: "Paga", variant: "default" },
  a_vencer: { label: "A vencer", variant: "secondary" },
  vencida: { label: "Vencida", variant: "destructive" },
  excluida: { label: "Excluída", variant: "outline" },
};

export function FaturaTab() {
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
            {mockFaturas.map((fatura) => (
              <TableRow key={fatura.id}>
                <TableCell className="font-medium">{fatura.id}</TableCell>
                <TableCell>
                  {fatura.valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
                <TableCell>
                  {new Date(fatura.dataVencimento).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell>
                  {fatura.dataPagamento 
                    ? new Date(fatura.dataPagamento).toLocaleDateString("pt-BR")
                    : "-"
                  }
                </TableCell>
                <TableCell>
                  <Badge variant={statusConfig[fatura.status].variant}>
                    {statusConfig[fatura.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground hover:text-foreground"
                      onClick={() => console.log("Download:", fatura.id)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
