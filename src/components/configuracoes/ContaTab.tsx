import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { useToast } from "@/hooks/use-toast";

export function ContaTab() {
  const { toast } = useToast();
  const [empresa, setEmpresa] = useState({
    cnpj: "",
    nome: "",
    situacao: "ativo",
  });

  const handleEmpresaChange = (field: string, value: string) => {
    setEmpresa((prev) => ({ ...prev, [field]: value }));
  };

  return (
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
                Esta ação não pode ser desfeita. Todos os seus dados, incluindo pedidos, integrações, colaboradores e outros dados importantes, serão permanentemente removidos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => {
                  toast({
                    title: "Solicitação enviada",
                    description: "Enviamos uma confirmação de exclusão para o seu e-mail de cadastro.",
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
  );
}
