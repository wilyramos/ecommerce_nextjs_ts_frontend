import { getActiveBrands } from "@/src/services/brands";
import BrandsCarousel from "./BrandsCarousel";

export default async function BrandsList() {

    const brands = await getActiveBrands();
    if (brands.length === 0) return null;

    return (
        <section className="my-10">
            <h2 className="text-2xl font-semibold text-center mb-6">Marcas</h2>
            <BrandsCarousel brands={brands} />
        </section>
    )
}
