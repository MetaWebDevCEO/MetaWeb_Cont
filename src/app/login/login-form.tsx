"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "./password-input";
import { iniciarSesion, type EstadoLogin } from "./actions";

const estadoInicial: EstadoLogin = { error: null };

function BotonEnviar() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="mt-8 h-11 w-full rounded-xl bg-[#133524] font-semibold text-white transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-white hover:text-black active:scale-[0.98] focus-visible:ring-white/50 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
    >
      {pending ? "Iniciando sesión..." : "Iniciar sesión"}
    </Button>
  );
}

export function LoginForm() {
  const [estado, formAction] = useActionState(iniciarSesion, estadoInicial);

  return (
    <form action={formAction}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email" className="text-white">
            Correo electrónico
          </FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nombre@empresa.com"
            className="h-11 border-white/20 bg-white px-3.5 text-foreground placeholder:text-muted-foreground focus-visible:border-[#1D6E47] focus-visible:ring-[#1D6E47]/40 [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill]:[-webkit-text-fill-color:inherit]"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="password" className="text-white">
            Contraseña
          </FieldLabel>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-11 border-white/20 bg-white px-3.5 text-foreground placeholder:text-muted-foreground focus-visible:border-[#1D6E47] focus-visible:ring-[#1D6E47]/40 [&:-webkit-autofill]:bg-white [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_white] [&:-webkit-autofill]:[-webkit-text-fill-color:inherit]"
          />
          <p className="text-xs text-white/40">
            Debe tener al menos 8 caracteres.
          </p>
        </Field>
      </FieldGroup>

      {estado.error ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-300"
        >
          {estado.error}
        </p>
      ) : null}

      <BotonEnviar />
    </form>
  );
}
