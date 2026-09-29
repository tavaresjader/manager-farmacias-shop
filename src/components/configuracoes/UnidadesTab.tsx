import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { managerBackendBff } from "@/services/ManagerBackendBff";
import { MerchantListApiResponse, Unidade, toUnidadeFromList } from "@/types/merchant";
import { toast } from "sonner";

export function UnidadesTab() {
  const navigate = useNavigate();
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchUnidades = async () => {
      setIsLoading(true);
      const response = await managerBackendBff.get<MerchantListApiResponse[]>("/v1/Merchants");

      if (cancelled) return;

      if (response.data) {
        setUnidades(response.data.map(toUnidadeFromList));
      } else {
        setUnidades([]);
        toast.error(`Erro ao carregar unidades: ${response.error ?? "Tente novamente."}`);
      }

      setIsLoading(false);
    };

    fetchUnidades();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleUnidadeClick = (unidade: Unidade) => {
    navigate(`/configuracoes/unidades/${unidade.id}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Unidades</h2>
        <Button onClick={() => navigate("/configuracoes/unidades/novo")}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar unidade
        </Button>
      </div>
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead>Status</TableHead>
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
            ) : unidades.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhuma unidade encontrada.
                </TableCell>
              </TableRow>
            ) : (
              unidades.map((unidade) => (
                <TableRow
                  key={unidade.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleUnidadeClick(unidade)}
                >
                  <TableCell className="font-medium">{unidade.nome}</TableCell>
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
                      onClick={(event) => {
                        event.stopPropagation();
                        handleUnidadeClick(unidade);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
