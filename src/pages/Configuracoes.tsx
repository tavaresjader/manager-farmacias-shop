import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageLoading } from "@/components/layout/PageLoading";
import { usePageTitle } from "@/hooks/usePageTitle";
import { usePageLoading } from "@/hooks/usePageLoading";
import {
  User,
  CreditCard,
  Puzzle,
  Users,
  Building2,
  ImageIcon,
  Palette,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UnidadesTab } from "@/components/configuracoes/UnidadesTab";
import { BannersTab } from "@/components/configuracoes/BannersTab";
import { AparenciaTab } from "@/components/configuracoes/AparenciaTab";
import { ContaTab } from "@/components/configuracoes/ContaTab";
import { FaturaTab } from "@/components/configuracoes/FaturaTab";
import { IntegracoesTab } from "@/components/configuracoes/IntegracoesTab";
import { ColaboradoresTab } from "@/components/configuracoes/ColaboradoresTab";
import { PagamentosTab } from "@/components/configuracoes/PagamentosTab";

const menuItems = [
  { id: "unidades", label: "Unidades", icon: Building2 },
  { id: "banners", label: "Banners", icon: ImageIcon },
  { id: "aparencia", label: "Aparência", icon: Palette },
  { id: "pagamentos", label: "Pagamentos", icon: Wallet },
  { id: "conta", label: "Minha conta", icon: User },
  { id: "fatura", label: "Minhas faturas", icon: CreditCard },
  { id: "integracoes", label: "Integrações", icon: Puzzle },
  { id: "colaboradores", label: "Colaboradores", icon: Users },
];

const Configuracoes = () => {
  usePageTitle("Configurações");
  const isLoading = usePageLoading();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get("tab");
    return tabParam && menuItems.some(item => item.id === tabParam) ? tabParam : "unidades";
  });

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && menuItems.some(item => item.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <MainLayout>
        <PageLoading />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex h-full">
        {/* Submenu lateral */}
        <aside className="w-48 shrink-0 border-r border-border p-4">
          <h1 className="text-lg font-semibold text-foreground mb-4">Configurações</h1>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Conteúdo */}
        <main className="flex-1 p-6">
          {activeTab === "unidades" && <UnidadesTab />}
          {activeTab === "banners" && <BannersTab />}
          {activeTab === "aparencia" && <AparenciaTab />}
          {activeTab === "pagamentos" && <PagamentosTab />}
          {activeTab === "conta" && <ContaTab />}
          {activeTab === "fatura" && <FaturaTab />}
          {activeTab === "integracoes" && <IntegracoesTab />}
          {activeTab === "colaboradores" && <ColaboradoresTab />}
        </main>
      </div>
    </MainLayout>
  );
};

export default Configuracoes;
