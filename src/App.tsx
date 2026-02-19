import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Pedidos from "./pages/Pedidos";
import Produtos from "./pages/Produtos";
import Clientes from "./pages/Clientes";
import Cupons from "./pages/Cupons";
import Aplicativos from "./pages/Aplicativos";
import Relatorios from "./pages/Relatorios";
import Configuracoes from "./pages/Configuracoes";
import UnidadeDetalhe from "./pages/UnidadeDetalhe";
import PagamentoOnlineConfig from "./pages/PagamentoOnlineConfig";
 import ColaboradorDetalhe from "./pages/ColaboradorDetalhe";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import ValidarToken from "./pages/ValidarToken";
import CadastroSucesso from "./pages/CadastroSucesso";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/validar-token" element={<ValidarToken />} />
              <Route path="/cadastro-sucesso" element={<CadastroSucesso />} />
              
              {/* Protected routes */}
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/pedidos" element={<ProtectedRoute><Pedidos /></ProtectedRoute>} />
              <Route path="/produtos" element={<ProtectedRoute><Produtos /></ProtectedRoute>} />
              <Route path="/clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
              <Route path="/cupons" element={<ProtectedRoute><Cupons /></ProtectedRoute>} />
              <Route path="/aplicativos" element={<ProtectedRoute><Aplicativos /></ProtectedRoute>} />
              <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
              <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
              <Route path="/configuracoes/unidades/:id" element={<ProtectedRoute><UnidadeDetalhe /></ProtectedRoute>} />
              <Route path="/configuracoes/pagamento-online" element={<ProtectedRoute><PagamentoOnlineConfig /></ProtectedRoute>} />
               <Route path="/configuracoes/colaboradores/:id" element={<ProtectedRoute><ColaboradorDetalhe /></ProtectedRoute>} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
