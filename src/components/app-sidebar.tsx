"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronsUpDownIcon,
  CreditCardIcon,
  FolderPlusIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  ReceiptTextIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/client";

const navigation = [
  { title: "Dashboard", href: "/platform", icon: LayoutDashboardIcon },
  { title: "CFDI", href: "/platform/cfdi", icon: ReceiptTextIcon },
  { title: "Income", href: "/platform/ingresos", icon: TrendingUpIcon },
  { title: "Expenses", href: "/platform/egresos", icon: TrendingDownIcon },
  { title: "Payments", href: "/platform/payments", icon: CreditCardIcon },
  { title: "Contacts", href: "/platform/contactos", icon: UsersIcon },
  { title: "Wallet", href: "/platform/wallet", icon: WalletIcon },
] as const;

export type SessionUser = {
  name: string;
  email: string;
  avatar: string;
};

export function AppSidebar({ user }: { user?: SessionUser }) {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<div />}
              className="cursor-default hover:bg-transparent"
            >
              <Image
                src="/metaweb-icon.svg"
                alt=""
                width={32}
                height={32}
                unoptimized
                className="brightness-0 invert"
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">MetaWeb Dev</span>
                <span className="truncate text-xs">Finance</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigation.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  isActive={
                    item.href === "/platform"
                      ? pathname === "/platform"
                      : pathname.startsWith(item.href)
                  }
                  className="data-active:bg-brand-green! data-active:text-white!"
                >
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <div className="flex items-center justify-between">
            <SidebarGroupLabel className="flex-1">Materials</SidebarGroupLabel>
            <FolderPlusIcon
              aria-hidden="true"
              className="mr-2 size-4 text-muted-foreground"
            />
          </div>
        </SidebarGroup>
      </SidebarContent>

      {user ? (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <NavUser user={user} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      ) : null}
    </Sidebar>
  );
}

function NavUser({ user }: { user: SessionUser }) {
  const router = useRouter();
  const { isMobile } = useSidebar();

  const signOut = async () => {
    await createClient().auth.signOut();
    router.replace("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
        }
      >
        <Avatar>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{initials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">{user.name}</span>
          <span className="truncate text-xs">{user.email}</span>
        </div>
        <ChevronsUpDownIcon className="ml-auto" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuItem onClick={signOut}>
          <LogOutIcon />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
