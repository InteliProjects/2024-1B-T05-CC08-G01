// Importações
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider/theme-provider";
import { Footer } from "@/components/footer/footer";
import { Toaster } from "@/components/ui/toaster";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Fofuxo",
  description: "Fofuxo is a full-stack web application built with Next.js, flask, and PostgreSQL.",
};

// Definindo o componente RootLayout para servir como layout padrão da aplicação
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      
      <body className={
        cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )
      }>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          {/* <Footer /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
