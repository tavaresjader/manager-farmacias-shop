import { ChangeEvent, useEffect, useState } from "react";
import { Upload, ExternalLink, Instagram, Facebook, Youtube, Globe, HelpCircle, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { managerBackendBff } from "@/services/ManagerBackendBff";

interface Aparencia {
  logo: string;
  corPrincipal: string;
  corSecundaria: string;
  politicaEnvio: string;
  politicaPrivacidade: string;
  instagram: string;
  facebook: string;
  youtube: string;
  dominioPersonalizado: string;
  urlAtual: string;
  fileName: string;
  fileBase64?: string;
}

interface AppearanceApiResponse {
  storeUrl?: string | null;
  url?: string | null;
  currentUrl?: string | null;
  domain?: string | null;
  domainCustom?: string | null;
  customDomain?: string | null;
  customizedDomain?: string | null;
  LogoUrl?: string | null;
  logoUrl?: string | null;
  fileUrl?: string | null;
  fileName?: string | null;
  primaryColor?: string | null;
  mainColor?: string | null;
  headerColor?: string | null;
  secondaryColor?: string | null;
  buttonColor?: string | null;
  iconColor?: string | null;
  deliveryPolicy?: string | null;
  shippingPolicy?: string | null;
  privacyPolicy?: string | null;
  instagram?: string | null;
  instagramUrl?: string | null;
  facebook?: string | null;
  facebookUrl?: string | null;
  youtube?: string | null;
  youtubeUrl?: string | null;
}

interface AppearancePayload {
  domainCustom: string | null;
  fileName?: string;
  fileBase64?: string;
  primaryColor: string;
  secondaryColor: string;
  instagramUrl: string | null;
  facebookUrl: string | null;
  youtubeUrl: string | null;
  deliveryPolicy: string;
  privacyPolicy: string;
}

const DEFAULT_APARENCIA: Aparencia = {
  logo: "/placeholder.svg",
  corPrincipal: "#000000",
  corSecundaria: "#666666",
  politicaEnvio: "",
  politicaPrivacidade: "",
  instagram: "",
  facebook: "",
  youtube: "",
  dominioPersonalizado: "",
  urlAtual: "",
  fileName: "",
};

function firstString(...values: Array<string | null | undefined>): string {
  return values.find((value) => typeof value === "string" && value.trim())?.trim() ?? "";
}

function toAparencia(appearance: AppearanceApiResponse): Aparencia {
  return {
    logo: firstString(appearance.LogoUrl, appearance.logoUrl) || DEFAULT_APARENCIA.logo,
    corPrincipal: firstString(appearance.primaryColor, appearance.mainColor, appearance.headerColor) || DEFAULT_APARENCIA.corPrincipal,
    corSecundaria:
      firstString(appearance.secondaryColor, appearance.buttonColor, appearance.iconColor) ||
      DEFAULT_APARENCIA.corSecundaria,
    politicaEnvio: firstString(appearance.deliveryPolicy, appearance.shippingPolicy),
    politicaPrivacidade: firstString(appearance.privacyPolicy),
    instagram: firstString(appearance.instagramUrl, appearance.instagram),
    facebook: firstString(appearance.facebookUrl, appearance.facebook),
    youtube: firstString(appearance.youtubeUrl, appearance.youtube),
    dominioPersonalizado: firstString(appearance.domainCustom),
    urlAtual: firstString(appearance.domain) || DEFAULT_APARENCIA.urlAtual,
    fileName: firstString(appearance.fileName),
  };
}

function toAppearancePayload(aparencia: Aparencia): AppearancePayload {
  const payload: AppearancePayload = {
    domainCustom: aparencia.dominioPersonalizado.trim() || null,
    primaryColor: aparencia.corPrincipal,
    secondaryColor: aparencia.corSecundaria,
    instagramUrl: aparencia.instagram.trim() || null,
    facebookUrl: aparencia.facebook.trim() || null,
    youtubeUrl: aparencia.youtube.trim() || null,
    deliveryPolicy: aparencia.politicaEnvio,
    privacyPolicy: aparencia.politicaPrivacidade,
  };

  if (aparencia.fileBase64) {
    payload.fileName = aparencia.fileName;
    payload.fileBase64 = aparencia.fileBase64;
  }

  return payload;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function AparenciaTab() {
  const { toast } = useToast();
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [aparencia, setAparencia] = useState<Aparencia>(DEFAULT_APARENCIA);
  const [loadingAppearance, setLoadingAppearance] = useState(false);
  const [savingAppearance, setSavingAppearance] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadAppearance = async () => {
      setLoadingAppearance(true);
      const response = await managerBackendBff.get<AppearanceApiResponse>("/v1/appearance");

      if (cancelled) return;

      if (response.data) {
        setAparencia(toAparencia(response.data));
      } else {
        toast({
          variant: "destructive",
          description: `Erro ao carregar aparência: ${response.error ?? "Tente novamente."}`,
        });
      }

      setLoadingAppearance(false);
    };

    loadAppearance();

    return () => {
      cancelled = true;
    };
  }, [toast]);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(aparencia.urlAtual);
    setCopiedUrl(true);
    toast({ description: "URL copiada para a área de transferência!" });
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyDomain = () => {
    if (!aparencia.dominioPersonalizado) return;
    navigator.clipboard.writeText(aparencia.dominioPersonalizado);
    setCopiedDomain(true);
    toast({ description: "Domínio copiado para a área de transferência!" });
    setTimeout(() => setCopiedDomain(false), 2000);
  };

  const handleLogoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileBase64 = await readFileAsDataUrl(file);
      setAparencia((current) => ({
        ...current,
        logo: fileBase64,
        fileName: file.name,
        fileBase64,
      }));
    } catch {
      toast({
        variant: "destructive",
        description: "Não foi possível carregar a imagem selecionada.",
      });
    }
  };

  const handleSaveAppearance = async () => {
    setSavingAppearance(true);
    const response = await managerBackendBff.put<AppearanceApiResponse>(
      "/v1/appearance",
      toAppearancePayload(aparencia),
    );

    setSavingAppearance(false);

    if (response.error) {
      toast({
        variant: "destructive",
        description: `Erro ao salvar aparência: ${response.error}`,
      });
      return;
    }

    setAparencia((current) => ({ ...current, fileBase64: undefined }));

    toast({
      description: "Configurações de aparência salvas com sucesso!",
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col overflow-auto">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-foreground">Aparência</h2>
        {loadingAppearance && (
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando aparência...
          </span>
        )}
      </div>
      <form className="flex-1 flex flex-col gap-6">
        {/* Domain Section */}
        <div className="space-y-4">
          <Label className="text-base font-medium flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Domínio da Loja
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="url-atual" className="flex items-center gap-2">
                URL Atual da Loja
              </Label>

              <div className="flex gap-2">
                <Input
                  id="url-atual"
                  type="url"
                  value={aparencia.urlAtual}
                  readOnly
                  disabled
                  className="flex-1 bg-muted"
                />
                <Button type="button" variant="outline" size="icon" onClick={handleCopyUrl} disabled={!aparencia.urlAtual}>
                  {copiedUrl ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dominio-personalizado" className="flex items-center gap-2">
                Domínio Personalizado
              </Label>
              <div className="flex gap-2">
                <Input
                  id="dominio-personalizado"
                  type="text"
                  value={aparencia.dominioPersonalizado}
                  onChange={(e) => setAparencia({ ...aparencia, dominioPersonalizado: e.target.value })}
                  placeholder="www.sua-loja.com.br"
                  className="flex-1"
                  disabled={loadingAppearance || savingAppearance}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopyDomain}
                  disabled={!aparencia.dominioPersonalizado}
                >
                  {copiedDomain ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
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
                  onChange={handleLogoChange}
                  disabled={loadingAppearance || savingAppearance}
                />
                <Button type="button" variant="outline" size="icon">
                  <Upload className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-16 border border-border rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                <img src={aparencia.logo} alt="Logo da Farmácia" className="w-full h-full object-contain" />
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
            <Label htmlFor="cor-principal">Cor (Header)</Label>
            <div className="flex gap-2">
              <Input
                id="cor-principal"
                type="color"
                value={aparencia.corPrincipal}
                onChange={(e) => setAparencia({ ...aparencia, corPrincipal: e.target.value })}
                className="w-12 h-10 p-1 cursor-pointer"
                disabled={loadingAppearance || savingAppearance}
              />
              <Input
                type="text"
                value={aparencia.corPrincipal}
                onChange={(e) => setAparencia({ ...aparencia, corPrincipal: e.target.value })}
                placeholder="#000000"
                className="flex-1"
                disabled={loadingAppearance || savingAppearance}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cor-secundaria">Cor (Botões e ícones)</Label>
            <div className="flex gap-2">
              <Input
                id="cor-secundaria"
                type="color"
                value={aparencia.corSecundaria}
                onChange={(e) => setAparencia({ ...aparencia, corSecundaria: e.target.value })}
                className="w-12 h-10 p-1 cursor-pointer"
                disabled={loadingAppearance || savingAppearance}
              />
              <Input
                type="text"
                value={aparencia.corSecundaria}
                onChange={(e) => setAparencia({ ...aparencia, corSecundaria: e.target.value })}
                placeholder="#666666"
                className="flex-1"
                disabled={loadingAppearance || savingAppearance}
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
                disabled={loadingAppearance || savingAppearance}
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
                disabled={loadingAppearance || savingAppearance}
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
                disabled={loadingAppearance || savingAppearance}
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
              disabled={loadingAppearance || savingAppearance}
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
              disabled={loadingAppearance || savingAppearance}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSaveAppearance}
            disabled={loadingAppearance || savingAppearance}
          >
            {savingAppearance && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
}
