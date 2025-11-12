import { getActiveBrands } from "@/src/services/brands";
import BrandsCarousel from "./BrandsCarousel";

export default async function BrandsList() {

    const brands = await getActiveBrands();
    if (brands.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4">
            <header className="text-center md:text-left">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                    Marcas
                    <div>
                <div className="border-b border-2 border-gray-300 w-14 md:w-46 mb-4"></div>
                    </div>
                </h2>
            </header>
            <BrandsCarousel brands={brands} />
        </section>
    )
}