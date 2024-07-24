"use client";
import { useAuth } from "@/components/component/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "./src/app/lib/supabase";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [checked, setChecked] = useState(false); 

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/dashboard");
        console.log(session)
      } else {
        setChecked(true);
        console.log(session) // Marcar que la verificación se ha completado
      }
    };
    checkAuth(); // Realiza la verificación al cargar el componente
  }, [router]);

  // Renderizado condicional
  if (isLoading || !checked) {
    return <p>Cargando...</p>; // Mostrar un indicador de carga mientras se verifica
  } else if (!session) {
    return null; // No renderizar nada si no hay sesión después de la verificación
  } else {
    return <>{children}</>; // Mostrar el contenido protegido si hay sesión
  }
};

export default ProtectedRoute;
