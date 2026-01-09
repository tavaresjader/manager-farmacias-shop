import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  User,
  CreditCard,
  Puzzle,
  Users,
  FileText,
  Receipt,
  Eye,
  EyeOff,
  Copy,
  Plus,
  Trash2,
  Building2,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { UnidadeDetailsModal } from "@/components/configuracoes/UnidadeDetailsModal";
import { BannerDetailsModal } from "@/components/configuracoes/BannerDetailsModal";

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
  situacao: "aberta" | "fechada";
  status: "ativa" | "inativa";
  horarios: HorarioFuncionamento[];
}

const mockUnidades: Unidade[] = [
  {
    id: "1",
    nome: "Matriz",
    endereco: "Av. Paulista, 1000 - São Paulo/SP",
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
    endereco: "Rua XV de Novembro, 500 - Curitiba/PR",
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

const menuItems = [
  { id: "unidades", label: "Unidades", icon: Building2 },
  { id: "banners", label: "Banners", icon: ImageIcon },
  { id: "conta", label: "Minha conta", icon: User },
  { id: "fatura", label: "Minha fatura", icon: CreditCard },
  { id: "integracoes", label: "Integrações", icon: Puzzle },
  { id: "colaboradores", label: "Colaboradores", icon: Users },
];

interface Banner {
  id: string;
  nome: string;
  status: "ativo" | "inativo";
  imagem: string;
  posicao: number;
}

const mockBanners: Banner[] = [
  {
    id: "1",
    nome: "Banner Principal",
    status: "ativo",
    imagem: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=100&h=60&fit=crop",
    posicao: 1,
  },
  {
    id: "2",
    nome: "Promoção de Verão",
    status: "ativo",
    imagem: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=60&fit=crop",
    posicao: 2,
  },
  {
    id: "3",
    nome: "Ofertas Especiais",
    status: "inativo",
    imagem: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=100&h=60&fit=crop",
    posicao: 3,
  },
  {
    id: "4",
    nome: "Novidades",
    status: "ativo",
    imagem: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=60&fit=crop",
    posicao: 4,
  },
];

const mockFaturas = [
  { id: "FAT-001", valor: 1500.0, status: "paga" },
  { id: "FAT-002", valor: 1500.0, status: "a_vencer" },
  { id: "FAT-003", valor: 1200.0, status: "vencida" },
  { id: "FAT-004", valor: 800.0, status: "excluida" },
  { id: "FAT-005", valor: 1500.0, status: "paga" },
];

const mockIntegracoes = [
  {
    id: "1",
    nome: "Matriz",
    clientId: "fd0710a7-e02d-44e1-8372-6df9c7c89ad7",
    clientSecret: "5791f5b2-88ed-424c-a04b-88eb6eb682d1",
    unidade: "Matriz",
  },
  {
    id: "2",
    nome: "Filial Centro",
    clientId: "507bf29c-d2a2-4c72-a957-e32226699d12",
    clientSecret: "2b741469-c65f-4107-9ecc-2355b270b74a",
    unidade: "Filial Centro",
  },
  {
    id: "3",
    nome: "Filial Shopping",
    clientId: "bb58bc68-51dc-480d-971c-c7439a59506c",
    clientSecret: "ac779ab6-4b21-4786-8840-d8a4acfbfa09",
    unidade: "Filial Shopping",
  },
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
  usePageTitle("Configurações");
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("unidades");
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [empresa, setEmpresa] = useState({
    cnpj: "",
    nome: "",
    situacao: "ativo",
  });
  const [selectedUnidade, setSelectedUnidade] = useState<Unidade | null>(null);
  const [unidadeModalOpen, setUnidadeModalOpen] = useState(false);
  const [unidades, setUnidades] = useState<Unidade[]>(mockUnidades);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [banners, setBanners] = useState<Banner[]>(mockBanners);

  const handleUnidadeClick = (unidade: Unidade) => {
    setSelectedUnidade(unidade);
    setUnidadeModalOpen(true);
  };

  const handleSaveUnidade = (updatedUnidade: Unidade) => {
    setUnidades((prev) =>
      prev.map((u) => (u.id === updatedUnidade.id ? updatedUnidade : u))
    );
    setSelectedUnidade(updatedUnidade);
  };

  const handleDeleteUnidade = (unidadeId: string) => {
    setUnidades((prev) => prev.filter((u) => u.id !== unidadeId));
  };

  const handleBannerClick = (banner: Banner) => {
    setSelectedBanner(banner);
    setBannerModalOpen(true);
  };

  const handleSaveBanner = (updatedBanner: Banner) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === updatedBanner.id ? updatedBanner : b))
    );
    setSelectedBanner(updatedBanner);
  };

  const handleDeleteBanner = (bannerId: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== bannerId));
  };

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
        <aside className="w-48 shrink-0 border-r border-border p-4">
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
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
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
          {activeTab === "unidades" && (
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
              
              <UnidadeDetailsModal
                open={unidadeModalOpen}
                onOpenChange={setUnidadeModalOpen}
                unidade={selectedUnidade}
                onSave={handleSaveUnidade}
                onDelete={handleDeleteUnidade}
              />
            </div>
          )}

          {activeTab === "banners" && (
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-foreground">Banners</h2>
                <Button onClick={() => console.log("Adicionar banner")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar banner
                </Button>
              </div>
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Banner</TableHead>
                      <TableHead>Posição</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {banners.map((banner) => (
                      <TableRow 
                        key={banner.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleBannerClick(banner)}
                      >
                        <TableCell className="font-medium">{banner.nome}</TableCell>
                        <TableCell>
                          <Badge variant={banner.status === "ativo" ? "default" : "secondary"}>
                            {banner.status === "ativo" ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <a 
                            href="https://cdn.farmaciashop.com.br/banner.jpg" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <img 
                              src={banner.imagem} 
                              alt={banner.nome}
                              className="w-16 h-10 object-cover rounded border border-border hover:opacity-80 transition-opacity"
                            />
                          </a>
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground font-medium text-sm">
                            {banner.posicao}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBannerClick(banner);
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

              <BannerDetailsModal
                open={bannerModalOpen}
                onOpenChange={setBannerModalOpen}
                banner={selectedBanner}
                onSave={handleSaveBanner}
                onDelete={handleDeleteBanner}
              />
            </div>
          )}

          {activeTab === "conta" && (
            <div className="bg-card border border-border rounded-lg p-6">
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
                  <Select value={empresa.situacao} onValueChange={(value) => handleEmpresaChange("situacao", value)}>
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
                  Ao excluir sua conta, todos os seus dados serão permanentemente removidos e não poderão ser
                  recuperados.
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
                        Esta ação não pode ser desfeita. Todos os seus dados, incluindo faturas, integrações e
                        colaboradores, serão permanentemente removidos.
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
            <div className="bg-card border border-border rounded-lg p-6">
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
            <div className="bg-card border border-border rounded-lg p-6">
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
                      <TableHead>Unidade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockIntegracoes.map((integracao) => (
                      <TableRow key={integracao.id}>
                        <TableCell className="font-medium">{integracao.nome}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded">{integracao.clientId}</code>
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
                              {visibleSecrets[integracao.id] ? integracao.clientSecret : "••••••••••••••••"}
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
                        <TableCell>
                          <span className="font-medium">{integracao.unidade}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {activeTab === "colaboradores" && (
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
                    {mockColaboradores.map((colaborador) => (
                      <TableRow key={colaborador.id}>
                        <TableCell className="font-medium">{colaborador.nome}</TableCell>
                        <TableCell>{colaborador.email}</TableCell>
                        <TableCell>
                          <Badge variant={colaboradorStatusConfig[colaborador.situacao].variant}>
                            {colaboradorStatusConfig[colaborador.situacao].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => console.log("Visualizar colaborador:", colaborador.id)}
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
          )}
        </main>
      </div>
    </MainLayout>
  );
};

export default Configuracoes;
