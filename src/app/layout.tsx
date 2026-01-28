import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EnergyVoice AI - Demo CRM",
  description: "Agente de voz IA para empresas energéticas | Demo MVP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
