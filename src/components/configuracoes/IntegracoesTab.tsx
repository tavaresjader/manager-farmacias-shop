import { useState } from "react";
import { Plus, Copy, Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const mockIntegracoes = [
  {
    id: "1",
    nome: "Matriz",
    clientId: "fd0710a7-e02d-44e1-8372-6df9c7c89ad7",
    clientSecret: "",
    unidade: "Matriz",
  },
  {
    id: "2",
    nome: "Filial Centro",
    clientId: "507bf29c-d2a2-4c72-a957-e32226699d12",
    clientSecret: "",
    unidade: "Filial Centro",
  },
  {
    id: "3",
    nome: "Filial Shopping",
    clientId: "bb58bc68-51dc-480d-971c-c7439a59506c",
    clientSecret: "",
    unidade: "Filial Shopping",
  },
];

export function IntegracoesTab() {
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [novaIntegracao, setNovaIntegracao] = useState({ nome: "", unidade: "" });

  const unidades = ["Matriz", "Filial Centro", "Filial Shopping"];


  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      description: `${label} copiado para a área de transferência`,
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Integrações</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar integração
        </Button>
      </div>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar integração</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="nome-integracao">Nome da integração</Label>
              <Input
                id="nome-integracao"
                placeholder="Ex: Integração 01"
                value={novaIntegracao.nome}
                onChange={(e) => setNovaIntegracao((prev) => ({ ...prev, nome: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unidade-integracao">Unidade</Label>
              <Select
                value={novaIntegracao.unidade}
                onValueChange={(value) => setNovaIntegracao((prev) => ({ ...prev, unidade: value }))}
              >
                <SelectTrigger id="unidade-integracao">
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {unidades.map((unidade) => (
                    <SelectItem key={unidade} value={unidade}>
                      {unidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                toast({ description: "Integração adicionada com sucesso" });
                setNovaIntegracao({ nome: "", unidade: "" });
                setIsModalOpen(false);
              }}
              disabled={!novaIntegracao.nome || !novaIntegracao.unidade}
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Client ID</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Credencial</TableHead>
              <TableHead className="w-12"></TableHead>
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
                  <span className="font-medium">{integracao.unidade}</span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white dark:bg-background"
                    onClick={() =>
                      toast({
                        description: "Credencial enviada por e-mail com sucesso",
                      })
                    }
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Enviar por e-mail
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteId(integracao.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir integração</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta integração? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                toast({ description: "Integração excluída com sucesso" });
                setDeleteId(null);
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
