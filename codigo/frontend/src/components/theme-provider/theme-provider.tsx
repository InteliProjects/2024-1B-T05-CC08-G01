"use client"
// Adicionando imports de componentes, assets, hooks e libs
import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

// Definindo o componente ThemeProvider para adicionar temas
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}