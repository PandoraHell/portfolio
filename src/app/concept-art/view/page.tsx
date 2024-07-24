"use client";

import { useAuth } from "@/components/component/AuthProvider";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import Link from "next/link";

export default function viewConcept() {
    const { session } = useAuth();

    return (
        <div className="flex flex-col min-h-screen" style={{
            backgroundImage: "url('/BG_WEB.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            <div className="relative h-[30vh] w-full overflow-hidden">
                <img src="/PORTADA-TEMPORAL.png" alt="Background" className="object-cover" />
            </div>
            <header className="container mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="bg-white py-4 shadow w-full flex justify-center space-x-8">
                    <Button>
                        <Link href="/" className="text-lg font-medium hover:text-primary transition-colors" prefetch={false}>
                            Home
                        </Link>
                    </Button>
                    <Button>
                        <Link href="/models" className="text-lg font-medium hover:text-primary transition-colors" prefetch={false}>
                            Models
                        </Link>
                    </Button>
                    <Button>
                        <Link href="/concept-art" className="text-lg font-medium hover:text-primary transition-colors" prefetch={false}>
                            Concept Art
                        </Link>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button className="text-lg font-medium hover:text-primary transition-colors">
                                Works
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <Link href="/works/completed" prefetch={false}>
                                <DropdownMenuItem>Completed</DropdownMenuItem>
                            </Link>
                            <Link href="/works/not-completed" prefetch={false}>
                                <DropdownMenuItem>Not Completed</DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>
                <Sheet>
                    {/* ... (Mobile menu remains the same) */}
                </Sheet>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4 py-12 relative">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold">Futuristic Mech Suit</h1>
                        <p className="text-muted-foreground text-lg">Cutting-edge exosuit technology</p>
                    </div>
                    <div className="text-muted-foreground leading-relaxed">
                        <p>
                            Introducing the Futuristic Mech Suit, a groundbreaking exosuit that combines advanced robotics, cutting-edge materials, and intuitive controls. Designed to enhance human capabilities, this suit empowers the wearer to tackle even the most demanding tasks with ease and precision.
                        </p>
                        <p className="mt-4">
                            Featuring a sleek, aerodynamic design, the Mech Suit is built to withstand the rigors of the most challenging environments. Its powerful actuators and responsive sensors allow for seamless integration with the user's movements, creating a symbiotic relationship between man and machine.
                        </p>
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Use Image component for proper image handling */}
                        {[...Array(4)].map((_, i) => (
                          <Image
                            key={i}
                            src="/placeholder.svg"
                            alt="Model Image"
                            width={300}
                            height={300}
                            className="object-cover rounded-lg cursor-pointer"
                          />
                        ))}
                    </div>
                    <div className="aspect-video rounded-lg overflow-hidden">
                        <video controls>
                            <source src="/video.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>
        </div>
    )
}
