import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { User, CreditCard, Puzzle, Users, FileText, Receipt, Eye, EyeOff, Copy, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { id: "conta", label: "Minha conta", icon: User },
  { id: "fatura", label: "Minha fatura", icon: CreditCard },
  { id: "integracoes", label: "Integrações", icon: Puzzle },
  { id: "colaboradores", label: "Colaboradores", icon: Users },
];

const mockFaturas = [
  { id: "FAT-001", valor: 1500.0, status: "paga" },
  { id: "FAT-002", valor: 1500.0, status: "a_vencer" },
  { id: "FAT-003", valor: 1200.0, status: "vencida" },
  { id: "FAT-004", valor: 800.0, status: "excluida" },
  { id: "FAT-005", valor: 1500.0, status: "paga" },
];

const mockIntegracoes = [
  { id: "1", nome: "API WhatsApp", clientId: "wa_12345678", clientSecret: "sk_wa_abcdef123456789" },
  { id: "2", nome: "API SMS", clientId: "sms_87654321", clientSecret: "sk_sms_987654321fedcba" },
  { id: "3", nome: "API Email", clientId: "email_11223344", clientSecret: "sk_email_aabbccdd1122" },
];

const mockColaboradores = [
  { id: "1", nome: "João Silva", email: "joao.silva@empresa.com", situacao: "ativo" },
  { id: "2", nome: "Maria Santos", email: "maria.santos@empresa.com", situacao: "ativo" },
  { id: "3", nome: "Carlos Oliveira", email: "carlos.oliveira@empresa.com", situacao: "inativo" },
  { id: "4", nome: "Ana Costa", email: "ana.costa@empresa.com", situacao: "ativo" },
];

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  paga: { label: "Paga", variant: "default" },
  a_vencer: { label: "A vencer", variant: "secondary" },
  vencida: { label: "Vencida", variant: "destructive" },
  excluida: { label: "Excluída", variant: "outline" },
};

const colaboradorStatusConfig: Record<string, { label: string; variant: "default" | "secondary" }> = {
  ativo: { label: "Ativo", variant: "default" },
  inativo: { label: "Inativo", variant: "secondary" },
};

const Configuracoes = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("conta");
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [empresa, setEmpresa] = useState({
    cnpj: "",
    nome: "",
    situacao: "ativo",
  });

  const toggleSecretVisibility = (id: string) => {
    setVisibleSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: `${label} copiado para a área de transferência`,
    });
  };

  const handleEmpresaChange = (field: string, value: string) => {
    setEmpresa((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <MainLayout>
      <div className="flex h-full">
        {/* Submenu lateral */}
        <aside className="w-48 shrink-0 border-r border-border bg-card p-4">
          <h1 className="text-lg font-semibold text-foreground mb-4">Configurações</h1>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Conteúdo */}
        <main className="flex-1 p-6">
          {activeTab === "conta" && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-6">Dados da empresa</h2>
              <form className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={empresa.cnpj}
                    onChange={(e) => handleEmpresaChange("cnpj", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da empresa</Label>
                  <Input
                    id="nome"
                    placeholder="Nome da empresa"
                    value={empresa.nome}
                    onChange={(e) => handleEmpresaChange("nome", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="situacao">Situação</Label>
                  <Select
                    value={empresa.situacao}
                    onValueChange={(value) => handleEmpresaChange("situacao", value)}
                  >
                    <SelectTrigger id="situacao">
                      <SelectValue placeholder="Selecione a situação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="button" className="mt-4">
                  Salvar alterações
                </Button>
              </form>

              <div className="mt-12 pt-6 border-t border-border">
                <h3 className="text-lg font-semibold text-destructive mb-2">Cuidado</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ao excluir sua conta, todos os seus dados serão permanentemente removidos e não poderão ser recuperados.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir minha conta
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza que deseja excluir sua conta?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Todos os seus dados, incluindo faturas, integrações e colaboradores, serão permanentemente removidos.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => {
                          toast({
                            description: "Conta excluída com sucesso",
                            variant: "destructive",
                          });
                        }}
                      >
                        Excluir conta
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}

          {activeTab === "fatura" && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-6">Minhas faturas</h2>
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nº Fatura</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockFaturas.map((fatura) => (
                      <TableRow key={fatura.id}>
                        <TableCell className="font-medium">{fatura.id}</TableCell>
                        <TableCell>
                          {fatura.valor.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusConfig[fatura.status].variant}>
                            {statusConfig[fatura.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-muted-foreground hover:text-foreground"
                              onClick={() => console.log("Baixar PDF:", fatura.id)}
                            >
                              <FileText className="w-4 h-4 mr-1" />
                              PDF
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 text-muted-foreground hover:text-foreground"
                              onClick={() => console.log("Baixar NF:", fatura.id)}
                            >
                              <Receipt className="w-4 h-4 mr-1" />
                              NF
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === "integracoes" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Integrações</h2>
                <Button onClick={() => console.log("Adicionar integração")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar integração
                </Button>
              </div>
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Client ID</TableHead>
                      <TableHead>Client Secret</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockIntegracoes.map((integracao) => (
                      <TableRow key={integracao.id}>
                        <TableCell className="font-medium">{integracao.nome}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {integracao.clientId}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => copyToClipboard(integracao.clientId, "Client ID")}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {visibleSecrets[integracao.id]
                                ? integracao.clientSecret
                                : "••••••••••••••••"}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => toggleSecretVisibility(integracao.id)}
                            >
                              {visibleSecrets[integracao.id] ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => copyToClipboard(integracao.clientSecret, "Client Secret")}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === "colaboradores" && (
            <div>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </main>
      </div>
    </MainLayout>
  );
};

export default Configuracoes;
