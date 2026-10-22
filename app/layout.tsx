import type { Metadata, Viewport } from "next";
import "@fontsource/bodoni-moda/400.css";
import "@fontsource/bodoni-moda/400-italic.css";
import "@fontsource/bodoni-moda/500.css";
import "@fontsource/bodoni-moda/600.css";
import "@fontsource/jost/300.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";
import "./globals.css";
import { SITE_URL } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Thais · 17 anos",
  description: "Sábado, 31 de Outubro de 2026, às 12h · Beira",
  openGraph: {
    title: "Thais Laysa celebra 17 anos",
    description: "Sábado, 31 de Outubro de 2026, às 12h · Beira",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    type: "website",
    locale: "pt_PT",
  },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
};

export const viewport: Viewport = { themeColor: "#22040e", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>{children}</body>
    </html>
  );
}
