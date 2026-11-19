"use client";

import * as React from "react";
import { cn } from "cn";

const STORAGE_KEY = "metaweb-cookie-notice";
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(STORAGE_KEY) !== null;
}

function getServerSnapshot() {
  return true;
}

/**
 * Aviso de cookies. Se muestra hasta que el usuario lo acepta.
 */
export function CookieNotice() {
  const accepted = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [isLeaving, setIsLeaving] = React.useState(false);

  if (accepted) return null;

  function saveAcceptance() {
    window.localStorage.setItem(STORAGE_KEY, "accepted");
    listeners.forEach((listener) => listener());
  }

  function accept() {
    if (isLeaving) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      saveAcceptance();
      return;
    }

    setIsLeaving(true);
  }

  function finishExit(event: React.AnimationEvent<HTMLDivElement>) {
    if (isLeaving && event.target === event.currentTarget) {
      saveAcceptance();
    }
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-start p-4 sm:p-6">
      <div
        role="region"
        aria-label="Aviso de cookies"
        onAnimationEnd={finishExit}
        className={cn(
          "pointer-events-auto flex w-full max-w-sm flex-col gap-4 rounded-3xl border border-border bg-white p-4 text-black shadow-[0_8px_30px_rgba(0,0,0,0.18)] sm:p-5",
          isLeaving
            ? "animate-out fade-out slide-out-to-bottom-2 duration-200"
            : "animate-in fade-in slide-in-from-bottom-2 duration-300",
        )}
      >
        <div className="flex flex-col gap-2">
          <h2
            id="cookie-notice-title"
            className="text-lg font-semibold tracking-tight"
          >
            Elige tus cookies
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Este sitio usa cookies necesarias para su funcionamiento y para
            mantener tu sesión activa. Al continuar navegando aceptas su uso.
          </p>
        </div>
        <button
          type="button"
          onClick={accept}
          disabled={isLeaving}
          className={cn(
            "inline-flex min-h-10 w-fit self-end items-center justify-center rounded-full bg-[#0d4229] px-5 py-2 text-sm font-medium text-white",
            "shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]",
            "transition-all duration-300 hover:bg-black hover:text-white active:scale-[0.98]",
          )}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}
