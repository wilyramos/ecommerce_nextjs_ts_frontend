// File: frontend/components/home/layouts/CollectionGrid.tsx

import { CollectionProduct } from "@/src/schemas/collection.schema";
import ProductCard           from "@/components/home/product/ProductCard";
import type { TApiProduct }  from "@/src/schemas";

interface Props {
    products: CollectionProduct[];
}

// CollectionProduct → TApiProduct (cast mínimo para compatibilidad)
function toApiProduct(p: CollectionProduct): TApiProduct {
    return {
        _id:               p._id,
        nombre:            p.nombre,
        slug:              p.slug,
        precio:            p.precio,
        precioComparativo: p.precioComparativo ?? undefined,
        imagenes:          p.imagenes,
        stock:             p.stock ?? 0,
        categoria:         p.categoria,
        isActive:          true,
        rating:            0,
        numReviews:        0,
    } as TApiProduct;
}

export default function CollectionGrid({ products }: Props) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {products.map((product) => (
                <ProductCard key={product._id} product={toApiProduct(product)} />
            ))}
        </div>
    );
}