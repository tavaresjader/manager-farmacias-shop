import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  Ticket,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import logoFarmaciaShop from "@/assets/logo-farmacia-shop.png";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Motorcycle = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="5" cy="17" r="3" />
    <circle cx="19" cy="17" r="3" />
    <path d="M5 17h4l3-6h3l4 6" />
    <path d="M9 17 7 9h5" />
    <path d="M14 8h4l1 2" />
    <path d="M12 11h4" />
  </svg>
);

const mainNavItems = [
  { icon: LayoutDashboard, label: "Início", path: "/" },
  { icon: ShoppingCart, label: "Pedidos", path: "/pedidos" },
  { icon: Package, label: "Produtos", path: "/produtos" },
  { icon: Users, label: "Clientes", path: "/clientes" },
  { icon: Ticket, label: "Cupons", path: "/cupons" },
  { icon: Motorcycle, label: "Entregas", path: "/entregas" },
  { icon: AppWindow, label: "Aplicativos", path: "/aplicativos" },
  { icon: BarChart3, label: "Insights", path: "/relatorios" },
];

const bottomNavItems = [
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
  { icon: HelpCircle, label: "Ajuda", path: "/ajuda", external: "https://ajuda.farmacias.shop?UTM_SOURCE=MANAGER" },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { clearAuth } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
    toast.success("Logout realizado com sucesso!");
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
          const isActive = location.pathname === item.path || 
            (item.path === "/" && location.pathname === "/");
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
      <div className="py-6 px-2 border-t border-sidebar-border space-y-2">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path || 
            location.pathname.startsWith(item.path + "/");
          
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

        {/* Logout */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full h-10 rounded-lg transition-all duration-200 text-sidebar-foreground hover:bg-accent hover:text-foreground"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            Sair
          </TooltipContent>
        </Tooltip>

      </div>
    </aside>
  );
}
