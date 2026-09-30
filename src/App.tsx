import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Pedidos from "./pages/Pedidos";
import Produtos from "./pages/Produtos";
import Clientes from "./pages/Clientes";
import Cupons from "./pages/Cupons";
import Aplicativos from "./pages/Aplicativos";
import Entregas from "./pages/Entregas";
import NovaEntrega from "./pages/NovaEntrega";
import Relatorios from "./pages/Relatorios";
import RelatorioImpressao from "./pages/RelatorioImpressao";

import ConfiguracoesUnidades from "./pages/configuracoes/ConfiguracoesUnidades";
import ConfiguracoesBanners from "./pages/configuracoes/ConfiguracoesBanners";
import ConfiguracoesAparencia from "./pages/configuracoes/ConfiguracoesAparencia";
import ConfiguracoesPagamentos from "./pages/configuracoes/ConfiguracoesPagamentos";
import ConfiguracoesConta from "./pages/configuracoes/ConfiguracoesConta";
import ConfiguracoesFaturas from "./pages/configuracoes/ConfiguracoesFaturas";
import ConfiguracoesIntegracoes from "./pages/configuracoes/ConfiguracoesIntegracoes";
import ConfiguracoesColaboradores from "./pages/configuracoes/ConfiguracoesColaboradores";
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
              <Route path="/clientes" element={<ProtectedRoute requireMaster><Clientes /></ProtectedRoute>} />
              <Route path="/cupons" element={<ProtectedRoute requireMaster><Cupons /></ProtectedRoute>} />
              <Route path="/entregas" element={<ProtectedRoute><Entregas /></ProtectedRoute>} />
              <Route path="/aplicativos" element={<ProtectedRoute requireMaster><Aplicativos /></ProtectedRoute>} />
              <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
              <Route path="/relatorios/impressao" element={<ProtectedRoute><RelatorioImpressao /></ProtectedRoute>} />

              <Route path="/configuracoes" element={<ProtectedRoute requireMaster><Navigate to="/configuracoes/unidades" replace /></ProtectedRoute>} />
              <Route path="/configuracoes/unidades" element={<ProtectedRoute requireMaster><ConfiguracoesUnidades /></ProtectedRoute>} />
              <Route path="/configuracoes/banners" element={<ProtectedRoute requireMaster><ConfiguracoesBanners /></ProtectedRoute>} />
              <Route path="/configuracoes/aparencia" element={<ProtectedRoute requireMaster><ConfiguracoesAparencia /></ProtectedRoute>} />
              <Route path="/configuracoes/pagamentos" element={<ProtectedRoute requireMaster><ConfiguracoesPagamentos /></ProtectedRoute>} />
              <Route path="/configuracoes/conta" element={<ProtectedRoute requireMaster><ConfiguracoesConta /></ProtectedRoute>} />
              <Route path="/configuracoes/faturas" element={<ProtectedRoute requireMaster><ConfiguracoesFaturas /></ProtectedRoute>} />
              <Route path="/configuracoes/integracoes" element={<ProtectedRoute requireMaster><ConfiguracoesIntegracoes /></ProtectedRoute>} />
              <Route path="/configuracoes/colaboradores" element={<ProtectedRoute requireMaster><ConfiguracoesColaboradores /></ProtectedRoute>} />
              <Route path="/configuracoes/unidades/:id" element={<ProtectedRoute requireMaster><UnidadeDetalhe /></ProtectedRoute>} />
              <Route path="/configuracoes/pagamento-online" element={<ProtectedRoute requireMaster><PagamentoOnlineConfig /></ProtectedRoute>} />
               <Route path="/configuracoes/colaboradores/:id" element={<ProtectedRoute requireMaster><ColaboradorDetalhe /></ProtectedRoute>} />
              
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
