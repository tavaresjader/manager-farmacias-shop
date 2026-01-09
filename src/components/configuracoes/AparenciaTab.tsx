import { useState } from "react";
import { Upload, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export function AparenciaTab() {
  const { toast } = useToast();
  const [aparencia, setAparencia] = useState({
    logo: "/placeholder.svg",
    corPrincipal: "#000000",
    corSecundaria: "#666666",
    politicaEnvio: "",
    politicaPrivacidade: "",
  });

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col">
      <h2 className="text-lg font-semibold text-foreground mb-6">Aparência</h2>
      <form className="flex-1 flex flex-col gap-6">
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

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 flex flex-col space-y-2">
            <Label htmlFor="politica-envio">Política de Envio</Label>
            <Textarea
              id="politica-envio"
              value={aparencia.politicaEnvio}
              onChange={(e) => setAparencia({ ...aparencia, politicaEnvio: e.target.value })}
              placeholder="Descreva a política de envio da sua loja..."
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
