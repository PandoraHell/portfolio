"use client";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { JSX, SVGProps } from "react";
import { useRouter } from "next/navigation";
import { ModelsList } from "@/components/component/models-list";
import { useAuth } from "@/components/component/AuthProvider";
import { CreateModel } from "@/components/component/create-model";

export default function ConceptArtPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLinkHovered, setLinkHovered] = useState(false);
  const { session, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleMouseOver = () => setSidebarOpen(true);
    const handleMouseOut = () => setSidebarOpen(false);

    const sidebarElement = document.getElementById("sidebar");

    if (sidebarElement) {
      sidebarElement.addEventListener("mouseover", handleMouseOver);
      sidebarElement.addEventListener("mouseout", handleMouseOut);
    }

    return () => {
      if (sidebarElement) {
        sidebarElement.removeEventListener("mouseover", handleMouseOver);
        sidebarElement.removeEventListener("mouseout", handleMouseOut);
      }
    };
  }, []);

  const handleLinkMouseOver = () => setLinkHovered(true);
  const handleLinkMouseOut = () => setLinkHovered(false);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside
        id="sidebar"
        className={`z-10 flex w-14 flex-col border-r bg-background transition-width duration-300 ${
          isSidebarOpen ? "w-60" : "w-14"
        }`}
      >
        <div className="flex flex-col items-center gap-4 px-2 pt-4 sm:py-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground sm:h-12 sm:w-12">
            <span className="sr-only">Acme Inc</span>
            <MountainIcon className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div className="flex-1 sm:px-4">
            <div className="grid gap-2">
              <Link
                href="/"
                onMouseOver={handleLinkMouseOver}
                onMouseOut={handleLinkMouseOut}
                className="flex items-start gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                prefetch={false}
              >
                <HomeIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                {isSidebarOpen && <span className="text-sm font-medium sm:text-base">Home</span>}
              </Link>
              <Link
                href="/dashboard/works"
                onMouseOver={handleLinkMouseOver}
                onMouseOut={handleLinkMouseOut}
                className="flex items-start gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                prefetch={false}
              >
                <BriefcaseIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                {isSidebarOpen && <span className="text-sm font-medium sm:text-base">Works</span>}
              </Link>
              <Link
                href="/dashboard/concept-art"
                onMouseOver={handleLinkMouseOver}
                onMouseOut={handleLinkMouseOut}
                className="flex items-start gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                prefetch={false}
              >
                <BriefcaseIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                {isSidebarOpen && <span className="text-sm font-medium sm:text-base">Concept Art</span>}
              </Link>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-16 sm:px-6">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar..." className="w-full rounded-md bg-muted pl-8 sm:w-[300px]" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <BellIcon className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <CalendarIcon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Example</p>
                    <p className="text-sm text-muted-foreground">Hoy a las 3:00 pm</p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <BriefcaseIcon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Example</p>
                    <p className="text-sm text-muted-foreground">Hace 1 hora</p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success text-success-foreground">
                    <CheckIcon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Example</p>
                    <p className="text-sm text-muted-foreground">Hace 2 días</p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ver todas</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
            <div className="flex flex-col items-center gap-4 px-2 sm:py-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <img src="/placeholder.svg" width="36" height="36" className="rounded-full" alt="Avatar" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Configuration</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                <button onClick={handleLogout} className="flex items-center gap-2">
                  <LogOutIcon className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 sm:p-6">
        <CreateModel />
        </main>
      </div>
    </div>
  );
}

const MountainIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18L9 6l6 12" />
    <path d="M9 6L21 18H3z" />
  </svg>
);
const HomeIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.75L12 3l9 6.75v10.5A1.5 1.5 0 0119.5 21h-15A1.5 1.5 0 013 20.25V9.75z" />
    <path d="M9 21V12h6v9" />
  </svg>
);
const BriefcaseIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 3H8v4h8V3z" />
  </svg>
);
const BellIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8a6 6 0 00-12 0v4.5a3 3 0 01-1.5 2.62V17h15v-1.88a3 3 0 01-1.5-2.62V8z" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);
const SearchIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);
const CalendarIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </svg>
);
const UsersIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const WalletIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12v10H2V2h14" />
    <path d="M22 6h-7a2 2 0 000 4h7v4H5V6h17z" />
  </svg>
);
const LogOutIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 17v-2a4 4 0 014-4h7a4 4 0 014 4v2" />
    <circle cx="12" cy="7" r="4" />
    <path d="M21 21l-4-4m0 0l4-4m-4 4H8" />
  </svg>
);
const CheckIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12l5 5L20 7" />
  </svg>
);
const ChevronRightIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);
