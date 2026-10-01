import { ReactNode, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { ACTIVATION_BAR_DISMISS_KEY as DISMISS_KEY } from "@/lib/authToken";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(DISMISS_KEY) === "true"
  );

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  return (
    <div className="flex min-h-screen w-full bg-background flex-col">
      {/* Barra superior de ativação da conta */}
      {!dismissed && (
        <div
          className="w-full px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 relative"
          style={{ backgroundColor: "#f1c40f", color: "#3d2b00" }}
        >
          <AlertTriangle size={16} className="shrink-0" />
          <span className="font-semibold">Efetive sua fatura</span>
          <span>— o acesso a sua conta será restrita em 10 dias.</span>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Fechar aviso de ativação"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-black/10 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-1 w-full">
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-background ml-16">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
