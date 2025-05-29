import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans } from "next/font/google";
import { Toaster } from 'sonner';


const inter = DM_Sans({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Store App Cañete San Vicente",
  description: "Tienda de tecnologias cañete",
  icons: {
    icon: "/logob.svg",
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
        {/* <NavBar /> */}
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
