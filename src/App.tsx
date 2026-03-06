import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Pedido from "./pages/Pedido";
import MeusPedidos from "./pages/MeusPedidos";
import Cadastro from "./pages/Cadastro";
import AdminLogin from "./pages/AdminLogin";
import AdminPedidos from "./pages/AdminPedidos";
import Calculadora from "./pages/Calculadora";
import NotFound from "./pages/NotFound";
import SparkParticles from "./components/SparkParticles";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";
import { CustomerSessionProvider } from "./contexts/CustomerSessionContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CustomerSessionProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SparkParticles />
      <WhatsAppButton />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pedido" element={<Pedido />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/meus-pedidos" element={<MeusPedidos />} />
          <Route path="/meu-pedido" element={<MeusPedidos />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/pedidos" element={<AdminPedidos />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </CustomerSessionProvider>
  </QueryClientProvider>
);

export default App;
