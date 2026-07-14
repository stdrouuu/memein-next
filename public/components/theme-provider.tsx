"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import dynamic from "next/dynamic"

const GooeyToaster = dynamic(
  () => import("goey-toast").then((mod) => mod.GooeyToaster),
  { ssr: false }
)

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      {children}
      <GooeyToaster position="bottom-right" closeButton="bottom-right" />
    </NextThemesProvider>
  )
}