import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface HorarioFuncionamento {
  dia: string;
  aberto: boolean;
  abertura?: string;
  fechamento?: string;
}

export interface Unidade {
  id: string;
  nome: string;
  endereco: string;
  numero: string;
  cep: string;
  situacao: "aberta" | "fechada";
  status: "ativa" | "inativa";
  horarios: HorarioFuncionamento[];
}

const mockUnidades: Unidade[] = [
  {
    id: "1",
    nome: "Matriz",
    endereco: "Av. Paulista - São Paulo/SP",
    numero: "1000",
    cep: "01310-100",
    situacao: "aberta",
    status: "ativa",
    horarios: [
      { dia: "Segunda-feira", aberto: true, abertura: "08:00", fechamento: "18:00" },
      { dia: "Terça-feira", aberto: true, abertura: "08:00", fechamento: "18:00" },
      { dia: "Quarta-feira", aberto: true, abertura: "08:00", fechamento: "18:00" },
      { dia: "Quinta-feira", aberto: true, abertura: "08:00", fechamento: "18:00" },
      { dia: "Sexta-feira", aberto: true, abertura: "08:00", fechamento: "18:00" },
      { dia: "Sábado", aberto: true, abertura: "09:00", fechamento: "13:00" },
      { dia: "Domingo", aberto: false },
    ],
  },
  {
    id: "2",
    nome: "Filial Centro",
    endereco: "Rua XV de Novembro - Curitiba/PR",
    numero: "500",
    cep: "80020-310",
    situacao: "aberta",
    status: "ativa",
    horarios: [
      { dia: "Segunda-feira", aberto: true, abertura: "09:00", fechamento: "19:00" },
      { dia: "Terça-feira", aberto: true, abertura: "09:00", fechamento: "19:00" },
      { dia: "Quarta-feira", aberto: true, abertura: "09:00", fechamento: "19:00" },
      { dia: "Quinta-feira", aberto: true, abertura: "09:00", fechamento: "19:00" },
      { dia: "Sexta-feira", aberto: true, abertura: "09:00", fechamento: "19:00" },
      { dia: "Sábado", aberto: true, abertura: "10:00", fechamento: "14:00" },
      { dia: "Domingo", aberto: false },
    ],
  },
  {
    id: "3",
    nome: "Filial Shopping",
    endereco: "Shopping Center Norte, Loja 45 - São Paulo/SP",
    numero: "45",
    cep: "02089-900",
    situacao: "fechada",
    status: "inativa",
    horarios: [
      { dia: "Segunda-feira", aberto: true, abertura: "10:00", fechamento: "22:00" },
      { dia: "Terça-feira", aberto: true, abertura: "10:00", fechamento: "22:00" },
      { dia: "Quarta-feira", aberto: true, abertura: "10:00", fechamento: "22:00" },
      { dia: "Quinta-feira", aberto: true, abertura: "10:00", fechamento: "22:00" },
      { dia: "Sexta-feira", aberto: true, abertura: "10:00", fechamento: "22:00" },
      { dia: "Sábado", aberto: true, abertura: "10:00", fechamento: "22:00" },
      { dia: "Domingo", aberto: true, abertura: "14:00", fechamento: "20:00" },
    ],
  },
];

export function UnidadesTab() {
  const navigate = useNavigate();
  const [unidades] = useState<Unidade[]>(mockUnidades);

  const handleUnidadeClick = (unidade: Unidade) => {
    navigate(`/configuracoes/unidades/${unidade.id}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Unidades</h2>
        <Button onClick={() => console.log("Adicionar unidade")}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar unidade
        </Button>
      </div>
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {unidades.map((unidade) => (
              <TableRow 
                key={unidade.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleUnidadeClick(unidade)}
              >
                <TableCell className="font-medium">{unidade.nome}</TableCell>
                <TableCell>{unidade.endereco}</TableCell>
                <TableCell>
                  <Badge variant={unidade.situacao === "aberta" ? "default" : "secondary"}>
                    {unidade.situacao === "aberta" ? "Aberta" : "Fechada"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={unidade.status === "ativa" ? "default" : "secondary"}>
                    {unidade.status === "ativa" ? "Ativa" : "Inativa"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUnidadeClick(unidade);
                    }}
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
