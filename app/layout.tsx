import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import SwRegister from "@/components/SwRegister";

export const metadata: Metadata = {
  title: "Mes Déplacements",
  description: "Tracker GPS de trajets en voiture",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Déplacements",
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#007AFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body className="h-full flex flex-col">
        <main
          className="flex-1 overflow-y-auto scroll-ios"
          style={{ paddingBottom: "calc(83px + env(safe-area-inset-bottom, 0px))" }}
        >
          {children}
        </main>
        <BottomNav />
        <SwRegister />
      </body>
    </html>
  );
}
