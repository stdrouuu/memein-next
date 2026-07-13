"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import dynamic from "next/dynamic"

const GoeyToaster = dynamic(
  () => import("goey-toast").then((mod) => mod.GoeyToaster),
  { ssr: false }
)

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      {children}
      <GoeyToaster position="bottom-right" />
    </NextThemesProvider>
  )
}