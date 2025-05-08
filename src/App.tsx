
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Sales from "./pages/Sales";
import QRCodeManagement from "./pages/QRCodeManagement";
import SalesProcess from "./pages/SalesProcess";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RouterRoutes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/sales" element={<Sales />} />
          <Route path="/qr-management" element={<QRCodeManagement />} />
          <Route path="/sales-process" element={<SalesProcess />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
