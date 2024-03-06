import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["cyrillic"] });

export const metadata: Metadata = {
  title: "Comparador de preços SUMIG",
  description: "Sistem de comparativos de preços da concorrencia da SUMIG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
