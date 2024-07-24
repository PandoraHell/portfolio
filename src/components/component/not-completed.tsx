"use client";
import Link from "next/link";
import Image from "next/image";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { JSX, SVGProps, useMemo } from "react";
import { useState, useEffect } from "react";
import { getModels } from "@/app/lib/models";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { getConcepts } from "@/app/lib/concepts";

export function NotCompleted() {
  const [models, setModels] = useState<any[]>([]);
  const [concepts, setConcepts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [modelsData, conceptsData] = await Promise.all([getModels(), getConcepts()]);
        setModels(modelsData);
        setConcepts(conceptsData);
      } catch (err) {
        setError("Error al cargar los datos.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const transformedData = useMemo(() => {
    const allItems = [...models, ...concepts];
    return allItems
      .filter((item) => item.is_completed === false) // Filter for is_completed = false
      .slice(0, 25)
      .map((item) => ({
        ...item,
        image_url: item.images && item.images.length > 0 ? item.images[0] : "/placeholder.svg",
      }));
  }, [models, concepts]); 

  function setSelectedFilter(arg0: string): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex flex-col min-h-screen" style={{
      backgroundImage: "url('/BG_WEB.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
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
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
                {transformedData.map((item, index) => (
                  <Link key={index} href={`/detail/${item.id}`} className="group" prefetch={false}> 
                      <div className="overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out group-hover:-translate-y-2 group-hover:shadow-xl">
                        <Image
                          src={item.image_url || "/placeholder.svg"} // Fallback to placeholder if no image
                          alt={item.title}
                          width={400} // Adjust width as needed
                          height={300} // Adjust height as needed
                          className="h-64 w-full object-cover"
                        />
                        <div className="bg-background p-4">
                          <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                        </div>
                      </div>
                  </Link>
                ))}
              </div>
          )}
        </div>
      </section>
      <br />
      <br />
    </div>
  )
}

function MenuIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}


function XIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
