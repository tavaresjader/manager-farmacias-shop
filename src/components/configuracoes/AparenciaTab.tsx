import { useState } from "react";
import { Upload, ExternalLink, Instagram, Facebook, Youtube, Globe, HelpCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function AparenciaTab() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [aparencia, setAparencia] = useState({
    logo: "/placeholder.svg",
    corPrincipal: "#000000",
    corSecundaria: "#666666",
    politicaEnvio: "",
    politicaPrivacidade: "",
    instagram: "",
    facebook: "",
    youtube: "",
    dominioPersonalizado: "",
  });

  const urlAtual = "https://sua-loja.lovable.app";

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(urlAtual);
    setCopied(true);
    toast({ description: "URL copiada para a área de transferência!" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col overflow-auto">
      <h2 className="text-lg font-semibold text-foreground mb-6">Aparência</h2>
      <form className="flex-1 flex flex-col gap-6">
        {/* Domain Section */}
        <div className="space-y-4">
          <Label className="text-base font-medium flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Domínio da Loja
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="url-atual">URL Atual da Loja</Label>
              <div className="flex gap-2">
                <Input
                  id="url-atual"
                  type="url"
                  value={urlAtual}
                  readOnly
                  className="flex-1 bg-muted"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopyUrl}
                >
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="dominio-personalizado">Domínio Personalizado</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href="https://docs.lovable.dev/features/custom-domain"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Clique para ver como configurar seu domínio</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="dominio-personalizado"
                type="text"
                value={aparencia.dominioPersonalizado}
                onChange={(e) => setAparencia({ ...aparencia, dominioPersonalizado: e.target.value })}
                placeholder="www.sua-loja.com.br"
              />
            </div>
          </div>
        </div>
        {/* Logo Upload */}
        <div className="space-y-2">
          <Label htmlFor="logo">Logotipo da Farmácia</Label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  className="flex-1"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setAparencia({ ...aparencia, logo: url });
                    }
                  }}
                />
                <Button type="button" variant="outline" size="icon">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-16 border border-border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                <img
                  src={aparencia.logo}
                  alt="Logo da Farmácia"
                  className="w-full h-full object-contain"
                />
              </div>
              <a
                href={aparencia.logo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cor-principal">Cor Principal</Label>
            <div className="flex gap-2">
              <Input
                id="cor-principal"
                type="color"
                value={aparencia.corPrincipal}
                onChange={(e) => setAparencia({ ...aparencia, corPrincipal: e.target.value })}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={aparencia.corPrincipal}
                onChange={(e) => setAparencia({ ...aparencia, corPrincipal: e.target.value })}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cor-secundaria">Cor Secundária</Label>
            <div className="flex gap-2">
              <Input
                id="cor-secundaria"
                type="color"
                value={aparencia.corSecundaria}
                onChange={(e) => setAparencia({ ...aparencia, corSecundaria: e.target.value })}
                className="w-12 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={aparencia.corSecundaria}
                onChange={(e) => setAparencia({ ...aparencia, corSecundaria: e.target.value })}
                placeholder="#666666"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Redes Sociais</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram
              </Label>
              <Input
                id="instagram"
                type="url"
                value={aparencia.instagram}
                onChange={(e) => setAparencia({ ...aparencia, instagram: e.target.value })}
                placeholder="https://instagram.com/sua-loja"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook" className="flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                Facebook
              </Label>
              <Input
                id="facebook"
                type="url"
                value={aparencia.facebook}
                onChange={(e) => setAparencia({ ...aparencia, facebook: e.target.value })}
                placeholder="https://facebook.com/sua-loja"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube" className="flex items-center gap-2">
                <Youtube className="w-4 h-4" />
                YouTube
              </Label>
              <Input
                id="youtube"
                type="url"
                value={aparencia.youtube}
                onChange={(e) => setAparencia({ ...aparencia, youtube: e.target.value })}
                placeholder="https://youtube.com/@sua-loja"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 flex flex-col space-y-2">
            <Label htmlFor="politica-entrega">Política de Entrega</Label>
            <Textarea
              id="politica-entrega"
              value={aparencia.politicaEnvio}
              onChange={(e) => setAparencia({ ...aparencia, politicaEnvio: e.target.value })}
              placeholder="Descreva a política de entrega da sua loja..."
              className="flex-1 min-h-[150px] resize-none"
            />
          </div>

          <div className="flex-1 flex flex-col space-y-2">
            <Label htmlFor="politica-privacidade">Política de Privacidade</Label>
            <Textarea
              id="politica-privacidade"
              value={aparencia.politicaPrivacidade}
              onChange={(e) => setAparencia({ ...aparencia, politicaPrivacidade: e.target.value })}
              placeholder="Descreva a política de privacidade da sua loja..."
              className="flex-1 min-h-[150px] resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => {
              toast({
                description: "Configurações de aparência salvas com sucesso!",
              });
            }}
          >
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
}
