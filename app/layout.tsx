import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import NavBar from "@/components/navigation/NavBar";
import { Toaster } from 'sonner';


const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Store App Cañete San Vicente",
  description: "Tienda de tecnologias cañete",
  icons: {
    icon: "/logo.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="es">
      <body
        className={`${inter.className}`}
      >
        <NavBar />
        {children}
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            className: "bg-gray-800 text-white",
          }}
        />
      </body>
    </html>
  );
}
