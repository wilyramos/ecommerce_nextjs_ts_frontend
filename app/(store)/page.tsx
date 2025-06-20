// import Footer from "@/components/home/Footer"
import CategoriasDestacadas from "@/components/home/CategoriasDestacadas"
import { getCategories } from "@/src/services/categorys"
import CarruselPrincipal from "@/components/home/CarruselPrincipal"
import type { Metadata } from "next";
import ProductosNuevos from "@/components/home/ProductosNuevos"
import ProductosDestacados from "@/components/home/ProductosDestacados";


export const metadata: Metadata = {
    title: "GoPhone Cañete - Venta de celulares, accesorios y más",
    description: "GoPhone Cañete es tu tienda de confianza para la compra de celulares, accesorios y más. Ofrecemos una amplia variedad de productos a los mejores precios.",
    keywords: [
        "GoPhone Cañete",
        "tienda iPhone Cañete",
        "venta de celulares Cañete",
        "accesorios para celulares",
        "tecnología en Cañete",
        "comprar iPhone Cañete",
        "gadgets Cañete",
        "tienda online Cañete",
        "GoPhone Perú",
        "cases y fundas Cañete",
        "cargadores y cables Cañete",
        "auriculares y audífonos Cañete",
        "repuestos y reparación de celulares",
        "ofertas de tecnología Cañete",
    ],
    authors: [{ name: "GoPhone Cañete", url: "https://gophone.pe" }],
    creator: "GoPhone",
    openGraph: {
        title: "GoPhone Cañete - Venta de iPhones y Tecnología",
        description:
            "Descubre GoPhone en Cañete: iPhones, accesorios y productos tecnológicos al mejor precio. Atención rápida y confiable.",
        url: "https://gophone.pe",
        siteName: "GoPhone",
        locale: "es_PE",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "GoPhone Cañete - Venta de iPhones y Tecnología",
        description:
            "Compra iPhones, accesorios y más en GoPhone, tu tienda online de confianza en Cañete.",
    },
    metadataBase: new URL("https://gophone.pe"),
    icons: {
        icon: "/logoapp.svg",
    }
};


export default async function HomePage() {

    const categories = await getCategories();

    return (
        <>
            {/* Hero principal */}
            <div className="container mx-auto">
                <CarruselPrincipal />
            </div>

            <section className="container mx-auto ">
                <CategoriasDestacadas categorias={categories} />
            </section>
            <section className="container mx-auto px-4">
                <ProductosNuevos />
            </section>

            <section className="container mx-auto px-4 py-10">
                <ProductosDestacados />
            </section>

            {/* <Footer /> */}
        </>
    )
}
