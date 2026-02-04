import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Plus, Trash2, FileText, Eye, EyeOff, Settings2 } from "lucide-react";
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
  const [novoConvenio, setNovoConvenio] = useState<Omit<Convenio, "id">>({
    nome: "",
    codigo: "",
    senha: "",
    ativo: true,
  });
  const [editingConvenioId, setEditingConvenioId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [convenioToDelete, setConvenioToDelete] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const handleAddConvenio = () => {
    if (!novoConvenio.nome.trim()) {
      toast({ description: "Informe o nome do convênio", variant: "destructive" });
      return;
    }
    const newConvenio: Convenio = {
      id: Date.now().toString(),
      ...novoConvenio,
    };
    onConveniosChange([...convenios, newConvenio]);
    setNovoConvenio({ nome: "", codigo: "", senha: "", ativo: true });
    toast({ description: "Convênio adicionado" });
  };

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

  const handleDeleteConvenio = (convenioId: string) => {
    setConvenioToDelete(convenioId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteConvenio = () => {
    if (convenioToDelete) {
      onConveniosChange(convenios.filter((c) => c.id !== convenioToDelete));
      toast({ description: "Convênio removido" });
    }
    setDeleteConfirmOpen(false);
    setConvenioToDelete(null);
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
                        {isEditing && editingConvenioId === convenio.id ? (
                          <Input
                            value={convenio.nome}
                            onChange={(e) =>
                              handleUpdateConvenio(convenio.id, "nome", e.target.value)
                            }
                            className="h-8 bg-white dark:bg-background"
                          />
                        ) : (
                          <span
                            className={`${
                              isEditing ? "cursor-pointer hover:text-primary" : ""
                            } ${!convenio.ativo ? "text-muted-foreground" : ""}`}
                            onClick={() => isEditing && setEditingConvenioId(convenio.id)}
                          >
                            {convenio.nome}
                          </span>
                        )}
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
                          <div className="flex items-center gap-1">
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
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteConvenio(convenio.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Formulário para adicionar novo convênio */}
          {isEditing && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <h5 className="text-sm font-medium text-foreground mb-3">
                Adicionar novo convênio
              </h5>
              <div className="grid grid-cols-5 gap-3 items-end">
                <div className="space-y-1">
                  <Label className="text-xs">Nome do convênio</Label>
                  <Input
                    value={novoConvenio.nome}
                    onChange={(e) =>
                      setNovoConvenio({ ...novoConvenio, nome: e.target.value })
                    }
                    placeholder="Ex: Unimed"
                    className="bg-white dark:bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Código</Label>
                  <Input
                    value={novoConvenio.codigo}
                    onChange={(e) =>
                      setNovoConvenio({ ...novoConvenio, codigo: e.target.value })
                    }
                    placeholder="Código"
                    className="bg-white dark:bg-background"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Senha</Label>
                  <Input
                    type="password"
                    value={novoConvenio.senha}
                    onChange={(e) =>
                      setNovoConvenio({ ...novoConvenio, senha: e.target.value })
                    }
                    placeholder="Senha"
                    className="bg-white dark:bg-background"
                  />
                </div>
                <div className="flex items-center gap-2 pb-1">
                  <Switch
                    checked={novoConvenio.ativo}
                    onCheckedChange={(checked) =>
                      setNovoConvenio({ ...novoConvenio, ativo: checked })
                    }
                  />
                  <span className="text-xs text-muted-foreground">
                    {novoConvenio.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <Button onClick={handleAddConvenio} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Alert para excluir convênio */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir convênio</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este convênio? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConvenioToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDeleteConvenio}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
