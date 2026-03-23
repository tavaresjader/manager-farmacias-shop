import { useState, useEffect } from "react";
import { Plus, Eye, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { managerBackendBff } from "@/services/ManagerBackendBff";
import { toast } from "sonner";

interface Employee {
  id: string;
  name: string;
  email: string;
  active: boolean;
  master: boolean;
  merchants?: string[];
}

const colaboradorStatusConfig: Record<string, { label: string; variant: "default" | "secondary" }> = {
  ativo: { label: "Ativo", variant: "default" },
  inativo: { label: "Inativo", variant: "secondary" },
};

export function ColaboradoresTab() {
  const navigate = useNavigate();
  const [colaboradores, setColaboradores] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchColaboradores();
  }, []);

  const fetchColaboradores = async () => {
    setIsLoading(true);
    try {
      const response = await managerBackendBff.get<Employee[]>("/v1/Accounts/employees");

      if (response.error) {
        toast.error("Erro ao carregar colaboradores.");
        console.error(response.error);
      } else if (response.data) {
        setColaboradores(response.data);
      }
    } catch (error) {
      toast.error("Erro ao carregar colaboradores.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSituacao = (active: boolean) => (active ? "ativo" : "inativo");

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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : colaboradores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhum colaborador encontrado.
                </TableCell>
              </TableRow>
            ) : (
              colaboradores.map((colaborador) => {
                const situacao = getSituacao(colaborador.active);
                return (
                  <TableRow key={colaborador.id}>
                    <TableCell className="font-medium">{colaborador.name}</TableCell>
                    <TableCell>{colaborador.email}</TableCell>
                    <TableCell>
                      <Badge variant={colaboradorStatusConfig[situacao].variant}>
                        {colaboradorStatusConfig[situacao].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => navigate(`/configuracoes/colaboradores/${colaborador.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
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
