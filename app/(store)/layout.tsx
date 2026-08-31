import Footer from "@/components/home/Footer";
import NavBar from "@/components/navigation/NavBar";
import type { Metadata } from "next";
import WhatsappButton from "@/components/home/WhatsappButton";
import GlobalAdContainer from "@/components/home/GlobalAdContainer";
import TopBarAdServer from "@/components/home/TopBarAdServer";
import ScrollToTop from "@/components/navigation/ScrollToTop";
import CartAnimationOverlay from "@/components/home/product/Cartanimationoverlay";

export const metadata: Metadata = {
    description: "Explora GoPhone: Catálogo completo, accesorios.",
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ScrollToTop />
            <CartAnimationOverlay />
            <div className="flex flex-col min-h-screen w-full">
                <TopBarAdServer />
                <header className="sticky top-0 z-40 w-full">
                    <NavBar />
                </header>
                
                <main className="flex-1 w-full max-w-screen-2xl mx-auto self-center">
                    {children}
                </main>
                
                <Footer />
            </div>
            <GlobalAdContainer />
            <WhatsappButton />
        </>
    );
}