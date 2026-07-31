import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/AppShell";
import { RegisterSW } from "@/components/RegisterSW";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ATSAdvisor | LOTIC",
    template: "%s | ATSAdvisor",
  },
  description:
    "Analiza tu CV contra ofertas en español, pasa el ATS y reconstruye tu carrera con outplacement accesible.",
  applicationName: "ATSAdvisor",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ATSAdvisor",
  },
  openGraph: {
    title: "ATSAdvisor",
    description: "Pasa el ATS y reconstruye tu carrera. Por LOTIC.",
    locale: "es_CO",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <RegisterSW />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
