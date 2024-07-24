"use client"; // Indica que es un componente del cliente
import { RegisterPage } from "@/components/component/register-page";

// Ya no necesitas estos imports:
// import { supabase } from "../lib/supabase";
// import { useState } from "react";

export default function Register() {
  // El estado y la lógica del formulario ahora están dentro de LoginPage

  return (
    <div className="container mx-auto w-[400px]">
      <RegisterPage />
    </div>
  );
}