import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ReCAPTCHA from "react-google-recaptcha";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Store, CheckCircle, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import logoFarmaciaShop from "@/assets/logo-farmacia-shop.png";
import { registrationSchema, type RegistrationFormData } from "@/lib/validations";
import { useState } from "react";

// Chave de teste do Google reCAPTCHA (substituir em produção)
const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";

const Cadastro = () => {
  usePageTitle("Cadastro");
  const navigate = useNavigate();
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [storeUrl, setStoreUrl] = useState("");

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      nomeFarmacia: "",
      cnpj: "",
      nomeResponsavel: "",
      emailResponsavel: "",
      telefoneResponsavel: "",
      senha: "",
      confirmarSenha: "",
    },
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const onSubmit = (data: RegistrationFormData) => {
    if (!captchaValue) {
      toast.error("Por favor, confirme que você não é um robô.");
      return;
    }

    const slug = generateSlug(data.nomeFarmacia);
    const url = `https://${slug}.farmacias.shop`;
    setStoreUrl(url);
    setShowSuccessModal(true);
  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(storeUrl);
    toast.success("URL copiada para a área de transferência!");
  };

  const handleGoToDashboard = () => {
    setShowSuccessModal(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
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
            Crie sua farmácia online
          </h1>
          <p className="text-muted-foreground">
            Preencha os dados abaixo para começar a vender online
          </p>
        </div>

        {/* Form Card */}
        <div className="card-elevated p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Nome da Farmácia */}
              <FormField
                control={form.control}
                name="nomeFarmacia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-primary" />
                      Nome da Farmácia *
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Farmácia Saúde Total" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* CNPJ */}
              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ *</FormLabel>
                    <FormControl>
                      <Input placeholder="00.000.000/0000-00" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nome do Responsável */}
              <FormField
                control={form.control}
                name="nomeResponsavel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Responsável *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo do responsável" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* E-mail do Responsável */}
              <FormField
                control={form.control}
                name="emailResponsavel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail do Responsável *</FormLabel>
                    <FormControl>
                      <Input placeholder="email@exemplo.com" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Telefone do Responsável */}
              <FormField
                control={form.control}
                name="telefoneResponsavel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone do Responsável *</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Senha */}
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha *</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Mínimo 8 caracteres" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirmar Senha */}
              <FormField
                control={form.control}
                name="confirmarSenha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha *</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Digite a senha novamente" className="h-12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* reCAPTCHA */}
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={handleCaptchaChange}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full h-12 text-base font-semibold">
                Começar Agora
              </Button>
            </form>
          </Form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Fazer login
          </Link>
        </p>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Ao criar sua loja, você concorda com nossos{" "}
          <a href="https://farmacias.shop/termos" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Termos de Uso</a>
          {" "}e{" "}
          <a href="https://farmacias.shop/privacidade" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Política de Privacidade</a>
        </p>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="max-w-md text-center">
          <DialogHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <DialogTitle className="text-2xl">
              Parabéns! 🎉
            </DialogTitle>
            <DialogDescription className="text-base">
              Sua loja <strong>{form.getValues("nomeFarmacia")}</strong> foi criada com sucesso!
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
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

          <DialogFooter>
            <Button onClick={handleGoToDashboard} className="w-full">
              Ir para o Painel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cadastro;
