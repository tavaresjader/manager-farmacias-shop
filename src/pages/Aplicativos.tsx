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

import ifoodLogo from "@/assets/channels/ifood.webp";
import keetaLogo from "@/assets/channels/keeta.png";

interface Aplicativo {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "active" | "inactive" | "pending";
  logo?: string;
  icon?: "chart" | "shopping";
}

const mockAplicativos: Aplicativo[] = [
  {
    id: "1",
    name: "Google Analytics",
    description: "Análise de tráfego e comportamento do usuário",
    category: "Analytics",
    status: "active",
    icon: "chart",
  },
  {
    id: "2",
    name: "iFood",
    description: "Receba pedidos do maior marketplace de delivery",
    category: "Marketplace",
    status: "active",
    logo: ifoodLogo,
  },
  {
    id: "3",
    name: "Rappi",
    description: "Conecte-se ao aplicativo de entregas Rappi",
    category: "Marketplace",
    status: "pending",
  },
  {
    id: "4",
    name: "Keeta",
    description: "Integração com a plataforma Keeta",
    category: "Marketplace",
    status: "active",
    logo: keetaLogo,
  },
  {
    id: "5",
    name: "Amazon",
    description: "Venda seus produtos na Amazon",
    category: "Marketplace",
    status: "inactive",
  },
  {
    id: "6",
    name: "Mercado Livre",
    description: "Integração com o Mercado Livre",
    category: "Marketplace",
    status: "pending",
  },
];

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
        <SearchBar
          placeholder="Pesquisar por nome ou categoria..."
          onSearch={setSearchQuery}
          className="max-w-md"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* WhatsApp Card */}
          <div
            onClick={() => setShowWhatsAppModal(true)}
            className={cn(
              "card-elevated p-5 hover:shadow-elevated transition-shadow cursor-pointer group"
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
            <div className="flex items-center justify-between">
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
              "card-elevated p-5 hover:shadow-elevated transition-shadow cursor-pointer group"
            )}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Monitor className="w-6 h-6 text-primary" />
              </div>
              <StatusBadge status="inactive" />
            </div>
            <h3 className="font-heading font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              Integrador
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Integrador instalado em seu computador para sincronizar produtos, estoque e pedidos
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-md">
                Sincronização
              </span>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>

          {filteredApps.map((app) => {
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

        {filteredApps.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum aplicativo encontrado
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Aplicativos;
