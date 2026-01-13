import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Suspense } from "react"
import "./globals.css"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Save the Date - Leonard & Thirza | 12 juni 2026",
  description:
    "Bewaar 12 juni 2026 voor de bruiloft van Leonard & Thirza in Nieuw-Lekkerland. Officiële uitnodiging volgt later.",
  generator: "v0.app",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noimageindex: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "Save the Date - Leonard & Thirza",
    description: "Bewaar 12 juni 2026 | Officiële uitnodiging volgt later",
    images: [
      {
        url: "/og-save-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Save the Date - Leonard & Thirza - 12 juni 2026",
      },
    ],
    type: "website",
    locale: "nl_NL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Save the Date - Leonard & Thirza",
    description: "Bewaar 12 juni 2026 | Officiële uitnodiging volgt later",
    images: ["/og-save-1200x630.jpg"],
  },
  icons: {
    icon: [
      { url: "/clearer-golden-heart.png", sizes: "32x32", type: "image/png" },
      { url: "/clearer-golden-heart.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/clearer-golden-heart.png",
    apple: [
      { url: "/clearer-golden-heart.png", sizes: "180x180", type: "image/png" },
      { url: "/clearer-golden-heart.png", sizes: "152x152", type: "image/png" },
      { url: "/clearer-golden-heart.png", sizes: "144x144", type: "image/png" },
      { url: "/clearer-golden-heart.png", sizes: "120x120", type: "image/png" },
      { url: "/clearer-golden-heart.png", sizes: "114x114", type: "image/png" },
      { url: "/clearer-golden-heart.png", sizes: "76x76", type: "image/png" },
      { url: "/clearer-golden-heart.png", sizes: "72x72", type: "image/png" },
      { url: "/clearer-golden-heart.png", sizes: "60x60", type: "image/png" },
      { url: "/clearer-golden-heart.png", sizes: "57x57", type: "image/png" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Save the Date",
    "theme-color": "#f8f6f0",
    "msapplication-TileColor": "#f8f6f0",
    "msapplication-config": "none",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="nl">
      <head>
        <link rel="mask-icon" href="/clearer-golden-heart.png" color="#d1a954" />
        <link rel="preload" as="image" href="/envelop-start-frame2.png" fetchPriority="high" />
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" content="#faf9f6" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${playfair.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  )
}
