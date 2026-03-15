import {
  LayoutDashboard,
  UserPlus,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  LogOut,
  Baby,
  FileText,
  ListChecks,
  CheckSquare,
  Clock3,
  AlertTriangle,
  ChevronDown,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo.png";

const parentItems = [
  { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
  { title: "Inscrire un enfant", url: "/dashboard/inscrire", icon: UserPlus },
  { title: "Mes enfants", url: "/dashboard/mes-enfants", icon: Baby },
  { title: "Mes inscriptions", url: "/dashboard/inscriptions", icon: FileText },
];

const adminItems = [
  { title: "Tableau de bord", url: "/dashboard/admin", icon: LayoutDashboard },
  { title: "Liste des inscriptions", url: "/dashboard/liste-inscriptions", icon: ClipboardList },
  { title: "Statistiques", url: "/dashboard/statistiques", icon: BarChart3 },
];

const superAdminItems = [
  { title: "Tableau de bord", url: "/dashboard/super-admin", icon: LayoutDashboard },
  { title: "Liste des inscriptions", url: "/dashboard/liste-inscriptions", icon: ClipboardList },
  { title: "Statistiques", url: "/dashboard/statistiques", icon: BarChart3 },
  { title: "Utilisateurs", url: "/dashboard/utilisateurs", icon: Users },
  { title: "Paramètres", url: "/dashboard/parametres", icon: Settings },
];

const gestionListesSubItems = [
  { title: "Liste principale", url: "/dashboard/gestion-listes/principale", icon: CheckSquare },
  { title: "Liste d'attente N°1", url: "/dashboard/gestion-listes/attente-1", icon: Clock3 },
  { title: "Liste d'attente N°2", url: "/dashboard/gestion-listes/attente-2", icon: AlertTriangle },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;
  const isGestionListesActive = location.pathname.startsWith("/dashboard/gestion-listes");

  const role = currentUser?.role;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderMenuItems = (items: typeof parentItems, label: string) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-sidebar-foreground/40 text-xs uppercase tracking-wider">
        {!collapsed && label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.url)}
                tooltip={item.title}
              >
                <NavLink
                  to={item.url}
                  end
                  className="hover:bg-sidebar-accent/50 transition-colors"
                  activeClassName="bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                >
                  <item.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          {/* Gestion des listes - collapsible submenu for admin/super_admin */}
          {(role === "admin" || role === "super_admin") && (
            <Collapsible defaultOpen={isGestionListesActive} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip="Gestion des listes"
                    isActive={isGestionListesActive}
                    className="hover:bg-sidebar-accent/50 transition-colors"
                  >
                    <ListChecks className="w-4 h-4 mr-2 flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1">Gestion des listes</span>
                        <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </>
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {gestionListesSubItems.map((sub) => (
                      <SidebarMenuSubItem key={sub.url}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={isActive(sub.url)}
                        >
                          <NavLink
                            to={sub.url}
                            end
                            className="hover:bg-sidebar-accent/50 transition-colors"
                            activeClassName="bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                          >
                            <sub.icon className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                            <span>{sub.title}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo CSS" className="w-10 h-10 rounded-full shadow-md flex-shrink-0" />
          {!collapsed && (
            <div className="overflow-hidden">
              <h2 className="text-sm font-bold text-sidebar-foreground truncate">CSS Colonie</h2>
              <p className="text-xs text-sidebar-foreground/60 truncate">Vacances 2026</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {role === "parent" && renderMenuItems(parentItems, "Espace Parent")}
        {role === "admin" && renderMenuItems(adminItems, "GESTIONNAIRE")}
        {role === "super_admin" && renderMenuItems(superAdminItems, "Super Administration")}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Réduire le menu"
              onClick={toggleSidebar}
              className="hover:bg-sidebar-accent/50 text-sidebar-foreground/70"
            >
              {collapsed ? <PanelLeft className="w-4 h-4 mr-2" /> : <PanelLeftClose className="w-4 h-4 mr-2" />}
              {!collapsed && <span>Réduire</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Déconnexion"
              onClick={handleLogout}
              className="hover:bg-destructive/20 text-sidebar-foreground/70 hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              {!collapsed && <span>Déconnexion</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
