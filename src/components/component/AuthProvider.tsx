"use client";
import { useState, useEffect, createContext, useContext, SetStateAction } from "react";
import { Session, AuthChangeEvent, ResendParams } from "@supabase/supabase-js";
import { supabase } from "@/app/lib/supabase";

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>; // No recibe email como argumento
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resendVerificationEmail: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setIsLoading(false);
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: SetStateAction<Session | null>) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const resendVerificationEmail = async () => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
  
      if (sessionError) {
        throw sessionError; 
      }
  
      if (!session || !session.user || !session.user.email) {
        throw new Error("No se pudo encontrar el correo electrónico del usuario.");
      }
  
      const { error } = await supabase.auth.resend({
        email: session.user.email,
        type: "signup",
      } as ResendParams);
  
      if (error) throw error;
    } catch (error: any) {
      if (error.name === "AuthApiError" && error.status === 400) {
        throw new Error("El usuario ya ha sido verificado.");
      } else {
        throw new Error("Error al reenviar el correo de verificación.");
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        resendVerificationEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};


