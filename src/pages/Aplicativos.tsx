import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageLoading } from "@/components/layout/PageLoading";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageLoading } from "@/hooks/usePageLoading";
import { WhatsAppConfigModal } from "@/components/whatsapp/WhatsAppConfigModal";
import { Plus, ExternalLink, BarChart3, MessageCircle, Monitor, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import ultramaxLogo from "@/assets/ultramax-logo.png";


interface Aplicativo {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "active" | "inactive" | "pending";
  logo?: string;
  icon?: "chart" | "shopping";
}

const mockAplicativos: Aplicativo[] = [];

const getAppIcon = (icon?: Aplicativo["icon"]) => {
  if (!icon) return ShoppingBag;
  const icons = {
    chart: BarChart3,
    shopping: ShoppingBag,
  };
  return icons[icon];
};

const Aplicativos = () => {
  usePageTitle("Aplicativos");
  const isLoading = usePageLoading();
  const [searchQuery, setSearchQuery] = useState("");
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const filteredApps = mockAplicativos.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <MainLayout>
        <PageLoading />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <WhatsAppConfigModal
        open={showWhatsAppModal} 
        onOpenChange={setShowWhatsAppModal} 
      />
      <PageHeader
        title="Aplicativos"
        breadcrumbs={[]}
      />

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* WhatsApp Card */}
          <div
            onClick={() => setShowWhatsAppModal(true)}
            className={cn(
              "card-elevated p-5 hover:shadow-elevated transition-shadow cursor-pointer group flex flex-col"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-[#25D366]" />
              </div>
              <StatusBadge status="active" />
            </div>
            <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-[#25D366] transition-colors">
              WhatsApp Business
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Configurar mensagem automática de resposta
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-md">
                Mensagens
              </span>
              <button className="text-muted-foreground hover:text-[#25D366] transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Integrador Card */}
          <div
            onClick={() => window.open("https://integrador.farmacias.shop?utm_source=MANAGER", "_blank")}
            className={cn(
              "card-elevated p-5 hover:shadow-elevated transition-shadow cursor-pointer group flex flex-col"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Monitor className="w-6 h-6 text-primary" />
              </div>
              <StatusBadge status="active" />
            </div>
            <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              Integrador
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              Integrador instalado em seu computador para sincronizar produtos, estoque e pedidos
            </p>
            <p className="text-xs text-amber-600 mb-3">
              *Verifique se seu sistema já está integrado com a Farmácias Shop
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-md">
                Sincronização
              </span>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Integrador Ultramax Card */}
          <div
            onClick={() => window.open("https://integrador.farmacias.shop?utm_source=MANAGER&utm_campaign=ULTRAMAX", "_blank")}
            className={cn(
              "card-elevated p-5 hover:shadow-elevated transition-shadow cursor-pointer group flex flex-col"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center overflow-hidden">
                <img src={ultramaxLogo} alt="Ultramax" className="w-10 h-auto object-contain" />
              </div>
              <StatusBadge status="active" />
            </div>
            <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              Integrador Ultramax
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              Integrador instalado em seu computador para sincronizar produtos, estoque e pedidos
            </p>
            <p className="text-xs text-amber-600 mb-3">
              *Exclusivo para clientes Ultramax
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-md">
                Sincronização
              </span>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>


            const Icon = getAppIcon(app.icon);
            return (
              <div
                key={app.id}
                className={cn(
                  "card-elevated p-5 hover:shadow-elevated transition-shadow cursor-pointer group"
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
                    {app.logo ? (
                      <img src={app.logo} alt={app.name} className="w-8 h-8 object-cover rounded" />
                    ) : (
                      <Icon className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {app.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {app.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-md">
                    {app.category}
                  </span>
                  <button className="text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </MainLayout>
  );
};

export default Aplicativos;
