import { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { AppSidebar } from "./AppSidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background flex-col">
      {/* Barra superior de ativação da conta */}
      <div
        className="w-full px-4 py-2 text-sm font-medium flex items-center justify-center gap-2"
        style={{ backgroundColor: "#f1c40f", color: "#3d2b00" }}
      >
        <AlertTriangle size={16} className="shrink-0" />
        <span className="font-semibold">Ative sua conta</span>
        <span>— sua conta será suspensa em 10 dias.</span>
      </div>

      <div className="flex flex-1 w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-background ml-16">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
