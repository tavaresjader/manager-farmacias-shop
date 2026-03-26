import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import ultramaxLogo from "@/assets/ultramax-logo.png";

interface UltramaxConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UltramaxConfigModal = ({ open, onOpenChange }: UltramaxConfigModalProps) => {
  const handleStartIntegration = () => {
    window.open("https://integrador.farmacias.shop?utm_source=MANAGER&utm_campaign=ULTRAMAX", "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
              <img src={ultramaxLogo} alt="Ultramax" className="w-8 h-auto object-contain" />
            </div>
            <div>
              <DialogTitle>Integrador Ultramax</DialogTitle>
              <DialogDescription>
                Sincronize produtos, estoque e pedidos com o sistema Ultramax.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <p className="text-sm text-muted-foreground">
            Ao iniciar a integração, será enviado uma solicitação de integração à Ultramax e sua loja estará disponível para iniciar a integração de Pedidos, Produtos e estoque automaticamente com a Farmácias Shop.
          </p>

          <Button onClick={handleStartIntegration} className="w-full gap-2">
            <ExternalLink className="w-4 h-4" />
            Iniciar Integração
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
