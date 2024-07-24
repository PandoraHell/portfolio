import Link from "next/link";
import Image from "next/image";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
import { Button } from "../ui/button";
import { useMemo } from "react";
import { useEffect, useState } from "react";
import { getConcepts } from "@/app/lib/concepts";
import { getModels } from "@/app/lib/models"; 
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export function HomePage() {
  const [concepts, setConcepts] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [conceptData, modelData] = await Promise.all([getConcepts(), getModels()]);
        setConcepts(conceptData);
        setModels(modelData);
      } catch (error) {
        setError("Error");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const transformedData = useMemo(() => {
    return [...concepts, ...models].slice(0, 9).map(item => ({
      ...item,
      image_url: item.images && item.images.length > 0 ? item.images[0] : "/placeholder.svg" 
    }));
  }, [concepts, models]);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="relative h-[30vh] w-full overflow-hidden">
        <img src="/PORTADA-TEMPORAL.png" alt="Background" className="object-cover" />
      </div>
      <div className="flex min-h-screen flex-col" style={{
        backgroundImage: "url('/BG_WEB.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>
        <nav className="bg-white py-4 shadow">
          <div className="container mx-auto flex justify-center space-x-8">
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
          </div>
        </nav>
        <div className="container mx-auto my-12 px-4 flex justify-center items-center">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <Carousel className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {transformedData.map((item, index) => (
                    <CarouselItem key={index}>
                        <Link href={`/detail/${item.id}`} legacyBehavior>
                            <a>
                                <Image
                                    src={item.image_url}
                                    alt={item.title}
                                    width={300}
                                    height={400}
                                    className="rounded-lg object-cover transition-transform duration-300 ease-in-out hover:-translate-y-2 hover:shadow-lg"
                                />
                            </a>
                        </Link>
                    </CarouselItem>
                ))}
            </Carousel>
          )}
        </div>
      </div>
    </div>
  );
}
