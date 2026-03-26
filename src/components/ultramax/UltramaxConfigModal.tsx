import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Power } from "lucide-react";
import ultramaxLogo from "@/assets/ultramax-logo.png";

interface UltramaxConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isActive?: boolean;
  onActivate?: () => void;
  onDeactivate?: () => void;
}

export const UltramaxConfigModal = ({
  open,
  onOpenChange,
  isActive = false,
  onActivate,
  onDeactivate,
}: UltramaxConfigModalProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleStartIntegration = () => {
    onActivate?.();
    onOpenChange(false);
    toast.success("Integração Ativa", {
      description: "A integração com a Ultramax foi ativada com sucesso.",
    });
  };

  const handleDeactivate = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmDeactivate = () => {
    onDeactivate?.();
    setShowConfirmDialog(false);
  };

  return (
    <>
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

            {isActive ? (
              <Button
                onClick={handleDeactivate}
                variant="destructive"
                className="w-full gap-2"
              >
                <Power className="w-4 h-4" />
                Inativar Integração
              </Button>
            ) : (
              <Button onClick={handleStartIntegration} className="w-full">
                Ativar Integração
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inativar integração</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja inativar a integração com a Ultramax? A sincronização de produtos, estoque e pedidos será interrompida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDeactivate}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
