import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ExecutiveAssistantDemo from "./pages/ExecutiveAssistantDemo";
import AIDemoPage from "./pages/AIDemoPage";
import MerckAIHubPage from "./pages/MerckAIHubPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/ai-digital-collab-mainxx">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/demo" element={<AIDemoPage />} />
            <Route path="/executive-assistant" element={<ExecutiveAssistantDemo />} />
            <Route path="/merck-ai-hub" element={<MerckAIHubPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
