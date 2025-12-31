import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Campanhas from "./pages/Campanhas";
import Clientes from "./pages/Clientes";
import Canais from "./pages/Canais";
import Jornadas from "./pages/Jornadas";
import Aplicativos from "./pages/Aplicativos";
import Relatorios from "./pages/Relatorios";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/campanhas" element={<Campanhas />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/canais" element={<Canais />} />
          <Route path="/jornadas" element={<Jornadas />} />
          <Route path="/aplicativos" element={<Aplicativos />} />
          <Route path="/relatorios" element={<Relatorios />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
