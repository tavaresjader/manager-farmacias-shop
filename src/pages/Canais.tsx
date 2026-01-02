import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchBar } from "@/components/ui/search-bar";
import { DataTable, Column } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Plus, Mail, MessageSquare, Instagram, Facebook, Linkedin } from "lucide-react";

interface Canal {
  id: string;
  name: string;
  type: "email" | "sms" | "whatsapp" | "instagram" | "facebook" | "linkedin";
  status: "active" | "inactive" | "pending";
  campaigns: number;
  leads: number;
  conversionRate: number;
}

const mockCanais: Canal[] = [
  {
    id: "1",
    name: "E-mail Marketing",
    type: "email",
    status: "active",
    campaigns: 12,
    leads: 1450,
    conversionRate: 4.2,
  },
  {
    id: "2",
    name: "WhatsApp Business",
    type: "whatsapp",
    status: "active",
    campaigns: 8,
    leads: 890,
    conversionRate: 6.8,
  },
  {
    id: "3",
    name: "Instagram Ads",
    type: "instagram",
    status: "active",
    campaigns: 15,
    leads: 2340,
    conversionRate: 3.5,
  },
  {
    id: "4",
    name: "Facebook Ads",
    type: "facebook",
    status: "active",
    campaigns: 10,
    leads: 1890,
    conversionRate: 2.9,
  },
  {
    id: "5",
    name: "LinkedIn Ads",
    type: "linkedin",
    status: "pending",
    campaigns: 0,
    leads: 0,
    conversionRate: 0,
  },
  {
    id: "6",
    name: "SMS Marketing",
    type: "sms",
    status: "inactive",
    campaigns: 3,
    leads: 120,
    conversionRate: 1.2,
  },
];

const getChannelIcon = (type: Canal["type"]) => {
  const icons = {
    email: Mail,
    sms: MessageSquare,
    whatsapp: MessageSquare,
    instagram: Instagram,
    facebook: Facebook,
    linkedin: Linkedin,
  };
  return icons[type];
};

const columns: Column<Canal>[] = [
  {
    key: "name",
    label: "Canal",
    sortable: true,
    render: (item) => {
      const Icon = getChannelIcon(item.type);
      return (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium text-foreground">{item.name}</span>
        </div>
      );
    },
  },
  {
    key: "status",
    label: "Status",
    render: (item) => <StatusBadge status={item.status} />,
  },
  {
    key: "campaigns",
    label: "Campanhas",
    sortable: true,
    render: (item) => (
      <span className="text-foreground font-medium">{item.campaigns}</span>
    ),
  },
  {
    key: "leads",
    label: "Contatos",
    sortable: true,
    render: (item) => (
      <span className="text-primary font-medium">{item.leads.toLocaleString("pt-BR")}</span>
    ),
  },
  {
    key: "conversionRate",
    label: "Taxa de Conversão",
    sortable: true,
    render: (item) => (
      <span className="text-success font-medium">{item.conversionRate}%</span>
    ),
  },
];

const Canais = () => {
  usePageTitle("Canais");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCanais = mockCanais.filter((canal) =>
    canal.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <PageHeader
        title="Canais"
        breadcrumbs={[
          { label: "canais" },
        ]}
      />

      <div className="space-y-4">
        <SearchBar
          placeholder="Pesquisar por nome do canal..."
          onSearch={setSearchQuery}
          onFilter={() => {}}
          className="max-w-md"
        />

        <DataTable
          columns={columns}
          data={filteredCanais}
          emptyMessage="Nenhum canal encontrado"
        />
      </div>
    </MainLayout>
  );
};

export default Canais;
