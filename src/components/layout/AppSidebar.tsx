import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Megaphone,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  Bell,
  Menu,
  ChevronLeft,
  Radio,
  Route,
  AppWindow,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { icon: LayoutDashboard, label: "Visão Geral", path: "/" },
  { icon: Megaphone, label: "Campanhas", path: "/campanhas" },
  { icon: Users, label: "Clientes", path: "/clientes" },
  { icon: Radio, label: "Canais", path: "/canais" },
  { icon: Route, label: "Jornadas", path: "/jornadas" },
  { icon: AppWindow, label: "Aplicativos", path: "/aplicativos" },
  { icon: BarChart3, label: "Insights", path: "/relatorios" },
];

const bottomNavItems = [
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
  { icon: HelpCircle, label: "Ajuda", path: "/ajuda" },
  { icon: Bell, label: "Notificações", path: "/notificacoes" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Megaphone className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-heading font-semibold text-foreground">
              MarketHub
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "ml-auto p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? (
            <Menu className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {mainNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-accent hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="py-4 px-2 border-t border-sidebar-border space-y-1">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-accent text-foreground"
                  : "text-sidebar-foreground hover:bg-accent hover:text-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </NavLink>
          );
        })}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 w-full",
            "text-sidebar-foreground hover:bg-accent hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 flex-shrink-0" />
          ) : (
            <Moon className="w-5 h-5 flex-shrink-0" />
          )}
          {!collapsed && (
            <span className="font-medium text-sm">
              {theme === "dark" ? "Tema Claro" : "Tema Escuro"}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
