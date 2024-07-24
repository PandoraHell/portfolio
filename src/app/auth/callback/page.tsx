"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from "@/app/lib/supabase";
import { VerifyOtpParams, VerifyEmailOtpParams, VerifyTokenHashParams } from "@supabase/supabase-js";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code") || "";
        const type = urlParams.get("type") as VerifyOtpParams['type'] || "";

        let error;
        if (type === 'signup' || type === 'email_change') {
          ({ error } = await supabase.auth.verifyOtp({
            type,
            email: code,
          } as VerifyEmailOtpParams));
        } else if (type === 'recovery') {
          ({ error } = await supabase.auth.verifyOtp({
            type,
            token_hash: code,
          } as VerifyTokenHashParams));
        } else {
          throw new Error("Tipo de verificación no válido");
        }

        if (error) {
          console.error("Error al verificar la autenticación:", error);
          setError(error.message); // Mostrar el error en la página
        } else {
          if (type === 'recovery') {
            router.push("/auth/reset-password"); // Redirigir a restablecer contraseña
          } else {
            router.push("/auth/confirm"); // Redirigir a la página de confirmación
          }
        }
      } catch (error) {
        console.error("Error en el callback de autenticación:", error);
        setError("Error inesperado en el proceso de autenticación."); // Mostrar error genérico
      } finally {
        setIsLoading(false); // Indicar que la verificación ha terminado
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div>
      {isLoading ? (
        <p>Verificando...</p> 
      ) : error ? (
        <div>
          <p className="text-red-500">Error: {error}</p>
          {/* Opcionalmente, puedes agregar un botón para volver a intentar la verificación */}
        </div>
      ) : (
        // Si no hay error y no está cargando, significa que la verificación fue exitosa
        // Puedes mostrar un mensaje de éxito o redirigir automáticamente
        <p>Verificación exitosa. Redirigiendo...</p> 
      )}
    </div>
  );
}
