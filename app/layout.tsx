import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import NavBar from "@/components/navigation/NavBar";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Store app cañete",
  description: "Tienda de tecnologias cañete",
  icons: {
    icon: "/next.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className}`}
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}
