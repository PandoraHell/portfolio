"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { getModelById, updateModel } from "@/app/lib/models";
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

interface Model {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  images: string[]; // Array para almacenar las rutas de las imágenes en Supabase
  video?: string | null; // Ruta del video en Supabase Storage
  created_at: string;
}

const supabaseStorageUrl = process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/portfolioammy/";

export function ModelsEdit() {
  const router = useRouter();
  const params = useParams();
  const modelId = Number(params.modelId);
  const [model, setModel] = useState<Model | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    async function fetchModel() {
      try {
        const data = await getModelById(modelId);
        setModel(data);
      } catch (err) {
        console.error("Error fetching model:", err);
        setError("Error al cargar el modelo.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchModel();
  }, [modelId]);

  // Handlers para cambios en los campos del formulario
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModel((prevModel) =>
      prevModel ? { ...prevModel, title: e.target.value } : prevModel
    );
  };

  const handleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModel((prevModel) =>
      prevModel ? { ...prevModel, subtitle: e.target.value } : prevModel
    );
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setModel((prevModel) =>
      prevModel ? { ...prevModel, description: e.target.value } : prevModel
    );
  };


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsLoading(true);
      setError(null);
  
      const files = Array.from(e.target.files);
      const newImages: string[] = []; // Arreglo para almacenar las nuevas URL
  
      for (const file of files) {
        const fileName = `${Math.random()}-${file.name}`.replace(/\s/g, "");
        const { data, error: uploadError } = await supabase.storage
          .from("portfolioammy") // Nombre de tu bucket de imágenes
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
      
      setModel((prevModel) => {
        if (prevModel) {
          return {
            ...prevModel,
            images: [...prevModel.images, ...newImages],
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
  
        // Eliminar de Supabase Storage
        const { error: storageError } = await supabase.storage
          .from("portfolioammy") // Nombre de tu bucket de imágenes
          .remove([fileName as string]); // Obtener el nombre del archivo de la URL
        if (storageError) throw storageError;
  
        // Actualizar el estado local (con verificación de null)
        setModel((prevModel) => {
          if (prevModel) {
            return {
              ...prevModel,
              images: prevModel.images.filter((img: string) => img !== imageUrl),
            };
          }
          return prevModel; // Devolver prevModel (null) si es null
        });
  
      } catch (error) {
        console.error("Error al eliminar la imagen:", error);
        setError("Error al eliminar la imagen.");
      }
    }
  };
  

  // Función para subir video
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsLoading(true);
      setError(null);
  
      const file = e.target.files[0];
      const fileName = `${Math.random()}-${file.name}`.replace(/\s/g, "");
  
      try {
        const { data, error: uploadError } = await supabase.storage
          .from("portfolioammy") // Nombre de tu bucket de videos
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });
  
        if (uploadError) {
          console.error("Error al subir el video:", uploadError);
          setError("Error al subir el video.");
          return;
        }
  
        if (data) {
          const publicUrl = `${supabaseStorageUrl}/${data.path}`;
          setModel((prevModel) => ({
            ...(prevModel ?? {}),
            id: modelId,  // Asegurar que el id esté presente
            title: prevModel?.title || '',
            subtitle: prevModel?.subtitle || '',
            description: prevModel?.description || '',
            images: prevModel?.images || [], 
            video: publicUrl,
            created_at: prevModel?.created_at || new Date().toISOString()
          } as Model));
        } else {
          throw new Error("Error inesperado al subir el video");
        }
      } catch (error: any) {
        console.error("Error inesperado:", error);
        setError("Ocurrió un error inesperado.");
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const handleDeleteVideo = async () => {
    if (confirm("¿Estás seguro de que deseas eliminar este video?")) {
      try {
        if (model && model.video) { // Verificar si model y model.video están definidos
          // Extraer el nombre del archivo del video
          const fileName = model.video.split("/").pop(); 
  
          // Eliminar de Supabase Storage
          const { error } = await supabase.storage.from("portfolioammy").remove([fileName as string]);
          if (error) throw error;
  
          // Actualizar el estado local
          setModel((prevModel) => {
            if (prevModel) { // Verificar si prevModel no es null
              const { video, ...restOfModel } = prevModel; // Copiar el objeto sin video
              return restOfModel;
            }
            return prevModel; 
          });
  
        } else {
          setError("No hay video para eliminar."); // Manejar el caso donde no hay video
        }
      } catch (error) {
        console.error("Error al eliminar el video:", error);
        setError("Error al eliminar el video.");
      }
    }
  };
  

  const handleSaveChanges = async () => {
    if (model) {
      setIsLoading(true);
      setError(null);

      try {
        await updateModel(model.id, model); // Pasar model.id y model como argumentos
        setIsEditing(false);
        alert("Modelo actualizado con éxito.");
        router.push("/dashboard/models");
      } catch (error) {
        console.error("Error al actualizar el modelo:", error);
        setError("Error al actualizar el modelo.");
      } finally {
        setIsLoading(false);
      }
    }
  };


  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Editar Modelo</h1>
      <div className="mb-4">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={model?.title || ""}
          onChange={handleTitleChange}
          disabled={!isEditing}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="subtitle">Subtítulo</Label>
        <Input
          id="subtitle"
          value={model?.subtitle || ""}
          onChange={handleSubtitleChange}
          disabled={!isEditing}
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={model?.description || ""}
          onChange={handleDescriptionChange}
          disabled={!isEditing}
        />
      </div>

      <div className="mb-4">
        <Label>Imágenes</Label>
        <div className="flex gap-2 flex-wrap">
          {model?.images &&
            model.images.map((image, index) => (
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

      <div className="mb-4">
        <Label>Video</Label>
        {model?.video ? (
          <div className="relative">
            <video src={model.video} controls className="w-full h-64"></video>
            {isEditing && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteVideo}
                className="absolute top-0 right-0 z-10"
              >
                <XIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        ) : (
          isEditing && (
            <div>
              <Input type="file" accept="video/*" onChange={handleVideoUpload} />
            </div>
          )
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
            <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
          </>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Editar</Button>
        )}
      </div>
    </div>
  );
}

export default ModelsEdit;
