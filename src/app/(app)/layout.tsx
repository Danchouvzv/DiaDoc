"use client"; 

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/AppSidebar";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/providers/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-4 p-8">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }

  if (!user) {
    // This case should ideally be handled by the useEffect redirect,
    // but as a fallback, prevent rendering the layout if no user.
    return null; 
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/50 bg-background/80 px-4 backdrop-blur-md md:px-6 supports-[backdrop-filter]:bg-background/60">
          <div className="md:hidden"> 
            <SidebarTrigger />
          </div>
          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            {/* Header content can go here if needed */}
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname} 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1 p-4 md:p-6 lg:p-8"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </SidebarInset>
    </SidebarProvider>
  );
}
