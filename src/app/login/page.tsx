import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { SocialAuthButtons } from "./social-auth-buttons";

export const metadata: Metadata = {
  title: "MetaWeb Dev Solutions",
};


export default function LoginPage() {
  return (
    <div className="grid min-h-dvh w-full gap-6 bg-[#0a0a0a] p-6 lg:grid-cols-2">
      {/* Panel izquierdo — imagen de marca */}
      <aside className="relative hidden overflow-hidden rounded-3xl lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/fondolog.png')" }}
        />

        {/*
        <div className="relative flex h-full flex-col items-center justify-center px-12 text-center text-white">
          <div className="mb-10 flex items-center ">
            <img
              src="/blancomw.svg"
              alt="MetaWeb Dev Solutions"
              className="h-16 w-auto"
            />
            <span className="text-lg font-semibold tracking-tight">
              MetaWeb Dev Solutions
            </span>
          </div>

          <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-tight text-balance">
            Bienvenido de nuevo
          </h2>
          <p className="mt-3 max-w-sm text-base leading-relaxed text-white/70">

          </p>
        </div>
        */}
      </aside>

      {/* Panel derecho — formulario */}
      <main className="flex flex-col rounded-3xl bg-[black] px-6 pt-16 pb-6 text-white sm:px-12 lg:px-20">
        <div className="mx-auto my-auto w-full max-w-sm">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="size-8 rounded-[10px] bg-brand" />
            <span className="text-sm font-semibold tracking-tight">
              MetaWeb Platform
            </span>
          </div>

          <h1 className="text-center text-3xl font-semibold tracking-tight">
            Iniciar sesión
          </h1>
          <p className="mt-2 text-center text-sm text-white/60">
            Ingresa tus credenciales para acceder a tu cuenta.
          </p>

          {/* Botones sociales */}
          <SocialAuthButtons />

          {/* Separador */}
          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-white/40">O</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <LoginForm />
        </div>
        <footer className="flex items-center justify-center gap-1.5 text-[11px] text-white/60 sm:text-xs">
          <span>Desarrollado por</span>
          <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden">
            <span
              aria-hidden="true"
              className="size-5 bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/blancomw.svg')",
                backgroundSize: "270% 270%",
              }}
            />
          </span>
          <span>MetaWeb Dev Solutions</span>
        </footer>
      </main>
    </div>
  );
}
