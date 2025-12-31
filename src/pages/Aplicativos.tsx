import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/ui/search-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, Zap, Database, CreditCard, Mail, BarChart3, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Aplicativo {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "active" | "inactive" | "pending";
  icon: "zap" | "database" | "creditcard" | "mail" | "chart" | "message";
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
    name: "Stripe",
    description: "Processamento de pagamentos online",
    category: "Pagamentos",
    status: "active",
    icon: "creditcard",
  },
  {
    id: "3",
    name: "Mailchimp",
    description: "Automação de e-mail marketing",
    category: "E-mail",
    status: "active",
    icon: "mail",
  },
  {
    id: "4",
    name: "HubSpot CRM",
    description: "Gestão de relacionamento com clientes",
    category: "CRM",
    status: "pending",
    icon: "database",
  },
  {
    id: "5",
    name: "Zapier",
    description: "Automação e integração de aplicativos",
    category: "Automação",
    status: "active",
    icon: "zap",
  },
  {
    id: "6",
    name: "Intercom",
    description: "Chat e suporte ao cliente",
    category: "Suporte",
    status: "inactive",
    icon: "message",
  },
];

const getAppIcon = (icon: Aplicativo["icon"]) => {
  const icons = {
    zap: Zap,
    database: Database,
    creditcard: CreditCard,
    mail: Mail,
    chart: BarChart3,
    message: MessageSquare,
  };
  return icons[icon];
};

const Aplicativos = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredApps = mockAplicativos.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <PageHeader
        title="Aplicativos"
        breadcrumbs={[
          { label: "marketing", path: "/" },
          { label: "aplicativos" },
        ]}
        actions={
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Adicionar Aplicativo
          </Button>
        }
      />

      <div className="space-y-6">
        <SearchBar
          placeholder="Pesquisar por nome ou categoria..."
          onSearch={setSearchQuery}
          onFilter={() => {}}
          className="max-w-md"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
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
