// app/dashboard/layout.tsx
"use client"; // This indicates client-side rendering

import { usePathname, useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { AuthProvider, useAuth } from "@/components/component/AuthProvider";
import "@/app/globals.css";
import { useEffect } from "react";

// Metadata (dynamic title)
import { useSearchParams } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams(); 

  const pageTitle = searchParams.get("pageTitle") || "Dashboard";


  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
