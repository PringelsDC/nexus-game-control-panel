
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboard Pages
import Dashboard from "./pages/Dashboard";
import ServerList from "./pages/ServerList";
import ServerDetails from "./pages/ServerDetails";
import CreateServer from "./pages/CreateServer";
import Subscription from "./pages/Subscription";
import Settings from "./pages/Settings";
import ApiSettings from "./pages/ApiSettings";

// Admin Pages
import AdminUserList from "./pages/admin/AdminUserList";
import AdminServerList from "./pages/admin/AdminServerList";

// Contexts
import { AuthProvider } from "./contexts/AuthContext";
import { ServerProvider } from "./contexts/ServerContext";

// Layout Components
import Layout from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <ServerProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected User Routes */}
              <Route path="/dashboard" element={<Layout requireAuth><Dashboard /></Layout>} />
              <Route path="/servers" element={<Layout requireAuth><ServerList /></Layout>} />
              <Route path="/servers/new" element={<Layout requireAuth><CreateServer /></Layout>} />
              <Route path="/servers/:id" element={<Layout requireAuth><ServerDetails /></Layout>} />
              <Route path="/plans" element={<Layout requireAuth><Subscription /></Layout>} />
              <Route path="/settings" element={<Layout requireAuth><Settings /></Layout>} />
              <Route path="/api-settings" element={<Layout requireAuth><ApiSettings /></Layout>} />

              {/* Admin Routes */}
              <Route path="/admin/users" element={<Layout requireAuth requireAdmin><AdminUserList /></Layout>} />
              <Route path="/admin/servers" element={<Layout requireAuth requireAdmin><AdminServerList /></Layout>} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ServerProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
