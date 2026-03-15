import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { ROLE_LABELS } from "@/types/app";

const DashboardLayout = () => {
  const { currentUser } = useAuth();

  const initials = currentUser
    ? `${currentUser.prenom[0]}${currentUser.nom[0]}`.toUpperCase()
    : "??";

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-end border-b bg-card px-4 lg:px-6 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="w-9 h-9 border-2 border-secondary/30">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{currentUser?.prenom} {currentUser?.nom}</p>
                  <p className="text-xs text-muted-foreground">{currentUser ? ROLE_LABELS[currentUser.role] : ""}</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
