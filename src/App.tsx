import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WebhookProvider } from "@/contexts/WebhookContext";
import { ServiciosProvider } from "@/contexts/ServiciosContext";
import Index from "./pages/Index";
import RutasPage from "./pages/RutasPage";
import AlbaranesPage from "./pages/AlbaranesPage";
import FacturasPage from "./pages/FacturasPage";
import ExtractorPage from "./pages/ExtractorPage";
import AjustesPage from "./pages/AjustesPage";
import SolicitudServicioPage from "./pages/SolicitudServicioPage";
import SeguimientoPage from "./pages/SeguimientoPage";
import TrabajadoresPage from "./pages/TrabajadoresPage";
import FacturacionAutoPage from "./pages/FacturacionAutoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <WebhookProvider>
        <ServiciosProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/solicitar" element={<SolicitudServicioPage />} />
              <Route path="/seguimiento" element={<SeguimientoPage />} />
              <Route path="/trabajadores" element={<TrabajadoresPage />} />
              <Route path="/facturacion" element={<FacturacionAutoPage />} />
              <Route path="/rutas" element={<RutasPage />} />
              <Route path="/albaranes" element={<AlbaranesPage />} />
              <Route path="/facturas" element={<FacturasPage />} />
              <Route path="/extractor" element={<ExtractorPage />} />
              <Route path="/ajustes" element={<AjustesPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ServiciosProvider>
      </WebhookProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
