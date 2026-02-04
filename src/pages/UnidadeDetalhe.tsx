import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
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
import { MapPin, Clock, Pencil, Trash2, Save, X, Building2, Truck, Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConveniosSection, Convenio } from "@/components/unidades/ConveniosSection";

interface HorarioFuncionamento {
  dia: string;
  aberto: boolean;
  abertura?: string;
  fechamento?: string;
}

interface AreaEntrega {
  id: string;
  raio: number;
  compraMinima: number;
  preco: number;
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
  areasEntrega: AreaEntrega[];
  convenios: Convenio[];
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
    areasEntrega: [
      { id: "1", raio: 3, compraMinima: 30, preco: 5 },
      { id: "2", raio: 5, compraMinima: 50, preco: 8 },
      { id: "3", raio: 10, compraMinima: 80, preco: 12 },
    ],
    convenios: [
      { id: "1", nome: "Unimed", codigo: "UNI001", senha: "senha123", ativo: true },
      { id: "2", nome: "Bradesco Saúde", codigo: "BRA002", senha: "brad456", ativo: true },
      { id: "3", nome: "SulAmérica", codigo: "SUL003", senha: "", ativo: false },
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
    areasEntrega: [
      { id: "1", raio: 2, compraMinima: 25, preco: 4 },
      { id: "2", raio: 5, compraMinima: 40, preco: 7 },
    ],
    convenios: [],
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
    areasEntrega: [],
    convenios: [],
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
  
  // Estados para área de entrega
  const [novaArea, setNovaArea] = useState<Omit<AreaEntrega, "id">>({
    raio: 0,
    compraMinima: 0,
    preco: 0,
  });
  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  const [deleteAreaConfirmOpen, setDeleteAreaConfirmOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<string | null>(null);

  usePageTitle(unidade ? `Unidade - ${unidade.nome}` : "Unidade");

  useEffect(() => {
    // Simula busca da unidade - em produção virá da API
    const found = mockUnidades.find((u) => u.id === id);
    if (found) {
      setUnidade(found);
      setEditedUnidade({
        ...found,
        horarios: found.horarios.map((h) => ({ ...h })),
        areasEntrega: found.areasEntrega.map((a) => ({ ...a })),
        convenios: found.convenios.map((c) => ({ ...c })),
      });
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
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Unidade não encontrada
          </h1>
        </div>
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
    setEditedUnidade({
      ...unidade,
      horarios: unidade.horarios.map((h) => ({ ...h })),
      areasEntrega: unidade.areasEntrega.map((a) => ({ ...a })),
      convenios: unidade.convenios.map((c) => ({ ...c })),
    });
    setIsEditing(false);
    setEditingAreaId(null);
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

  // Handlers para áreas de entrega
  const handleAddArea = () => {
    if (novaArea.raio <= 0) {
      toast({ description: "Informe um raio válido", variant: "destructive" });
      return;
    }
    const newArea: AreaEntrega = {
      id: Date.now().toString(),
      ...novaArea,
    };
    setEditedUnidade({
      ...editedUnidade,
      areasEntrega: [...editedUnidade.areasEntrega, newArea],
    });
    setNovaArea({ raio: 0, compraMinima: 0, preco: 0 });
    toast({ description: "Área de entrega adicionada" });
  };

  const handleUpdateArea = (areaId: string, field: keyof Omit<AreaEntrega, "id">, value: number) => {
    setEditedUnidade({
      ...editedUnidade,
      areasEntrega: editedUnidade.areasEntrega.map((a) =>
        a.id === areaId ? { ...a, [field]: value } : a
      ),
    });
  };

  const handleDeleteArea = (areaId: string) => {
    setAreaToDelete(areaId);
    setDeleteAreaConfirmOpen(true);
  };

  const confirmDeleteArea = () => {
    if (areaToDelete) {
      setEditedUnidade({
        ...editedUnidade,
        areasEntrega: editedUnidade.areasEntrega.filter((a) => a.id !== areaToDelete),
      });
      toast({ description: "Área de entrega removida" });
    }
    setDeleteAreaConfirmOpen(false);
    setAreaToDelete(null);
  };

  return (
    <MainLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          {editedUnidade.nome}
        </h1>
        <div className="flex items-center gap-2">
          <Badge variant={editedUnidade.situacao === "aberta" ? "default" : "secondary"}>
            {editedUnidade.situacao === "aberta" ? "Aberta" : "Fechada"}
          </Badge>
          <Badge variant={editedUnidade.status === "ativa" ? "default" : "secondary"}>
            {editedUnidade.status === "ativa" ? "Ativa" : "Inativa"}
          </Badge>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-6">
          {/* Detalhes da unidade */}
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground">Detalhes da unidade</h4>
              {isEditing ? (
                <div className="space-y-3 mt-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Nome da unidade</Label>
                    <Input
                      value={editedUnidade.nome}
                      onChange={(e) =>
                        setEditedUnidade({ ...editedUnidade, nome: e.target.value })
                      }
                      className="bg-white dark:bg-background"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Situação</Label>
                      <Select
                        value={editedUnidade.situacao}
                        onValueChange={(value: "aberta" | "fechada") =>
                          setEditedUnidade({ ...editedUnidade, situacao: value })
                        }
                      >
                        <SelectTrigger className="bg-white dark:bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aberta">Aberta</SelectItem>
                          <SelectItem value="fechada">Fechada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Status</Label>
                      <Select
                        value={editedUnidade.status}
                        onValueChange={(value: "ativa" | "inativa") =>
                          setEditedUnidade({ ...editedUnidade, status: value })
                        }
                      >
                        <SelectTrigger className="bg-white dark:bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ativa">Ativa</SelectItem>
                          <SelectItem value="inativa">Inativa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 mt-1">
                  <p className="text-sm text-muted-foreground">
                    Situação: {editedUnidade.situacao === "aberta" ? "Aberta" : "Fechada"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status: {editedUnidade.status === "ativa" ? "Ativa" : "Inativa"}
                  </p>
                </div>
              )}
            </div>
          </div>

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
                        className="bg-white dark:bg-background"
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
                        className="bg-white dark:bg-background"
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
                              className="h-8 w-24 bg-white dark:bg-background"
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                              type="time"
                              value={horario.fechamento || ""}
                              onChange={(e) =>
                                handleHorarioChange(index, "fechamento", e.target.value)
                              }
                              className="h-8 w-24 bg-white dark:bg-background"
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

          {/* Entrega */}
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground mb-3">Entrega</h4>
              
              {/* Tabela de áreas de entrega */}
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Raio (km)</TableHead>
                      <TableHead>Compra Mínima</TableHead>
                      <TableHead>Preço da Entrega</TableHead>
                      {isEditing && <TableHead className="w-[80px]">Ações</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editedUnidade.areasEntrega.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isEditing ? 4 : 3} className="text-center text-muted-foreground py-4">
                          Nenhuma área de entrega cadastrada
                        </TableCell>
                      </TableRow>
                    ) : (
                      editedUnidade.areasEntrega.map((area) => (
                        <TableRow key={area.id}>
                          <TableCell>
                            {isEditing && editingAreaId === area.id ? (
                              <Input
                                type="number"
                                value={area.raio}
                                onChange={(e) => handleUpdateArea(area.id, "raio", Number(e.target.value))}
                                className="h-8 w-20 bg-white dark:bg-background"
                                min={0}
                              />
                            ) : (
                              <span 
                                className={isEditing ? "cursor-pointer hover:text-primary" : ""}
                                onClick={() => isEditing && setEditingAreaId(area.id)}
                              >
                                {area.raio} km
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing && editingAreaId === area.id ? (
                              <Input
                                type="number"
                                value={area.compraMinima}
                                onChange={(e) => handleUpdateArea(area.id, "compraMinima", Number(e.target.value))}
                                className="h-8 w-24 bg-white dark:bg-background"
                                min={0}
                                step={0.01}
                              />
                            ) : (
                              <span 
                                className={isEditing ? "cursor-pointer hover:text-primary" : ""}
                                onClick={() => isEditing && setEditingAreaId(area.id)}
                              >
                                R$ {area.compraMinima.toFixed(2)}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditing && editingAreaId === area.id ? (
                              <Input
                                type="number"
                                value={area.preco}
                                onChange={(e) => handleUpdateArea(area.id, "preco", Number(e.target.value))}
                                className="h-8 w-24 bg-white dark:bg-background"
                                min={0}
                                step={0.01}
                              />
                            ) : (
                              <span 
                                className={isEditing ? "cursor-pointer hover:text-primary" : ""}
                                onClick={() => isEditing && setEditingAreaId(area.id)}
                              >
                                R$ {area.preco.toFixed(2)}
                              </span>
                            )}
                          </TableCell>
                          {isEditing && (
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteArea(area.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Formulário para adicionar nova área */}
              {isEditing && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h5 className="text-sm font-medium text-foreground mb-3">Adicionar nova área</h5>
                  <div className="grid grid-cols-4 gap-3 items-end">
                    <div className="space-y-1">
                      <Label className="text-xs">Raio (km)</Label>
                      <Input
                        type="number"
                        value={novaArea.raio || ""}
                        onChange={(e) => setNovaArea({ ...novaArea, raio: Number(e.target.value) })}
                        placeholder="0"
                        min={0}
                        className="bg-white dark:bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Compra Mínima (R$)</Label>
                      <Input
                        type="number"
                        value={novaArea.compraMinima || ""}
                        onChange={(e) => setNovaArea({ ...novaArea, compraMinima: Number(e.target.value) })}
                        placeholder="0,00"
                        min={0}
                        step={0.01}
                        className="bg-white dark:bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Preço da Entrega (R$)</Label>
                      <Input
                        type="number"
                        value={novaArea.preco || ""}
                        onChange={(e) => setNovaArea({ ...novaArea, preco: Number(e.target.value) })}
                        placeholder="0,00"
                        min={0}
                        step={0.01}
                        className="bg-white dark:bg-background"
                      />
                    </div>
                    <Button onClick={handleAddArea} size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Convênios */}
          <ConveniosSection
            convenios={editedUnidade.convenios}
            isEditing={isEditing}
            onConveniosChange={(convenios) =>
              setEditedUnidade({ ...editedUnidade, convenios })
            }
          />
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
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" onClick={() => navigate("/configuracoes")}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </>
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

      {/* Alert para excluir área de entrega */}
      <AlertDialog open={deleteAreaConfirmOpen} onOpenChange={setDeleteAreaConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir área de entrega</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta área de entrega? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAreaToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDeleteArea}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
