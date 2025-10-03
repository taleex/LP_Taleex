import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import Header from "./components/Header";
import Index from "./pages/Index";
import ProjectsPage from "./pages/ProjectsPage";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import ServiceUnavailable from "./pages/ServiceUnavailable";
import ScrollToTop from "./components/ScrollToTop";
import ScrollProgress from "./components/ScrollProgress";
import BackToTop from "./components/BackToTop";
import { FeedbackChat } from "./components/FeedbackChat";
import { SupabaseErrorHandler } from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on Supabase errors
        if (error?.code === 'PGRST' || error?.message?.includes('supabase')) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

const AppContent = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  
  const isAdminRoute = location.pathname === '/admin' || location.pathname === '/auth' || location.pathname.match(/^\/(?!$|projects$).*/);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full">
        {!isAdminRoute && <AppSidebar />}
        <div className="flex-1 flex flex-col w-full">
          {!isAdminRoute && (
            <>
              <Header />
              <ScrollToTop />
              <ScrollProgress />
              <BackToTop />
              <FeedbackChat onOpenChange={setIsChatOpen} />
            </>
          )}
          <Routes>
            <Route path="/" element={<Index isChatOpen={isChatOpen} />} />
            <Route path="/projects" element={<ProjectsPage isChatOpen={isChatOpen} />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="/service-unavailable" element={<ServiceUnavailable />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SupabaseErrorHandler>
            <AppContent />
          </SupabaseErrorHandler>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
