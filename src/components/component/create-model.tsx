"use client";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createModel } from "@/app/lib/models";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../ui/card";
import { StorageError } from "@supabase/storage-js";

export function CreateModel() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [is_completed, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const supabaseStorageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validación de campos obligatorios
      if (!title || !description) {
        setError("El título y la descripción son obligatorios.");
        setIsLoading(false);
        return;
      }

      // Subir imágenes y videos (si hay)
      const imageUrls = await Promise.all(
        (imageFiles ? Array.from(imageFiles) : []).map(async (file) => {
          if (!file) {
            throw new Error("No se ha seleccionado una imagen válida");
          }
          const { data, error } = await supabase.storage
            .from("portfolioammy")
            .upload(`${Math.random()}-${file.name}`.replace(/\s/g, ""), file);

          if (error) {
            throw new Error("Error al subir la imagen: " + error.message);
          }

          if (data) {
            const publicUrl = `${supabaseStorageUrl}/portfolioammy/${data.path}`;
            return publicUrl;
          } else {
            throw new Error("Error inesperado al subir la imagen");
          }
        })
      );

      let videoUrl: string | null = null;
      if (videoFile) {
        const { data, error } = await supabase.storage
          .from("portfolioammy") // Nombre de tu bucket de videos
          .upload(`${Math.random()}-${videoFile.name}`, videoFile);

        if (error) {
          throw new Error("Error al subir el video: " + error.message);
        }

        if (data) {
          videoUrl = `${supabaseStorageUrl}/portfolioammy/${data.path}`;
        } else {
          throw new Error("Error inesperado al subir el video");
        }
      }

      // Crear el modelo
      const newModel = {
        title,
        subtitle,
        description,
        images: imageUrls, 
        video: videoUrl,
        created_at: new Date().toISOString(),
        is_completed,
      };

      await createModel(newModel);

      router.push("/dashboard/models");
    } catch (error: any) {
      console.error("Error al crear el modelo:", error);
      setError(error.message || "Error al crear el modelo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar la cancelación
  const handleCancel = () => {
    router.push("/models"); // Redirige a la lista de modelos
  };

  return (
    <Card className="w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Create New Model</CardTitle>
          <CardDescription>
            Fill out the form below to create a new model for your project.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campos de entrada */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter a title for your model"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                placeholder="Enter a subtitle for your model (optional)"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter a description for your model"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Campo de imagen */}
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFiles(e.target.files)} // Guardar todos los archivos
                multiple // Permitir múltiples archivos
              />
            </div>
            {/* Campo de video */}
            <div className="space-y-2">
              <Label htmlFor="video">Video</Label>
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="flex items-center space-x-2">
            <Checkbox id="is_completed" checked={is_completed} onCheckedChange={() => setIsCompleted(!is_completed)} />
            <Label htmlFor="is_ompleted">Completed</Label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creando..." : "Create Model"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
