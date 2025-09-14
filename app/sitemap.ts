// app/sitemap.ts
import { GetAllProductsSlug } from "@/src/services/products";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const products = await GetAllProductsSlug(); // tu función que devuelve slug o url

    const productUrls = products.map((p) => ({
        url: `https://www.gophone.pe/productos/${p.slug}`,
        lastModified: p.updatedAt || new Date(),
        changefreq: "daily",
        priority: 0.8,
    }));

    return [
        {
            url: "https://www.gophone.pe",
            lastModified: new Date(),
            changefreq: "daily",
            priority: 1,
        },
        ...productUrls,
    ];
}
