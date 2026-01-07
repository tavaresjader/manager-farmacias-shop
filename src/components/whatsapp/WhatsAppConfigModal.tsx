import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const defaultMessage = `Olá! 👋

Obrigado por entrar em contato conosco!

Estamos verificando sua mensagem e retornaremos o mais breve possível.

Enquanto isso, você pode:
📦 Compre online ou acompanhe seus pedidos pelo nosso site: https://demo.farmaciashop.com.br
📞 Ligar para (11) 1234-5678 das 7h as 22h

Atenciosamente,
Equipe de Atendimento`;

interface WhatsAppConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WhatsAppConfigModal = ({ open, onOpenChange }: WhatsAppConfigModalProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState(defaultMessage);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast({
        title: "Mensagem copiada!",
        description: "A mensagem foi copiada para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar a mensagem.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="text-center sm:text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[#25D366] flex items-center justify-center">
              <MessageCircle className="w-9 h-9 text-white" />
            </div>
          </div>
          <DialogTitle className="text-xl">Configurar Resposta Automática do WhatsApp</DialogTitle>
          <DialogDescription className="text-left mt-4">
            Para configurar uma mensagem automática de resposta no WhatsApp Business:
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>
              Abra o <strong>WhatsApp Business</strong> no seu celular
            </li>
            <li>
              Acesse <strong>Configurações</strong> → <strong>Ferramentas comerciais</strong>
            </li>
            <li>
              Toque em <strong>Mensagem de ausência</strong>
            </li>
            <li>
              Ative a opção <strong>Enviar mensagem de ausência</strong>
            </li>
            <li>Cole a mensagem abaixo no campo de texto</li>
            <li>
              Configure os <strong>horários</strong> e <strong>destinatários</strong>
            </li>
          </ol>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mensagem sugerida:</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[180px] resize-none text-sm"
            />
          </div>

          <Button onClick={handleCopy} className="w-full gap-2" variant={copied ? "outline" : "default"}>
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar mensagem
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
