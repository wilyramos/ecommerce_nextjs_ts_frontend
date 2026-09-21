// File: frontend/app/(store)/profile/favorites/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getTokenOptional } from "@/src/auth/dal";
import { favoriteService } from "@/src/services/favorite-v3.service";
import { productService } from "@/src/services/product-service-v3";
import { H3, P } from "@/components/ui/TypographyV3";
import ProductCard from "@/components/home/product/ProductCard";
import type { TApiProduct } from "@/src/schemas";

export default async function ProfileFavoritesPage() {
    const token = await getTokenOptional();
    if (!token) {
        redirect("/auth/login?redirect=/profile/favorites");
    }

    let favoriteIds: string[] = [];
    try {
        favoriteIds = await favoriteService.getMine(token);
    } catch (error) {
        console.error("[ProfileFavoritesPage] Error obteniendo favoritos:", error);
    }

    let products: TApiProduct[] = [];
    if (favoriteIds.length > 0) {
        try {
            products = await productService.getByIds(favoriteIds);
        } catch (error) {
            console.error("[ProfileFavoritesPage] Error obteniendo productos favoritos:", error);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <H3>Mis Favoritos</H3>
                <P className="mt-1">Lista de productos guardados para comprar después.</P>
            </div>

            {products.length === 0 ? (
                <div className="rounded-radius-md border border-dashed border-border-primary p-8 text-center">
                    <P>No tienes productos marcados como favoritos.</P>
                    <Link
                        href="/productos"
                        className="mt-4 inline-block text-xs font-semibold text-text-primary underline"
                    >
                        Ver productos
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <div key={product._id} className="min-h-[420px]">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}