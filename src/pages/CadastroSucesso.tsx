import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";
import { CheckCircle, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import logoFarmaciaShop from "@/assets/logo-farmacia-shop.png";

const CadastroSucesso = () => {
  usePageTitle("Loja Criada");
  const navigate = useNavigate();
  const location = useLocation();
  const storeUrl = (location.state as { storeUrl?: string })?.storeUrl || "";
  const nomeFarmacia = (location.state as { nomeFarmacia?: string })?.nomeFarmacia || "";

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(storeUrl);
    toast.success("URL copiada para a área de transferência!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src={logoFarmaciaShop}
              alt="Farmácia Shop"
              className="w-16 h-16 rounded-xl"
            />
          </div>
        </div>

        <div className="card-elevated p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>

          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
              Parabéns! 🎉
            </h1>
            <p className="text-muted-foreground">
              Sua loja {nomeFarmacia && <strong>{nomeFarmacia}</strong>} foi criada com sucesso!
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Sua loja está disponível em:</p>
            <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
              <span className="flex-1 text-sm font-medium text-primary truncate">
                {storeUrl}
              </span>
              <Button variant="ghost" size="icon" onClick={handleCopyUrl}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href={storeUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>

          <Button
            onClick={() => navigate("/")}
            className="w-full h-12 text-base font-semibold"
          >
            Começar a Gerenciar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CadastroSucesso;
