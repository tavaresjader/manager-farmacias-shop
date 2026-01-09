import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  AppWindow,
  Moon,
  Sun,
  ShoppingCart,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import logoFarmaciaShop from "@/assets/logo-farmacia-shop.png";

const mainNavItems = [
  { icon: LayoutDashboard, label: "Início", path: "/" },
  { icon: ShoppingCart, label: "Pedidos", path: "/pedidos" },
  { icon: Package, label: "Produtos", path: "/produtos" },
  { icon: Users, label: "Clientes", path: "/clientes" },
  { icon: AppWindow, label: "Aplicativos", path: "/aplicativos" },
  { icon: BarChart3, label: "Insights", path: "/relatorios" },
];

const bottomNavItems = [
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
  { icon: HelpCircle, label: "Ajuda", path: "/ajuda", external: "https://ajuda.farmaciashop.com.br?UTM_SOURCE=MANAGER" },
];

export function AppSidebar() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <aside className="flex flex-col h-screen w-16 bg-white dark:bg-background border-r border-sidebar-border fixed left-0 top-0 z-40">
      {/* Logo */}
      <NavLink to="/" className="flex items-center justify-center h-16 border-b border-sidebar-border">
        <img 
          src={logoFarmaciaShop} 
          alt="Farmácia Shop" 
          className="w-8 h-8 rounded-lg object-cover"
        />
      </NavLink>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {mainNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Tooltip key={item.path} delayDuration={0}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center justify-center w-full h-10 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-[#212121] text-white shadow-sm"
                      : "text-sidebar-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="py-4 px-2 border-t border-sidebar-border space-y-1">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          if (item.external) {
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>
                  <a
                    href={item.external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center justify-center w-full h-10 rounded-lg transition-all duration-200",
                      "text-sidebar-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                  </a>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }
          
          return (
            <Tooltip key={item.path} delayDuration={0}>
              <TooltipTrigger asChild>
                <NavLink
                  to={item.path}
                  className={cn(
                    "flex items-center justify-center w-full h-10 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-sidebar-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={10}>
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}

        {/* Theme Toggle */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-full h-10 rounded-lg transition-all duration-200 text-sidebar-foreground hover:bg-accent hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            {theme === "dark" ? "Tema Claro" : "Tema Escuro"}
          </TooltipContent>
        </Tooltip>

      </div>
    </aside>
  );
}
