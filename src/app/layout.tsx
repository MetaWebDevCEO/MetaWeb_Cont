import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sileo";
import { CookieNotice } from "@/components/cookie-notice";
import "./globals.css";
import "sileo/styles.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MetaWeb Platform",
  description: "Plataforma para gestion de desarrollo y contaduria",
  icons: {
    icon: { url: "/metaweb-icon.svg", type: "image/svg+xml" },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <CookieNotice />
        <Toaster position="top-right" theme="system" />
      </body>
    </html>
  );
}
