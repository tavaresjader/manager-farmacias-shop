import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Clock, Pencil, Trash2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HorarioFuncionamento {
  dia: string;
  aberto: boolean;
  abertura?: string;
  fechamento?: string;
}

interface Unidade {
  id: string;
  nome: string;
  endereco: string;
  numero: string;
  cep: string;
  situacao: "aberta" | "fechada";
  status: "ativa" | "inativa";
  horarios: HorarioFuncionamento[];
}

interface UnidadeDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unidade: Unidade | null;
  onSave?: (unidade: Unidade) => void;
  onDelete?: (unidadeId: string) => void;
}

export function UnidadeDetailsModal({
  open,
  onOpenChange,
  unidade,
  onSave,
  onDelete,
}: UnidadeDetailsModalProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUnidade, setEditedUnidade] = useState<Unidade | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (unidade) {
      setEditedUnidade({ ...unidade, horarios: unidade.horarios.map(h => ({ ...h })) });
    }
    setIsEditing(false);
  }, [unidade]);

  if (!unidade || !editedUnidade) return null;

  const handleSave = () => {
    if (onSave) {
      onSave(editedUnidade);
    }
    toast({
      description: "Unidade atualizada com sucesso",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUnidade({ ...unidade, horarios: unidade.horarios.map(h => ({ ...h })) });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(unidade.id);
    }
    toast({
      description: "Unidade excluída com sucesso",
      variant: "destructive",
    });
    setDeleteConfirmOpen(false);
    onOpenChange(false);
  };

  const handleHorarioChange = (
    index: number,
    field: keyof HorarioFuncionamento,
    value: string | boolean
  ) => {
    const newHorarios = [...editedUnidade.horarios];
    newHorarios[index] = { ...newHorarios[index], [field]: value };
    setEditedUnidade({ ...editedUnidade, horarios: newHorarios });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {isEditing ? (
                <Input
                  value={editedUnidade.nome}
                  onChange={(e) =>
                    setEditedUnidade({ ...editedUnidade, nome: e.target.value })
                  }
                  className="h-8 w-48"
                />
              ) : (
                <span>{editedUnidade.nome}</span>
              )}
              <Badge variant={editedUnidade.situacao === "aberta" ? "default" : "secondary"}>
                {editedUnidade.situacao === "aberta" ? "Aberta" : "Fechada"}
              </Badge>
              <Badge variant={editedUnidade.status === "ativa" ? "default" : "secondary"}>
                {editedUnidade.status === "ativa" ? "Ativa" : "Inativa"}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Status e Situação */}
            {isEditing && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Situação</Label>
                  <Select
                    value={editedUnidade.situacao}
                    onValueChange={(value: "aberta" | "fechada") =>
                      setEditedUnidade({ ...editedUnidade, situacao: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aberta">Aberta</SelectItem>
                      <SelectItem value="fechada">Fechada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editedUnidade.status}
                    onValueChange={(value: "ativa" | "inativa") =>
                      setEditedUnidade({ ...editedUnidade, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativa">Ativa</SelectItem>
                      <SelectItem value="inativa">Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Endereço */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground">Endereço</h4>
                {isEditing ? (
                  <div className="space-y-3 mt-1">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">CEP</Label>
                        <Input
                          value={editedUnidade.cep}
                          onChange={(e) =>
                            setEditedUnidade({ ...editedUnidade, cep: e.target.value })
                          }
                          placeholder="00000-000"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Número</Label>
                        <Input
                          value={editedUnidade.numero}
                          onChange={(e) =>
                            setEditedUnidade({ ...editedUnidade, numero: e.target.value })
                          }
                          placeholder="123"
                        />
                      </div>
                    </div>
                    <Input
                      value={editedUnidade.endereco}
                      onChange={(e) =>
                        setEditedUnidade({ ...editedUnidade, endereco: e.target.value })
                      }
                      placeholder="Rua, Avenida..."
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">CEP: {editedUnidade.cep}</p>
                    <p className="text-sm text-muted-foreground">
                      {editedUnidade.endereco}, {editedUnidade.numero}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Horários de funcionamento */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground mb-3">
                  Horários de funcionamento
                </h4>
                <div className="space-y-2">
                  {editedUnidade.horarios.map((horario, index) => (
                    <div
                      key={horario.dia}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0 gap-4"
                    >
                      <span className="text-sm font-medium text-foreground min-w-[120px]">
                        {horario.dia}
                      </span>
                      {isEditing ? (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={horario.aberto}
                              onCheckedChange={(checked) =>
                                handleHorarioChange(index, "aberto", checked)
                              }
                            />
                            <span className="text-xs text-muted-foreground">
                              {horario.aberto ? "Aberto" : "Fechado"}
                            </span>
                          </div>
                          {horario.aberto && (
                            <div className="flex items-center gap-2">
                              <Input
                                type="time"
                                value={horario.abertura || ""}
                                onChange={(e) =>
                                  handleHorarioChange(index, "abertura", e.target.value)
                                }
                                className="h-8 w-24"
                              />
                              <span className="text-muted-foreground">-</span>
                              <Input
                                type="time"
                                value={horario.fechamento || ""}
                                onChange={(e) =>
                                  handleHorarioChange(index, "fechamento", e.target.value)
                                }
                                className="h-8 w-24"
                              />
                            </div>
                          )}
                        </div>
                      ) : horario.aberto ? (
                        <span className="text-sm text-muted-foreground">
                          {horario.abertura} - {horario.fechamento}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Fechado</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="destructive"
              onClick={() => setDeleteConfirmOpen(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button onClick={() => onOpenChange(false)}>
                    Fechar
                  </Button>
                </>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir unidade</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a unidade "{unidade.nome}"? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
