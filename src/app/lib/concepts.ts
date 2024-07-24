import { supabase } from "./supabase"; // Asegúrate de importar tu cliente Supabase

export async function getConcepts() {
  const { data, error } = await supabase.from("concept").select("*");
  if (error) throw error;
  return data;
}

export async function getConceptById(conceptId: number) {
  const { data, error } = await supabase
    .from("concept")
    .select("*")
    .eq("id", conceptId)
    .single();
  if (error) throw error;
  return data;
}

export async function createConcept(conceptData: any) {
  const { data, error } = await supabase.from("concept").insert([conceptData]);
  if (error) throw error;
  return data;
}

export async function updateConcept(conceptId: number, updatedData: any) {
  const { data, error } = await supabase
    .from("concept")
    .update(updatedData)
    .eq("id", conceptId);
  if (error) throw error;
  return data;
}

export async function deleteConcept(conceptId: number) {
  const { data, error } = await supabase.from("concept").delete().eq("id", conceptId);
  if (error) throw error;
  return data;
}