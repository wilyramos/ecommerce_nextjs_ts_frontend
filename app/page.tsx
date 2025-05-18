import Footer from "@/components/home/Footer"
// import ProductList from './components/ProductList'
// import ProductCard from './components/ProductCard'
// import CategoryList from './components/CategoryList'
// import Footer from './components/Footer'
import CategoriasDestacadas from "@/components/home/CategoriasDestacadas"
import { getCategories } from "@/src/services/categorys"
import Image from "next/image"

export default async function HomePage() {

    const categories = await getCategories()

    return (
        <>
            {/* Hero principal */}

            <div className="bg-gray-100">
                <Image
                    src="/bg.webp"
                    alt="Hero Image"
                    width={1920}
                    height={1080}
                    className="w-full h-auto object-cover"
                />

            </div>

            <section className="container mx-auto px-4 py-8">
                <CategoriasDestacadas categorias={categories} />
            </section>

            <Footer />
        </>
    )
}
