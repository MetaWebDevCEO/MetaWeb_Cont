"use client";

import { createClient } from "@/lib/supabase/client";
import { GlowButton } from "@/components/ui/glow-button";
import { GoogleIcon, GithubIcon } from "./icons";

export function SocialAuthButtons() {
  const signInWithGoogle = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Error al iniciar sesión con Google:", error.message);
    }
  };

  const signInWithGithub = async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Error al iniciar sesión con GitHub:", error.message);
    }
  };

  return (
    <div className="mt-8 grid grid-cols-2 gap-3">
      <GlowButton type="button" onClick={signInWithGoogle} className="w-full">
        <GoogleIcon className="size-4" />
        Google
      </GlowButton>

      <GlowButton type="button" onClick={signInWithGithub} className="w-full">
        <GithubIcon className="size-4" />
        Github
      </GlowButton>
    </div>
  );
}
