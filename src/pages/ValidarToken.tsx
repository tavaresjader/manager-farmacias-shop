import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import logoFarmaciaShop from "@/assets/logo-farmacia-shop.png";

const ValidarToken = () => {
  usePageTitle("Validar Token");
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || "";

  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleValidate = async () => {
    if (token.length < 6) {
      toast.error("Por favor, insira o código completo.");
      return;
    }

    setIsLoading(true);
    // Simula validação do token
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);

    toast.success("E-mail verificado com sucesso!");
    navigate("/login");
  };

  const handleResend = async () => {
    toast.success("Um novo código foi enviado para o seu e-mail.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img
              src={logoFarmaciaShop}
              alt="Farmácia Shop"
              className="w-16 h-16 rounded-xl"
            />
          </div>
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
            Verifique seu e-mail
          </h1>
          <p className="text-muted-foreground text-sm">
            Enviamos um código de 6 dígitos para
          </p>
          {email && (
            <p className="text-foreground font-medium text-sm mt-1">{email}</p>
          )}
        </div>

        {/* Token Input */}
        <div className="card-elevated p-8 space-y-6">
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={token} onChange={setToken}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={handleValidate}
            className="w-full h-12 text-base font-semibold"
            disabled={token.length < 6 || isLoading}
          >
            {isLoading ? "Validando..." : "Validar Código"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Não recebeu o código?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="text-primary font-medium hover:underline"
            >
              Reenviar
            </button>
          </p>
        </div>

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/cadastro")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-4 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao cadastro
        </button>
      </div>
    </div>
  );
};

export default ValidarToken;
