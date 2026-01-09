import { FileText, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockFaturas = [
  { id: "FAT-001", valor: 1500.0, status: "paga" },
  { id: "FAT-002", valor: 1500.0, status: "a_vencer" },
  { id: "FAT-003", valor: 1200.0, status: "vencida" },
  { id: "FAT-004", valor: 800.0, status: "excluida" },
  { id: "FAT-005", valor: 1500.0, status: "paga" },
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
                      onClick={() => console.log("Baixar PDF:", fatura.id)}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2 text-muted-foreground hover:text-foreground"
                      onClick={() => console.log("Baixar NF:", fatura.id)}
                    >
                      <Receipt className="w-4 h-4 mr-1" />
                      NF
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
