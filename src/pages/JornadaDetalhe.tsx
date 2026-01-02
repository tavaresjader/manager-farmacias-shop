import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, GitBranch, Play, Pause, Trash2 } from "lucide-react";

interface JornadaData {
  id: string;
  name: string;
  description: string;
  status: "active" | "draft" | "inactive";
  trigger: "agendamento" | "recorrencia" | "api" | "manual";
  steps: number;
  contacts: number;
  conversions: number;
  createdAt: string;
}

const mockJornadas: Record<string, JornadaData> = {
  "1": {
    id: "1",
    name: "Onboarding Novos Clientes",
    description: "Jornada de boas-vindas para novos clientes",
    status: "active",
    trigger: "api",
    steps: 5,
    contacts: 1234,
    conversions: 456,
    createdAt: "2024-01-15",
  },
  "2": {
    id: "2",
    name: "Recuperação de Carrinho",
    description: "Fluxo para recuperar carrinhos abandonados",
    status: "active",
    trigger: "agendamento",
    steps: 3,
    contacts: 890,
    conversions: 234,
    createdAt: "2024-02-20",
  },
  "3": {
    id: "3",
    name: "Reengajamento",
    description: "Jornada para clientes inativos",
    status: "draft",
    trigger: "recorrencia",
    steps: 4,
    contacts: 0,
    conversions: 0,
    createdAt: "2024-03-10",
  },
  "4": {
    id: "4",
    name: "Pós-Venda",
    description: "Acompanhamento após compra",
    status: "active",
    trigger: "manual",
    steps: 6,
    contacts: 2100,
    conversions: 678,
    createdAt: "2024-01-05",
  },
  "5": {
    id: "5",
    name: "Upsell Premium",
    description: "Ofertas de upgrade para clientes ativos",
    status: "inactive",
    trigger: "recorrencia",
    steps: 4,
    contacts: 450,
    conversions: 89,
    createdAt: "2024-04-18",
  },
};

const JornadaDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === "nova";

  const existingJornada = id && id !== "nova" ? mockJornadas[id] : null;

  const [formData, setFormData] = useState({
    name: existingJornada?.name || "",
    description: existingJornada?.description || "",
    status: existingJornada?.status || "draft",
    trigger: existingJornada?.trigger || "manual",
  });

  const handleSave = () => {
    console.log("Salvando jornada:", formData);
    navigate("/jornadas");
  };

  const triggerLabels: Record<string, string> = {
    agendamento: "Agendamento",
    recorrencia: "Recorrência",
    api: "API",
    manual: "Manual",
  };

  return (
    <MainLayout>
      <PageHeader
        title={isNew ? "Nova Jornada" : formData.name || "Detalhe da Jornada"}
        breadcrumbs={[
          { label: "jornadas", path: "/jornadas" },
          { label: isNew ? "nova" : existingJornada?.name?.toLowerCase() || "detalhe" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate("/jornadas")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário Principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Informações da Jornada
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Jornada</Label>
                <Input
                  id="name"
                  placeholder="Ex: Onboarding de Novos Clientes"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva o objetivo desta jornada..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trigger">Gatilho</Label>
                  <Select
                    value={formData.trigger}
                    onValueChange={(value) =>
                      setFormData({ ...formData, trigger: value as JornadaData["trigger"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o gatilho" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agendamento">Agendamento</SelectItem>
                      <SelectItem value="recorrencia">Recorrência</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value as JornadaData["status"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="inactive">Inativa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>

          {/* Área do Editor de Fluxo (placeholder) */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Editor de Fluxo
            </h2>
            <div className="border-2 border-dashed border-border rounded-lg h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <GitBranch className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Editor de fluxo será implementado aqui</p>
                <p className="text-sm">Arraste e solte os componentes para criar a jornada</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status e Ações */}
          <Card className="p-6">
            <h3 className="text-sm font-medium text-foreground mb-4">Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Estado atual</span>
                <StatusBadge
                  status={formData.status}
                  label={
                    formData.status === "active"
                      ? "Ativa"
                      : formData.status === "draft"
                      ? "Rascunho"
                      : "Inativa"
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Gatilho</span>
                <span className="text-sm font-medium text-foreground">
                  {triggerLabels[formData.trigger]}
                </span>
              </div>
            </div>

            <div className="border-t border-border mt-4 pt-4 space-y-2">
              {formData.status === "active" ? (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setFormData({ ...formData, status: "inactive" })}
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pausar Jornada
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setFormData({ ...formData, status: "active" })}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Ativar Jornada
                </Button>
              )}
              {!isNew && (
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir Jornada
                </Button>
              )}
            </div>
          </Card>

          {/* Estatísticas (apenas para jornadas existentes) */}
          {existingJornada && (
            <Card className="p-6">
              <h3 className="text-sm font-medium text-foreground mb-4">Estatísticas</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Etapas</span>
                  <span className="text-sm font-medium text-foreground">
                    {existingJornada.steps}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Contatos</span>
                  <span className="text-sm font-medium text-primary">
                    {existingJornada.contacts.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Conversões</span>
                  <span className="text-sm font-medium text-success">
                    {existingJornada.conversions.toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Criada em</span>
                  <span className="text-sm text-foreground">
                    {new Date(existingJornada.createdAt).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default JornadaDetalhe;
