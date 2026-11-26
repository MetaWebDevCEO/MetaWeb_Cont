"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type EstadoLogin = { error: string | null };

// Valida las credenciales en el servidor y crea la sesión con las cookies que
// gestiona Supabase (ESPECIFICACIONES.md, sección 3.2).
export async function iniciarSesion(
  _estado: EstadoLogin,
  formData: FormData,
): Promise<EstadoLogin> {
  const correo = String(formData.get("email") ?? "").trim();
  const contrasena = String(formData.get("password") ?? "");

  if (!correo || !contrasena) {
    return { error: "Escribe tu correo y tu contraseña." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: correo,
    password: contrasena,
  });

  if (error) {
    // El mensaje es genérico a propósito: nunca revela si la cuenta existe ni
    // el detalle del error de Supabase (secciones 3.2 y 3.8).
    return { error: "Correo o contraseña incorrectos." };
  }

  redirect("/platform");
}
