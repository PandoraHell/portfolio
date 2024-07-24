"use client";

import { useAuth } from "@/components/component/AuthProvider";
import { CompletedHome } from "@/components/component/completed";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import Link from "next/link";

export default function Completed() {
    const { session } = useAuth();

    return (
        <CompletedHome/>
    )
}
