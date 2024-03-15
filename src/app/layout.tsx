import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";

import { AuthProvider } from "../contexts/AuthContext";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["cyrillic"] });

export const metadata: Metadata = {
  title: {
    absolute: '',
    default: "Comparador de preços SUMIG",
    template: ''
  },
  description: "Sistem de comparativos de preços da concorrencia da SUMIG",
  robots: {
    follow: false,
    index: false
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <ToastContainer autoClose={3000} />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
