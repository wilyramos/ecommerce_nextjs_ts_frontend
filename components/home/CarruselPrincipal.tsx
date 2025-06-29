import ClientCarouselMain from "./ClientCarouselMain";
import { getDestacadosProducts } from "@/src/services/products";


export default async function CarruselPrincipal() {

    // Get the products for the carousel
    const products = await getDestacadosProducts();

    if (!products || products.products.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500">
                No hay productos destacados disponibles en este momento.
            </div>
        );
    }
    

    return (
        <div className="">

            <ClientCarouselMain
                products={products.products}
            />
            
        </div>
    );
}
