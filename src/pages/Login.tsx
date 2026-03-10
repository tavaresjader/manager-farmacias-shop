import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logoFarmaciaShop from "@/assets/logo-farmacia-shop.png";
import { useAuth } from "@/contexts/AuthContext";
import { managerBackendBff } from "@/services/ManagerBackendBff";
import { loginSchema, forgotPasswordSchema, type LoginFormData } from "@/lib/validations";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface LocationState {
  from?: {
    pathname: string;
  };
}

const Login = () => {
  usePageTitle("Login");
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthToken } = useAuth();
  
  const from = (location.state as LocationState)?.from?.pathname || "/";
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(isForgotPassword ? forgotPasswordSchema : loginSchema),
    defaultValues: { email: "", senha: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    if (isForgotPassword) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        toast.success("E-mail de recuperação enviado!");
        setIsForgotPassword(false);
      }, 1000);
      return;
    }

    setIsLoading(true);
    try {
      const response = await managerBackendBff.signIn({
        email: data.email,
        password: data.senha,
      });

      if (response.error || !response.data) {
        toast.error(response.error || "Credenciais inválidas");
        return;
      }

      const accessToken = (response.data as any).access_token;
      if (accessToken) {
        sessionStorage.setItem("FarmaciasShopManagerAccessToken", accessToken);
        setAuthToken(accessToken);
        toast.success("Login realizado com sucesso!");
        navigate(from, { replace: true });
      } else {
        toast.error("Token não encontrado na resposta.");
      }
    } catch (error) {
      toast.error("Erro ao realizar login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
            {isForgotPassword ? "Recuperar senha" : "Bem-vindo de volta"}
          </h1>
          <p className="text-muted-foreground">
            {isForgotPassword 
              ? "Digite seu e-mail para receber o link de recuperação" 
              : "Entre na sua conta para continuar"}
          </p>
        </div>

        {/* Form Card */}
        <div className="card-elevated p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      E-mail
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Senha */}
              {!isForgotPassword && (
                <FormField
                  control={form.control}
                  name="senha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-primary" />
                        Senha
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="h-12 pr-12"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Esqueceu a senha */}
              {!isForgotPassword && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    Esqueceu sua senha?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading 
                  ? (isForgotPassword ? "Enviando..." : "Entrando...") 
                  : (isForgotPassword ? "Recuperar senha" : "Entrar")}
              </Button>

              {/* Voltar ao login */}
              {isForgotPassword && (
                <button
                  type="button"
                  onClick={() => setIsForgotPassword(false)}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Voltar ao login
                </button>
              )}
            </form>
          </Form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          {/* Cadastro Link */}
          <p className="text-center text-sm text-muted-foreground">
            Ainda não tem uma conta?{" "}
            <Link to="/cadastro" className="text-primary font-medium hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
