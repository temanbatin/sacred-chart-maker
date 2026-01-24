import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { LoadingAnimation } from "./components/LoadingAnimation";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { WhatsAppFloatingButton } from "./components/WhatsAppFloatingButton";

// Lazy loading components
const Index = lazy(() => import("./pages/Index"));
const TentangKami = lazy(() => import("./pages/TentangKami"));
const AuthorsNote = lazy(() => import("./pages/AuthorsNote"));
const KebijakanPrivasi = lazy(() => import("./pages/KebijakanPrivasi"));
const SyaratKetentuan = lazy(() => import("./pages/SyaratKetentuan"));
const HubungiKami = lazy(() => import("./pages/HubungiKami"));
const KebijakanPengembalianDana = lazy(() => import("./pages/KebijakanPengembalianDana"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Learn = lazy(() => import("./pages/Learn"));
const Reports = lazy(() => import("./pages/Reports"));
const Shop = lazy(() => import("./pages/Shop"));
const Account = lazy(() => import("./pages/Account"));
const Methodology = lazy(() => import("./pages/Methodology"));
const PaymentResult = lazy(() => import("./pages/PaymentResult"));
const NotFound = lazy(() => import("./pages/NotFound"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));

// Admin components
const AdminLayout = lazy(() => import("./components/layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminAffiliates = lazy(() => import("./pages/admin/Affiliates"));
const AdminArticles = lazy(() => import("./pages/admin/Articles"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000,   // 30 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <WhatsAppFloatingButton />
      <ErrorBoundary>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={<LoadingAnimation />}>
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
              <Route path="/authors-note" element={<AuthorsNote />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="/kebijakan-privasi" element={<KebijakanPrivasi />} />
              <Route path="/syarat-ketentuan" element={<SyaratKetentuan />} />
              <Route path="/hubungi-kami" element={<HubungiKami />} />
              <Route path="/kebijakan-pengembalian-dana" element={<KebijakanPengembalianDana />} />
              <Route path="/faq" element={<FAQ />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
