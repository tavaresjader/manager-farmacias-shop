import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Store, CheckCircle, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import logoFarmaciaShop from "@/assets/logo-farmacia-shop.png";

const Cadastro = () => {
  usePageTitle("Cadastro");
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nomeFarmacia: "",
    cnpj: "",
    nomeResponsavel: "",
    telefoneResponsavel: "",
    senha: "",
    confirmarSenha: "",
  });
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [storeUrl, setStoreUrl] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nomeFarmacia || !formData.cnpj || !formData.nomeResponsavel || !formData.telefoneResponsavel || !formData.senha || !formData.confirmarSenha) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    if (formData.senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const slug = generateSlug(formData.nomeFarmacia);
    const url = `https://${slug}.farmacia.shop`;
    setStoreUrl(url);
    setShowSuccessModal(true);
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome da Farmácia */}
            <div className="space-y-2">
              <Label htmlFor="nomeFarmacia" className="flex items-center gap-2">
                <Store className="w-4 h-4 text-primary" />
                Nome da Farmácia *
              </Label>
              <Input
                id="nomeFarmacia"
                name="nomeFarmacia"
                placeholder="Ex: Farmácia Saúde Total"
                value={formData.nomeFarmacia}
                onChange={handleInputChange}
                className="h-12"
              />
            </div>

            {/* CNPJ */}
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <Input
                id="cnpj"
                name="cnpj"
                placeholder="00.000.000/0000-00"
                value={formData.cnpj}
                onChange={handleInputChange}
                className="h-12"
              />
            </div>

            {/* Nome do Responsável */}
            <div className="space-y-2">
              <Label htmlFor="nomeResponsavel">Nome do Responsável *</Label>
              <Input
                id="nomeResponsavel"
                name="nomeResponsavel"
                placeholder="Nome completo do responsável"
                value={formData.nomeResponsavel}
                onChange={handleInputChange}
                className="h-12"
              />
            </div>

            {/* Telefone do Responsável */}
            <div className="space-y-2">
              <Label htmlFor="telefoneResponsavel">Telefone do Responsável *</Label>
              <Input
                id="telefoneResponsavel"
                name="telefoneResponsavel"
                placeholder="(00) 00000-0000"
                value={formData.telefoneResponsavel}
                onChange={handleInputChange}
                className="h-12"
              />
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label htmlFor="senha">Senha *</Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.senha}
                onChange={handleInputChange}
                className="h-12"
              />
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
              <Input
                id="confirmarSenha"
                name="confirmarSenha"
                type="password"
                placeholder="Digite a senha novamente"
                value={formData.confirmarSenha}
                onChange={handleInputChange}
                className="h-12"
              />
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full h-12 text-base font-semibold">
              Começar Agora
            </Button>
          </form>
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
              Sua loja <strong>{formData.nomeFarmacia}</strong> foi criada com sucesso!
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
