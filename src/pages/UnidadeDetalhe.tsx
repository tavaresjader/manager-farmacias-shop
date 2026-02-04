import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageLoading } from "@/hooks/usePageLoading";
import { PageLoading } from "@/components/layout/PageLoading";
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

// Mock data - em produção virá da API
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

export default function UnidadeDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isLoading = usePageLoading();
  
  const [unidade, setUnidade] = useState<Unidade | null>(null);
  const [editedUnidade, setEditedUnidade] = useState<Unidade | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  usePageTitle(unidade ? `Unidade - ${unidade.nome}` : "Unidade");

  useEffect(() => {
    // Simula busca da unidade - em produção virá da API
    const found = mockUnidades.find((u) => u.id === id);
    if (found) {
      setUnidade(found);
      setEditedUnidade({ ...found, horarios: found.horarios.map((h) => ({ ...h })) });
    }
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout>
        <PageLoading />
      </MainLayout>
    );
  }

  if (!unidade || !editedUnidade) {
    return (
      <MainLayout>
        <PageHeader
          title="Unidade não encontrada"
          breadcrumbs={[
            { label: "Configurações", path: "/configuracoes" },
            { label: "Unidades" },
          ]}
        />
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground">A unidade solicitada não foi encontrada.</p>
          <Button className="mt-4" onClick={() => navigate("/configuracoes")}>
            Voltar para Configurações
          </Button>
        </div>
      </MainLayout>
    );
  }

  const handleSave = () => {
    setUnidade(editedUnidade);
    toast({
      description: "Unidade atualizada com sucesso",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUnidade({ ...unidade, horarios: unidade.horarios.map((h) => ({ ...h })) });
    setIsEditing(false);
  };

  const handleDelete = () => {
    toast({
      description: "Unidade excluída com sucesso",
      variant: "destructive",
    });
    setDeleteConfirmOpen(false);
    navigate("/configuracoes");
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
    <MainLayout>
      <PageHeader
        title={editedUnidade.nome}
        breadcrumbs={[
          { label: "Configurações", path: "/configuracoes" },
          { label: "Unidades", path: "/configuracoes" },
          { label: editedUnidade.nome },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant={editedUnidade.situacao === "aberta" ? "default" : "secondary"}>
              {editedUnidade.situacao === "aberta" ? "Aberta" : "Fechada"}
            </Badge>
            <Badge variant={editedUnidade.status === "ativa" ? "default" : "secondary"}>
              {editedUnidade.status === "ativa" ? "Ativa" : "Inativa"}
            </Badge>
          </div>
        }
      />

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-6">
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

          {/* Nome */}
          {isEditing && (
            <div className="space-y-2">
              <Label>Nome da unidade</Label>
              <Input
                value={editedUnidade.nome}
                onChange={(e) =>
                  setEditedUnidade({ ...editedUnidade, nome: e.target.value })
                }
              />
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
                  <div className="space-y-1">
                    <Label className="text-xs">Logradouro</Label>
                    <Input
                      value={editedUnidade.endereco}
                      readOnly
                      className="bg-muted cursor-not-allowed"
                    />
                  </div>
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

        {/* Footer Actions */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button variant="destructive" onClick={() => setDeleteConfirmOpen(true)}>
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
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>
      </div>

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
    </MainLayout>
  );
}
