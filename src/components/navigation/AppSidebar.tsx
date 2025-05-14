"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Logo } from "./Logo";
import { UserNav } from "./UserNav"; // Full UserNav for expanded state
import { LayoutDashboard, Apple, ActivitySquare, Smile, BarChart3, User as UserIcon, Settings, LifeBuoy, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth-provider"; // Updated import


const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/food-log", label: "Food Log", icon: Apple },
  { href: "/activity-log", label: "Activity Log", icon: ActivitySquare },
  { href: "/wellbeing-log", label: "Wellbeing Log", icon: Smile },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

const bottomNavItems = [
  { href: "/profile", label: "Profile", icon: UserIcon },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, signOut, loading } = useAuth(); // Use auth context

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
  }
  
  // Placeholder for loading state if needed, or for when user is null but not loading (shouldn't happen in protected layout)
  if (loading) {
    // Optionally return a loading state for the sidebar or null
    return null; 
  }


  return (
    <Sidebar collapsible="icon" className="shadow-lg border-r border-border/30"> {/* Added shadow and subtle border */}
      <SidebarHeader className="p-4 border-b border-border/20"> {/* Subtle border */}
        <Logo />
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                  tooltip={{ children: item.label, className: "group-data-[collapsible=icon]:block hidden" }}
                  className={cn(
                    "justify-start transition-all duration-200 ease-in-out group-hover/menu-item:pl-3", 
                    (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)))
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-inner"
                      : "hover:bg-sidebar-accent/70"
                  )}
                >
                  <a>
                    <item.icon className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover/menu-item:scale-110" />
                    <span className="truncate">{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto p-2 border-t border-border/20"> {/* Subtle border */}
         <SidebarMenu>
          {bottomNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{ children: item.label, className: "group-data-[collapsible=icon]:block hidden" }}
                  className={cn(
                    "justify-start transition-all duration-200 ease-in-out group-hover/menu-item:pl-3",
                     pathname === item.href 
                       ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold shadow-inner"
                       : "hover:bg-sidebar-accent/70"
                  )}
                >
                  <a>
                    <item.icon className="h-5 w-5 transition-transform duration-200 ease-in-out group-hover/menu-item:scale-110" />
                    <span className="truncate">{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        {/* UserNav for expanded sidebar */}
        <div className="mt-4 hidden group-data-[collapsible=icon]:hidden">
         {user && <UserNav />}
        </div>

        {/* Simplified UserNav for icon-only (collapsed) mode */}
        {user && (
          <div className="mt-4 flex justify-center group-data-[collapsible=icon]:block hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    {user.photoURL ? <AvatarImage src={user.photoURL} alt={user.displayName || "User"} data-ai-hint="profile person" /> : null}
                    <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 ml-2 mb-2" side="right" align="end" sideOffset={8}> {/* Pop out to the right */}
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link href="/profile" passHref>
                    <DropdownMenuItem>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/settings" passHref>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LifeBuoy className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
