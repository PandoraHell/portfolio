import { supabase } from "./supabase"; // Asegúrate de importar tu cliente Supabase

export async function getModels() {
  const { data, error } = await supabase.from("models").select("*");
  if (error) throw error;
  return data;
}

export async function getModelById(modelId: number) {
  const { data, error } = await supabase
    .from("models")
    .select("*")
    .eq("id", modelId)
    .single();
  if (error) throw error;
  return data;
}

export async function createModel(modelData: any) {
  const { data, error } = await supabase.from("models").insert([modelData]);
  if (error) throw error;
  return data;
}

export async function updateModel(modelId: number, updatedData: any) {
  const { data, error } = await supabase
    .from("models")
    .update(updatedData)
    .eq("id", modelId);
  if (error) throw error;
  return data;
}

export async function deleteModel(modelId: number) {
  const { data, error } = await supabase.from("models").delete().eq("id", modelId);
  if (error) throw error;
  return data;
}