import { Logo } from "@/components/navigation/Logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ReactNode } from "react";

export default function LandingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-20 max-w-screen-xl items-center justify-between px-4 md:px-6">
          <Link href="/landing" aria-label="DiaDoc Home">
            <Logo />
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" asChild className="text-base px-3 sm:px-4 py-2 h-auto">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="text-base px-4 sm:px-6 py-2 h-auto shadow-md hover:shadow-lg transition-shadow">
              <Link href="/register">Sign Up</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="py-10 bg-muted/30 border-t border-border/40">
        <div className="container text-center text-muted-foreground text-sm px-4 md:px-6">
          © {new Date().getFullYear()} DiaDoc. Your personal health companion. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
