import { Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockColaboradores = [
  { id: "1", nome: "João Silva", email: "joao.silva@empresa.com", situacao: "ativo" },
  { id: "2", nome: "Maria Santos", email: "maria.santos@empresa.com", situacao: "ativo" },
  { id: "3", nome: "Carlos Oliveira", email: "carlos.oliveira@empresa.com", situacao: "inativo" },
  { id: "4", nome: "Ana Costa", email: "ana.costa@empresa.com", situacao: "ativo" },
];

const colaboradorStatusConfig: Record<string, { label: string; variant: "default" | "secondary" }> = {
  ativo: { label: "Ativo", variant: "default" },
  inativo: { label: "Inativo", variant: "secondary" },
};

export function ColaboradoresTab() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Colaboradores</h2>
        <Button onClick={() => console.log("Adicionar colaborador")}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar colaborador
        </Button>
      </div>
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockColaboradores.map((colaborador) => (
              <TableRow key={colaborador.id}>
                <TableCell className="font-medium">{colaborador.nome}</TableCell>
                <TableCell>{colaborador.email}</TableCell>
                <TableCell>
                  <Badge variant={colaboradorStatusConfig[colaborador.situacao].variant}>
                    {colaboradorStatusConfig[colaborador.situacao].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => console.log("Visualizar colaborador:", colaborador.id)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
