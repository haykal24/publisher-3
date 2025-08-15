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
  ChevronRight
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
                {mainMenuItems.map((item) => (
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
                {managementMenuItems.map((item) => (
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
      </SidebarContent>
    </Sidebar>
  );
}