"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { getConceptById, updateConcept } from "@/app/lib/concepts";
import { supabase } from "@/app/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { StorageError } from "@supabase/storage-js";
import Image from "next/image";
import { XIcon, PlusIcon, UploadIcon } from "lucide-react";

interface Concept {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  images: string[]; 
  created_at: string;
}

const supabaseStorageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/portfolioammy/";

export function ConceptsEdit() {
  const router = useRouter();
  const params = useParams();
  const conceptId = Number(params.conceptId);
  const [concept, setConcept] = useState<Concept | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    async function fetchConcept() {
      try {
        const data = await getConceptById(conceptId);
        setConcept(data);
      } catch (err) {
        console.error("Error fetching model:", err);
        setError("Error al cargar el modelo.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchConcept();
  }, [conceptId]);

  // Handlers para cambios en los campos del formulario
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConcept((prevConcept) =>
      prevConcept ? { ...prevConcept, title: e.target.value } : prevConcept
    );
  };

  const handleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConcept((prevConcept) =>
      prevConcept ? { ...prevConcept, subtitle: e.target.value } : prevConcept
    );
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setConcept((prevConcept) =>
      prevConcept ? { ...prevConcept, description: e.target.value } : prevConcept
    );
  };


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsLoading(true);
      setError(null);
  
      const files = Array.from(e.target.files);
      const newImages: string[] = []; 
  
      for (const file of files) {
        const fileName = `${Math.random()}-${file.name}`.replace(/\s/g, "");
        const { data, error: uploadError } = await supabase.storage
          .from("portfolioammy") 
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });
  
        if (uploadError) {
          console.error("Error al subir la imagen:", uploadError);
          setError("Error al subir la imagen.");
          return;
        }
  
        if (data) {
          const publicUrl = `${supabaseStorageUrl}/${data.path}`;
          newImages.push(publicUrl);
        } else {
          throw new Error("Error inesperado al subir la imagen");
        }
      }
      
      setConcept((prevConcept) => {
        if (prevConcept) {
          return {
            ...prevConcept,
            images: [...prevConcept.images, ...newImages],
          };
        }
        return null
      });
  
      setIsLoading(false);
    }
  };
  
  

  const handleDeleteImage = async (imageUrl: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta imagen?")) {
      try {
        const fileName = imageUrl.split("/").pop();
        const { error: storageError } = await supabase.storage
          .from("portfolioammy") 
          .remove([fileName as string]); 
        if (storageError) throw storageError;
  
        setConcept((prevConcept) => {
          if (prevConcept) {
            return {
              ...prevConcept,
              images: prevConcept.images.filter((img: string) => img !== imageUrl),
            };
          }
          return prevConcept; 
        });
  
      } catch (error) {
        console.error("Error al eliminar la imagen:", error);
        setError("Error al eliminar la imagen.");
      }
    }
  };
  

  

  const handleSaveChanges = async () => {
    if (concept) {
      setIsLoading(true);
      setError(null);

      try {
        await updateConcept(concept.id, concept); 
        setIsEditing(false);
        alert("Concept actualizado con éxito.");
        router.push("/dashboard/concept-art");
      } catch (error) {
        console.error("Error al actualizar el concept:", error);
        setError("Error al actualizar el concept.");
      } finally {
        setIsLoading(false);
      }
    }
  };


  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Concept</h1>
      <div className="mb-4">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={concept?.title || ""}
          onChange={handleTitleChange}
          disabled={!isEditing}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={concept?.subtitle || ""}
          onChange={handleSubtitleChange}
          disabled={!isEditing}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={concept?.description || ""}
          onChange={handleDescriptionChange}
          disabled={!isEditing}
        />
      </div>

      <div className="mb-4">
        <Label>Imágenes</Label>
        <div className="flex gap-2 flex-wrap">
          {concept?.images &&
            concept.images.map((image, index) => (
              <Card key={index} className="relative w-32 h-32">
                <CardContent className="absolute top-0 right-0 z-10">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteImage(image)}
                    disabled={!isEditing}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </CardContent>
                <Image src={image} alt={`Image ${index}`} layout="fill" />
              </Card>
            ))}
        </div>
        {isEditing && (
          <div className="mt-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              multiple
            />
          </div>
        )}
      </div>

      <div className="flex justify-end mt-4">
        {isEditing ? (
          <>
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="mr-2"
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Edit</Button>
        )}
      </div>
    </div>
  );
}

export default ConceptsEdit;
