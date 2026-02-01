import { useState } from "react";
import { Plus, Eye, EyeOff, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const mockIntegracoes = [
  {
    id: "0",
    nome: "Principal",
    clientId: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    clientSecret: "9876fedc-ba09-8765-4321-0fedcba98765",
    unidade: "Todas as Unidades",
  },
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
  );
}
