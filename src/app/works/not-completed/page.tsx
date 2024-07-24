"use client";

import { useAuth } from "@/components/component/AuthProvider";
import { NotCompleted } from "@/components/component/not-completed";

export default function notCompletedHome() {
  const { session } = useAuth();

  return (
    <NotCompleted/>
  );
}
