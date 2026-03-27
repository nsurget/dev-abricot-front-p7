import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { getAuthUser } from "@/lib/auth-server";
import AuthStoreInitializer from "@/components/auth/AuthStoreInitializer";


const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abricot - Gestion de projets",
  description: "Application de gestion de projets",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, token } = await getAuthUser();

  return (
    <html
      lang="fr"
      className={`${manrope.variable} ${inter.variable} h-full antialiased font-inter`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AuthStoreInitializer user={user} token={token} />
        {children}
      </body>
    </html>
  );
}
