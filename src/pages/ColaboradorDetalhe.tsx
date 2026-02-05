 import { useState } from "react";
 import { useParams, useNavigate } from "react-router-dom";
 import { MainLayout } from "@/components/layout/MainLayout";
 import { PageLoading } from "@/components/layout/PageLoading";
 import { usePageTitle } from "@/hooks/usePageTitle";
 import { usePageLoading } from "@/hooks/usePageLoading";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Checkbox } from "@/components/ui/checkbox";
 import { Badge } from "@/components/ui/badge";
 import { Switch } from "@/components/ui/switch";
 import { ArrowLeft, User, Building2, Save } from "lucide-react";
 
 const mockColaboradores = [
  { id: "1", nome: "João Silva", email: "joao.silva@empresa.com", situacao: "ativo", master: true },
  { id: "2", nome: "Maria Santos", email: "maria.santos@empresa.com", situacao: "ativo", master: false },
  { id: "3", nome: "Carlos Oliveira", email: "carlos.oliveira@empresa.com", situacao: "inativo", master: false },
  { id: "4", nome: "Ana Costa", email: "ana.costa@empresa.com", situacao: "ativo", master: false },
 ];
 
 const mockUnidades = [
   { id: "1", nome: "Unidade Centro", endereco: "Rua Principal, 123" },
   { id: "2", nome: "Unidade Shopping", endereco: "Av. Comercial, 456" },
   { id: "3", nome: "Unidade Bairro Norte", endereco: "Rua Norte, 789" },
   { id: "4", nome: "Unidade Sul", endereco: "Av. Sul, 321" },
 ];
 
 const ColaboradorDetalhe = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   usePageTitle("Editar Colaborador");
   const isLoading = usePageLoading();
 
   const colaborador = mockColaboradores.find((c) => c.id === id);
 
   const [nome, setNome] = useState(colaborador?.nome || "");
   const [email, setEmail] = useState(colaborador?.email || "");
   const [ativo, setAtivo] = useState(colaborador?.situacao === "ativo");
  const [master, setMaster] = useState(colaborador?.master || false);
   const [unidadesSelecionadas, setUnidadesSelecionadas] = useState<string[]>(["1", "2"]);
 
   const handleUnidadeToggle = (unidadeId: string) => {
     setUnidadesSelecionadas((prev) =>
       prev.includes(unidadeId)
         ? prev.filter((id) => id !== unidadeId)
         : [...prev, unidadeId]
     );
   };
 
   const handleSave = () => {
    console.log("Salvando colaborador:", { nome, email, ativo, master, unidadesSelecionadas });
     navigate("/configuracoes?tab=colaboradores");
   };
 
   if (isLoading) {
     return (
       <MainLayout>
         <PageLoading />
       </MainLayout>
     );
   }
 
   if (!colaborador) {
     return (
       <MainLayout>
         <div className="p-6">
           <p className="text-muted-foreground">Colaborador não encontrado.</p>
           <Button variant="outline" onClick={() => navigate("/configuracoes?tab=colaboradores")} className="mt-4">
             <ArrowLeft className="w-4 h-4 mr-2" />
             Voltar
           </Button>
         </div>
       </MainLayout>
     );
   }
 
   return (
     <MainLayout>
       <div className="p-6 max-w-4xl">
         <Button
           variant="ghost"
           onClick={() => navigate("/configuracoes?tab=colaboradores")}
           className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
         >
           <ArrowLeft className="w-4 h-4 mr-2" />
           Voltar para colaboradores
         </Button>
 
         <div className="space-y-6">
           {/* Dados do Colaborador */}
           <Card>
             <CardHeader className="pb-4">
               <CardTitle className="flex items-center gap-2 text-lg">
                 <User className="w-5 h-5" />
                 Dados do Colaborador
               </CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="nome">Nome</Label>
                   <Input
                     id="nome"
                     value={nome}
                     onChange={(e) => setNome(e.target.value)}
                     placeholder="Nome do colaborador"
                     className="bg-white dark:bg-background"
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="email">E-mail</Label>
                   <Input
                     id="email"
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="email@empresa.com"
                     className="bg-white dark:bg-background"
                   />
                 </div>
               </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                 <div className="space-y-0.5">
                   <Label htmlFor="ativo">Situação</Label>
                   <p className="text-sm text-muted-foreground">
                      {ativo ? "Ativo" : "Inativo"}
                   </p>
                 </div>
                 <Switch
                   id="ativo"
                   checked={ativo}
                   onCheckedChange={setAtivo}
                 />
               </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="master">Perfil Master</Label>
                      <p className="text-sm text-muted-foreground">
                        {master ? "Master" : "Padrão"}
                      </p>
                    </div>
                    <Switch
                      id="master"
                      checked={master}
                      onCheckedChange={setMaster}
                    />
                  </div>
                </div>
             </CardContent>
           </Card>
 
           {/* Unidades de Acesso */}
            {!master && (
           <Card>
             <CardHeader className="pb-4">
               <CardTitle className="flex items-center gap-2 text-lg">
                 <Building2 className="w-5 h-5" />
                 Unidades de Acesso
               </CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-sm text-muted-foreground mb-4">
                 Selecione as unidades que este colaborador pode acessar
               </p>
               <div className="space-y-3">
                 {mockUnidades.map((unidade) => (
                   <div
                     key={unidade.id}
                     className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                   >
                     <div className="flex items-center gap-3">
                       <Checkbox
                         id={`unidade-${unidade.id}`}
                         checked={unidadesSelecionadas.includes(unidade.id)}
                         onCheckedChange={() => handleUnidadeToggle(unidade.id)}
                       />
                       <div>
                         <Label
                           htmlFor={`unidade-${unidade.id}`}
                           className="font-medium cursor-pointer"
                         >
                           {unidade.nome}
                         </Label>
                         <p className="text-sm text-muted-foreground">{unidade.endereco}</p>
                       </div>
                     </div>
                     {unidadesSelecionadas.includes(unidade.id) && (
                       <Badge variant="default" className="text-xs">
                         Acesso liberado
                       </Badge>
                     )}
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>
            )}
 
           {/* Botão Salvar */}
           <div className="flex justify-end">
             <Button onClick={handleSave}>
               <Save className="w-4 h-4 mr-2" />
               Salvar alterações
             </Button>
           </div>
         </div>
       </div>
     </MainLayout>
   );
 };
 
 export default ColaboradorDetalhe;