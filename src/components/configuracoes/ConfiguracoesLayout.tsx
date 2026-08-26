import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageLoading } from "@/components/layout/PageLoading";
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

export const configuracoesMenuItems = [
  { path: "/configuracoes/unidades", label: "Unidades", icon: Building2 },
  { path: "/configuracoes/banners", label: "Banners", icon: ImageIcon },
  { path: "/configuracoes/aparencia", label: "Aparência", icon: Palette },
  { path: "/configuracoes/pagamentos", label: "Pagamentos", icon: Wallet },
  { path: "/configuracoes/conta", label: "Minha conta", icon: User },
  { path: "/configuracoes/faturas", label: "Minhas faturas", icon: CreditCard },
  { path: "/configuracoes/integracoes", label: "Integrações", icon: Puzzle },
  { path: "/configuracoes/colaboradores", label: "Colaboradores", icon: Users },
];

interface ConfiguracoesLayoutProps {
  children: ReactNode;
}

export const ConfiguracoesLayout = ({ children }: ConfiguracoesLayoutProps) => {
  const isLoading = usePageLoading();

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
            {configuracoesMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-left text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Conteúdo */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </MainLayout>
  );
};
