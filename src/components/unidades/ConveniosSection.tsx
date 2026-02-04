import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileText, Eye, EyeOff, Settings2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface Convenio {
  id: string;
  nome: string;
  codigo: string;
  senha: string;
  ativo: boolean;
}

interface ConveniosSectionProps {
  convenios: Convenio[];
  isEditing: boolean;
  onConveniosChange: (convenios: Convenio[]) => void;
}

export function ConveniosSection({
  convenios,
  isEditing,
  onConveniosChange,
}: ConveniosSectionProps) {
  const { toast } = useToast();
  const [editingConvenioId, setEditingConvenioId] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const handleUpdateConvenio = (
    convenioId: string,
    field: keyof Omit<Convenio, "id">,
    value: string | boolean
  ) => {
    onConveniosChange(
      convenios.map((c) =>
        c.id === convenioId ? { ...c, [field]: value } : c
      )
    );
  };

  const handleToggleConvenio = (convenioId: string, ativo: boolean) => {
    handleUpdateConvenio(convenioId, "ativo", ativo);
    toast({
      description: ativo ? "Convênio habilitado" : "Convênio desabilitado",
    });
  };


  const togglePasswordVisibility = (convenioId: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [convenioId]: !prev[convenioId],
    }));
  };

  return (
    <>
      <div className="flex items-start gap-3">
        <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-foreground mb-3">Convênios</h4>

          {/* Tabela de convênios */}
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Status</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Senha</TableHead>
                  {isEditing && <TableHead className="w-[80px]">Ações</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {convenios.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={isEditing ? 5 : 4}
                      className="text-center text-muted-foreground py-4"
                    >
                      Nenhum convênio cadastrado
                    </TableCell>
                  </TableRow>
                ) : (
                  convenios.map((convenio) => (
                    <TableRow key={convenio.id}>
                      <TableCell>
                        <Switch
                          checked={convenio.ativo}
                          onCheckedChange={(checked) =>
                            handleToggleConvenio(convenio.id, checked)
                          }
                          disabled={!isEditing}
                        />
                      </TableCell>
                      <TableCell>
                        <span
                          className={!convenio.ativo ? "text-muted-foreground" : ""}
                        >
                          {convenio.nome}
                        </span>
                      </TableCell>
                      <TableCell>
                        {isEditing && editingConvenioId === convenio.id ? (
                          <Input
                            value={convenio.codigo}
                            onChange={(e) =>
                              handleUpdateConvenio(convenio.id, "codigo", e.target.value)
                            }
                            className="h-8 w-32 bg-white dark:bg-background"
                            placeholder="Código"
                          />
                        ) : (
                          <span
                            className={`${
                              isEditing ? "cursor-pointer hover:text-primary" : ""
                            } ${!convenio.ativo ? "text-muted-foreground" : ""}`}
                            onClick={() => isEditing && setEditingConvenioId(convenio.id)}
                          >
                            {convenio.codigo || "-"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing && editingConvenioId === convenio.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type={showPasswords[convenio.id] ? "text" : "password"}
                              value={convenio.senha}
                              onChange={(e) =>
                                handleUpdateConvenio(convenio.id, "senha", e.target.value)
                              }
                              className="h-8 w-32 bg-white dark:bg-background"
                              placeholder="Senha"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => togglePasswordVisibility(convenio.id)}
                            >
                              {showPasswords[convenio.id] ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span
                              className={`${
                                isEditing ? "cursor-pointer hover:text-primary" : ""
                              } ${!convenio.ativo ? "text-muted-foreground" : ""}`}
                              onClick={() => isEditing && setEditingConvenioId(convenio.id)}
                            >
                              {convenio.senha ? "••••••••" : "-"}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      {isEditing && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              setEditingConvenioId(
                                editingConvenioId === convenio.id ? null : convenio.id
                              )
                            }
                          >
                            <Settings2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

        </div>
      </div>

    </> 
  );
}
