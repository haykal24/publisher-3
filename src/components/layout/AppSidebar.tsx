import { useState } from "react";
import { 
  Home, 
  BookOpen, 
  FileText, 
  BarChart3, 
  Target, 
  Calendar,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  LogOut,
  User
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { cn } from "@/lib/utils";

const mainMenuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Semua Buku", url: "/books", icon: BookOpen },
  { title: "Bank Naskah", url: "/manuscripts", icon: FileText },
  { title: "Analitik", url: "/analytics", icon: BarChart3 },
  { title: "Target", url: "/targets", icon: Target },
  { title: "Kalender", url: "/calendar", icon: Calendar },
];

const managementMenuItems = [
  { title: "Tim", url: "/team", icon: Users },
  { title: "Pengaturan", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { profile, signOut } = useAuth();
  const { canAccessMenu } = useRoleAccess();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  const [mainGroupOpen, setMainGroupOpen] = useState(true);
  const [managementGroupOpen, setManagementGroupOpen] = useState(true);

  const isActive = (path: string) => currentPath === path;

  const getNavClasses = (active: boolean) =>
    cn(
      "w-full justify-start transition-all duration-200",
      active 
        ? "bg-gradient-primary text-primary-foreground shadow-primary" 
        : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    );

  // Filter menu items based on user role
  const filteredMainMenuItems = mainMenuItems.filter(item => 
    canAccessMenu(item.title)
  );

  const filteredManagementMenuItems = managementMenuItems.filter(item => 
    canAccessMenu(item.title)
  );

  const shouldShowManagementGroup = filteredManagementMenuItems.length > 0;

  return (
    <Sidebar className={cn("border-r border-sidebar-border", collapsed ? "w-16" : "w-64")}>
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-sidebar-foreground">Book Management</h2>
              <p className="text-xs text-sidebar-foreground/60">RTG Publishing</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>Menu Utama</span>
            {!collapsed && (
              <button 
                onClick={() => setMainGroupOpen(!mainGroupOpen)}
                className="hover:bg-sidebar-accent rounded p-1"
              >
                {mainGroupOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
          </SidebarGroupLabel>
          
          {(mainGroupOpen || collapsed) && (
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredMainMenuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        className={getNavClasses(isActive(item.url))}
                      >
                        <item.icon className="w-5 h-5" />
                        {!collapsed && <span className="ml-3">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>

{shouldShowManagementGroup && (
          <SidebarGroup className="mt-8">
            <SidebarGroupLabel className="flex items-center justify-between">
              <span>Manajemen</span>
              {!collapsed && (
                <button 
                  onClick={() => setManagementGroupOpen(!managementGroupOpen)}
                  className="hover:bg-sidebar-accent rounded p-1"
                >
                  {managementGroupOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              )}
            </SidebarGroupLabel>
            
            {(managementGroupOpen || collapsed) && (
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredManagementMenuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={item.url} 
                          className={getNavClasses(isActive(item.url))}
                        >
                          <item.icon className="w-5 h-5" />
                          {!collapsed && <span className="ml-3">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        )}

        {/* User Profile and Logout */}
        <div className="mt-auto border-t border-sidebar-border pt-4">
          {!collapsed && (
            <div className="px-2 py-2 mb-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-medium text-sidebar-foreground truncate">
                    {profile?.full_name || profile?.email || 'User'}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    {profile?.role || 'Role'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <Button
            onClick={signOut}
            variant="ghost"
            className={cn(
              "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              collapsed ? "px-2" : "px-3"
            )}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}