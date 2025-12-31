import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { User, CreditCard, Puzzle, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { id: "conta", label: "Minha conta", icon: User },
  { id: "fatura", label: "Minha fatura", icon: CreditCard },
  { id: "integracoes", label: "Integrações", icon: Puzzle },
  { id: "colaboradores", label: "Colaboradores", icon: Users },
];

const Configuracoes = () => {
  const [activeTab, setActiveTab] = useState("conta");

  return (
    <MainLayout>
      <div className="flex h-full">
        {/* Submenu lateral */}
        <aside className="w-48 shrink-0 border-r border-border bg-card p-4">
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
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
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
            {activeTab === "conta" && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Minha conta</h2>
                <p className="text-muted-foreground">Gerencie suas informações pessoais e preferências.</p>
              </div>
            )}
            
            {activeTab === "fatura" && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Minha fatura</h2>
                <p className="text-muted-foreground">Visualize seu histórico de pagamentos e faturas.</p>
              </div>
            )}
            
            {activeTab === "integracoes" && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Integrações</h2>
                <p className="text-muted-foreground">Conecte suas ferramentas e serviços favoritos.</p>
              </div>
            )}
            
          {activeTab === "colaboradores" && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Colaboradores</h2>
              <p className="text-muted-foreground">Gerencie os membros da sua equipe e permissões.</p>
            </div>
          )}
        </main>
      </div>
    </MainLayout>
  );
};

export default Configuracoes;
