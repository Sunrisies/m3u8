import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "StreamHub - Video Streaming Platform",
  description:
    "Discover and stream high-quality videos from creators around the world. Watch documentaries, tutorials, entertainment, and more.",
  generator: "v0.app",
  keywords: ["video streaming", "online videos", "documentaries", "tutorials", "entertainment"],
  authors: [{ name: "StreamHub" }],
  openGraph: {
    title: "StreamHub - Video Streaming Platform",
    description: "Discover and stream high-quality videos from creators around the world.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "StreamHub - Video Streaming Platform",
    description: "Discover and stream high-quality videos from creators around the world.",
  },
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    ],
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        <ThemeProvider defaultTheme="system" storageKey="streamhub-theme">
          <Suspense fallback={<div>Loading...</div>}>
            <div className="relative flex min-h-screen flex-col">{children}</div>
          </Suspense>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
