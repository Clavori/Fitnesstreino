import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FORJA — Academia, Treino do Dia, Dieta e Ranking",
  description:
    "Aplicativo web mobile-first (PWA) para academia: treino do dia, boneco demonstrando execução correta, plano alimentar, calendário de frequência e ranking.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FORJA",
  },
};

export const viewport: Viewport = {
  themeColor: "#070A12",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="min-h-screen bg-[#050811] text-slate-100 antialiased selection:bg-neon-lime selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
