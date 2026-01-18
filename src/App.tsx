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
import VerifyEmail from "./pages/VerifyEmail";
import AdminLayout from "./components/layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import AdminAffiliates from "./pages/admin/Affiliates";
import AdminArticles from "./pages/admin/Articles";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            {/* Silo 1: Tool Utama */}
            <Route path="/" element={<Index />} />

            {/* Silo 2: Knowledge Base */}
            <Route path="/learn" element={<Learn />} />
            <Route path="/learn/:slug" element={<Learn />} />

            {/* Silo 3: Commercial */}
            <Route path="/personal-report" element={<Reports />} />
            <Route path="/reports" element={<Reports />} /> {/* Legacy Redirect/Support */}
            <Route path="/report/full-personalized-report" element={<Reports />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/payment-result" element={<PaymentResult />} />

            {/* Silo 4: User Area */}
            <Route path="/account" element={<Account />} />
            <Route path="/account/my-reports" element={<Account />} />
            <Route path="/verify" element={<VerifyEmail />} />

            {/* Admin Area */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="affiliates" element={<AdminAffiliates />} />
              <Route path="articles" element={<AdminArticles />} />
            </Route>

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
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
