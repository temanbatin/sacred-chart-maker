import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TentangKami from "./pages/TentangKami";
import KebijakanPrivasi from "./pages/KebijakanPrivasi";
import SyaratKetentuan from "./pages/SyaratKetentuan";
import HubungiKami from "./pages/HubungiKami";
import KebijakanPengembalianDana from "./pages/KebijakanPengembalianDana";
import FAQ from "./pages/FAQ";
import Learn from "./pages/Learn";
import Reports from "./pages/Reports";
import Shop from "./pages/Shop";
import Account from "./pages/Account";
import Methodology from "./pages/Methodology";
import PaymentResult from "./pages/PaymentResult";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Silo 1: Tool Utama */}
          <Route path="/" element={<Index />} />
          
          {/* Silo 2: Knowledge Base (Coming Soon) */}
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/apa-itu-human-design" element={<Learn />} />
          <Route path="/learn/type" element={<Learn />} />
          <Route path="/learn/centers" element={<Learn />} />
          <Route path="/learn/authority" element={<Learn />} />
          
          {/* Silo 3: Commercial */}
          <Route path="/reports" element={<Reports />} />
          <Route path="/report/full-personalized-report" element={<Reports />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/payment-result" element={<PaymentResult />} />
          
          {/* Silo 4: User Area */}
          <Route path="/account" element={<Account />} />
          <Route path="/account/my-reports" element={<Account />} />
          
          {/* About & Legal */}
          <Route path="/tentang-kami" element={<TentangKami />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/kebijakan-privasi" element={<KebijakanPrivasi />} />
          <Route path="/syarat-ketentuan" element={<SyaratKetentuan />} />
          <Route path="/hubungi-kami" element={<HubungiKami />} />
          <Route path="/kebijakan-pengembalian-dana" element={<KebijakanPengembalianDana />} />
          <Route path="/faq" element={<FAQ />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
