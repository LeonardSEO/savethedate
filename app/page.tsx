import type { Metadata } from "next"
import { SaveTheDatePage } from "@/components/save-the-date-page"

export const metadata: Metadata = {
  title: "Save the Date — Thirza & Leonard",
  description: "12 juni 2026. Nieuw-Lekkerland. Uitnodiging volgt.",
  robots: "noindex,nofollow",
  openGraph: {
    title: "Save the Date — Thirza & Leonard",
    description: "12 juni 2026. Nieuw-Lekkerland. Uitnodiging volgt.",
    images: [
      {
        url: "/og-save-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "Save the Date - Thirza & Leonard",
      },
    ],
    url: "https://domein.nl/s",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Save the Date — Thirza & Leonard",
    description: "12 juni 2026. Nieuw-Lekkerland. Uitnodiging volgt.",
    images: ["/og-save-1200x630.jpg"],
  },
}

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Save the Date — Thirza & Leonard",
    startDate: "2026-06-12",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: "Nieuw-Lekkerland, Nederland",
    },
    image: ["/og-save-1200x630.jpg"],
    description: "Uitnodiging volgt. Datum gereserveerd houden.",
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SaveTheDatePage />
    </>
  )
}
