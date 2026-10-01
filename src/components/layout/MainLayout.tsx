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
        className="w-full px-4 py-2 text-center text-sm font-medium"
        style={{ backgroundColor: "#f1c40f", color: "#3d2b00" }}
      >
        Ative sua conta
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
