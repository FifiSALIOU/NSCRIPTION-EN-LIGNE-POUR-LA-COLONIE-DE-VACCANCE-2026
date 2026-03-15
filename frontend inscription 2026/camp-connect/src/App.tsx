import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { InscriptionsProvider } from "@/context/InscriptionsContext";
import RequireAuth from "@/components/auth/RequireAuth";
import RoleGuard from "@/components/auth/RoleGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import InscrireEnfant from "./pages/InscrireEnfant";
import MesEnfants from "./pages/MesEnfants";
import MesInscriptions from "./pages/MesInscriptions";
import ListeInscriptions from "./pages/ListeInscriptions";
import GestionListePrincipale from "./pages/GestionListePrincipale";
import GestionListeAttente1 from "./pages/GestionListeAttente1";
import GestionListeAttente2 from "./pages/GestionListeAttente2";
import Statistiques from "./pages/Statistiques";
import Utilisateurs from "./pages/Utilisateurs";
import Parametres from "./pages/Parametres";
import DashboardLayout from "./components/DashboardLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <InscriptionsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <DashboardLayout />
                  </RequireAuth>
                }
              >
                {/* Parent routes */}
                <Route index element={<Dashboard />} />
                <Route path="inscrire" element={<RoleGuard allowedRoles={["parent"]}><InscrireEnfant /></RoleGuard>} />
                <Route path="mes-enfants" element={<RoleGuard allowedRoles={["parent"]}><MesEnfants /></RoleGuard>} />
                <Route path="inscriptions" element={<RoleGuard allowedRoles={["parent"]}><MesInscriptions /></RoleGuard>} />

                {/* Admin routes */}
                <Route path="admin" element={<RoleGuard allowedRoles={["admin"]}><AdminDashboard /></RoleGuard>} />
                <Route path="liste-inscriptions" element={<RoleGuard allowedRoles={["admin", "super_admin"]}><ListeInscriptions /></RoleGuard>} />
                <Route path="gestion-listes/principale" element={<RoleGuard allowedRoles={["admin", "super_admin"]}><GestionListePrincipale /></RoleGuard>} />
                <Route path="gestion-listes/attente-1" element={<RoleGuard allowedRoles={["admin", "super_admin"]}><GestionListeAttente1 /></RoleGuard>} />
                <Route path="gestion-listes/attente-2" element={<RoleGuard allowedRoles={["admin", "super_admin"]}><GestionListeAttente2 /></RoleGuard>} />
                <Route path="statistiques" element={<RoleGuard allowedRoles={["admin", "super_admin"]}><Statistiques /></RoleGuard>} />

                {/* Super Admin routes */}
                <Route path="super-admin" element={<RoleGuard allowedRoles={["super_admin"]}><SuperAdminDashboard /></RoleGuard>} />
                <Route path="utilisateurs" element={<RoleGuard allowedRoles={["super_admin"]}><Utilisateurs /></RoleGuard>} />
                <Route path="parametres" element={<RoleGuard allowedRoles={["super_admin"]}><Parametres /></RoleGuard>} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </InscriptionsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
