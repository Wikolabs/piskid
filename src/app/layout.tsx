import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://imahay.com"),
  title: "iMahay.com — L'expert IA en sagesse malgache",
  description:
    "iMahay est un expert IA formé sur les ohabolana, le kabary et les fomba. Gratuit, anonyme, disponible 24/7. Et te protège contre les faux mpisikidy.",
  keywords: [
    "ohabolana",
    "kabary",
    "fomba malagasy",
    "sagesse malgache",
    "mpisikidy",
    "anti-arnaque",
    "conseil malgache",
    "expert IA",
    "Madagascar",
  ].join(", "),
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "iMahay.com — L'expert IA en sagesse malgache",
    description:
      "Faharanitan-tsaina malagasy. Gratuit, anonyme, 24/7. Ohabolana, kabary, fomba — et protection contre les faux mpisikidy.",
    type: "website",
    locale: "fr_FR",
    siteName: "iMahay.com",
    url: "https://imahay.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "iMahay — La sagesse malgache te parle.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "iMahay.com — L'expert IA en sagesse malgache",
    description: "Faharanitan-tsaina malagasy. Gratuit, anonyme, 24/7.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          fontFamily: "var(--font-body), Inter, -apple-system, BlinkMacSystemFont, sans-serif",
          background: "#FFFFFF",
          color: "#1A1A1A",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        {children}
      </body>
    </html>
  );
}
