import type { Metadata } from "next";
import { Inter, Libre_Caslon_Text } from "next/font/google";
import { TopNav } from "./components/TopNav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const libreCaslonText = Libre_Caslon_Text({
  variable: "--font-libre-caslon-text",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Sophie",
  description: "Registro diario de ritual de mañana y noche.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR">
      <body className={`${inter.variable} ${libreCaslonText.variable} antialiased`}>
        <TopNav />
        <main className="mx-auto w-full max-w-[640px] px-6 py-10">{children}</main>
      </body>
    </html>
  );
}
