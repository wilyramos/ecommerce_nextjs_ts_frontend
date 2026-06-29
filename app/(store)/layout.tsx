// File: frontend/app/(store)/layout.tsx
import Footer from "@/components/home/Footer";
import NavBar from "@/components/navigation/NavBar";
import type { Metadata } from "next";
import WhatsappButton from "@/components/home/WhatsappButton";
import GlobalAdContainer from "@/components/home/GlobalAdContainer";
import TopBarAdServer from "@/components/home/TopBarAdServer";
import ScrollToTop from "@/components/navigation/ScrollToTop";

export const metadata: Metadata = {
    description: "Explora GoPhone: Catálogo completo, accesorios.",
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen">
                <TopBarAdServer />
                <header className="sticky top-0 z-40">
                    <NavBar />
                </header>
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
            <GlobalAdContainer />
            <WhatsappButton />
        </>
    );
}