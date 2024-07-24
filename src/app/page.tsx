"use client";

import { useAuth } from "@/components/component/AuthProvider";
import {HomePage} from "@/components/component/home-page";

export default function Home() {
  const { session } = useAuth();

  return (
    <HomePage/>
  );
}
