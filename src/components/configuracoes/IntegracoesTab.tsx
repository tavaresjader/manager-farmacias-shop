import { useState } from "react";
import { Plus, Eye, EyeOff, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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

export function IntegracoesTab() {
  const { toast } = useToast();
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novaIntegracao, setNovaIntegracao] = useState({ nome: "", unidade: "" });

  const unidades = ["Matriz", "Filial Centro", "Filial Shopping"];
  const toggleSecretVisibility = (id: string) => {
    setVisibleSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
  );
}
