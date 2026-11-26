import { Suspense } from "react";
import { connection } from "next/server";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";

export default function PlatformLayout({ children }: LayoutProps<"/platform">) {
  return (
    <SidebarProvider className="dark">
      <Suspense fallback={<AppSidebar />}>
        <SidebarWithSession />
      </Suspense>

      <SidebarInset className="min-w-0">
        <header className="flex h-14 shrink-0 items-center px-4">
          <SidebarTrigger />
        </header>

        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

async function SidebarWithSession() {
  // La lectura de la sesión es dependiente de la petición y del reloj (Supabase
  // compara la expiración del token con la hora actual), así que se marca como
  // dinámica antes de tocar Supabase.
  await connection();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AppSidebar
      user={{
        name: user?.user_metadata?.full_name ?? user?.email ?? "",
        email: user?.email ?? "",
        avatar: user?.user_metadata?.avatar_url ?? "",
      }}
    />
  );
}
