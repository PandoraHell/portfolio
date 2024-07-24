"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { JSX, SVGProps } from "react";
import { useState, useEffect } from "react";
import { getConcepts, deleteConcept } from "@/app/lib/concepts"; // Importa las funciones desde tu archivo models.ts
import { useRouter } from 'next/navigation';
import Link from "next/link"; // Importa Link correctamente

export function ConceptList() {
  const [concepts, setConcepts] = useState<any[]>([]); // Tipado para modelos
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchConcepts() {
      try {
        const data = await getConcepts();
        setConcepts(data);
      } catch (error) {
        setError("Error al cargar los modelos.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchConcepts();
  }, []);

  const handleEdit = (conceptId: number) => {
    router.push(`/dashboard/concept-art/edit/${conceptId}`); // Redirige a /dashboard/edit/:modelId
  };

  const handleDelete = async (conceptId: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este modelo?")) {
      try {
        await deleteConcept(conceptId);
        setConcepts(concepts.filter((concept) => concept.id !== conceptId));
      } catch (error) {
        setError("Error al eliminar el modelo.");
      }
    }
  };

  return (
    <section className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Concept Art Management</h2>
        <Link href="/dashboard/concept-art/create">
          <Button
            size="sm"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#4338CA] px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-[#4338CA]/80 focus:outline-none focus:ring-2 focus:ring-[#4338CA] focus:ring-offset-2"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New Concept
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <p>Loading concepts...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Subtitle</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[120px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {concepts.map((concept) => (
                  <TableRow key={concept.id}>
                    <TableCell className="font-medium">{concept.title}</TableCell>
                    <TableCell>{concept.subtitle}</TableCell>
                    <TableCell>{concept.description}</TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(concept.id)}>
                        <FilePenIcon className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(concept.id)}>
                        <TrashIcon className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="bg-muted/40 px-6 py-3">
            {/* Pagination goes here */}
          </CardFooter>
        </Card>
      )}
    </section>
  );
}

function FilePenIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function PlusIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function TrashIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

const ChevronRightIcon = (props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);
