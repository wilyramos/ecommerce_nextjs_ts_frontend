import { getActiveBrands } from "@/src/services/brands";
import BrandsCarousel from "./BrandsCarousel";

export default async function BrandsList() {

    const brands = await getActiveBrands();
    if (brands.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4">
            <header className="text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-500">
                    Marcas
                    <span className="text-white bg-gray-950 px-2">
                        Destacadas
                    </span>
                </h2>
                <p className="text-sm md:text-base text-gray-400">
                    Explora productos de las mejores marcas del mercado.
                </p>
            </header>
            <BrandsCarousel brands={brands} />
        </section>
    )
}