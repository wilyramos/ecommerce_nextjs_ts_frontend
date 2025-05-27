import Footer from "@/components/home/Footer"
import CategoriasDestacadas from "@/components/home/CategoriasDestacadas"
import { getCategories } from "@/src/services/categorys"
import CarruselPrincipal from "@/components/home/CarruselPrincipal"

export default async function HomePage() {

    const categories = await getCategories()
    return (
        <>
            {/* Hero principal */}
            <div className="container mx-auto">
               <CarruselPrincipal />
            </div>

            <section className="container mx-auto ">
                <CategoriasDestacadas categorias={categories} />
            </section>

            <Footer />
        </>
    )
}
