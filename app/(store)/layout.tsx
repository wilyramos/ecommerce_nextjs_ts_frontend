// File: frontend/app/(store)/layout.tsx
import Footer from "@/components/home/Footer";
import NavBar from "@/components/navigation/NavBar";
import type { Metadata } from "next";
import WhatsappButton from "@/components/home/WhatsappButton";
import GlobalAdContainer from "@/components/home/GlobalAdContainer";
import ScrollToTop from "@/components/navigation/ScrollToTop";
import CartAnimationOverlay from "@/components/home/product/Cartanimationoverlay";

export const metadata: Metadata = {
  description: "Explora GoPhone: Catálogo completo, accesorios y dispositivos Apple con garantía.",
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-surface-primary text-text-primary antialiased">
      <ScrollToTop />
      <CartAnimationOverlay />

      {/* Header Unificado, Inteligente y Flotante */}
      <NavBar />

      {/* 
        Contenedor principal con el MISMO padding exacto que el NavBar 
        (px-4 md:px-6) y espaciado vertical corregido (py-6 md:py-8) 
      */}
      <main className="mx-auto flex w-full max-w-screen-2xl flex-1 flex-col px-1 py-6 md:px-6 md:py-6">
        {children}
      </main>

      <footer className="w-full border-t border-border-primary bg-surface-secondary">
        <Footer />
      </footer>

      <GlobalAdContainer />
      <div className="fixed bottom-6 right-6 z-tooltip">
        <WhatsappButton />
      </div>
    </div>
  );
}