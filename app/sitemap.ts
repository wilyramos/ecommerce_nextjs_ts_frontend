// app/sitemap.ts
import { GetAllProductsSlug } from "@/src/services/products";
import { getAllSubcategories } from "@/src/services/categorys";
import type { MetadataRoute } from "next";

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://www.gophone.pe";

    // 1. Obtener Slugs de Productos
    const products = await GetAllProductsSlug();
    const productUrls = products.map((p) => ({
        url: `${baseUrl}/productos/${p.slug}`,
        lastModified: p.updatedAt || new Date(),
        changeFrequency: "daily" as ChangeFreq,
        priority: 0.8,
    }));

    // 2. Obtener Categorías
    const categories = await getAllSubcategories();
    const categoryUrls = categories.map((c) => ({
        url: `${baseUrl}/categoria/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as ChangeFreq,
        priority: 0.9,
    }));

    // 3. Páginas Estáticas y de Soporte
    const staticPages = [
        { url: "", priority: 1.0, changefreq: "daily" as ChangeFreq },
        { url: "/ofertas", priority: 0.9, changefreq: "daily" as ChangeFreq },
        { url: "/search", priority: 0.7, changefreq: "weekly" as ChangeFreq },
        { url: "/hc/contacto-y-soporte", priority: 0.5, changefreq: "monthly" as ChangeFreq },
        { url: "/hc/preguntas-frecuentes", priority: 0.5, changefreq: "monthly" as ChangeFreq },
        { url: "/hc/garantias-y-devoluciones", priority: 0.5, changefreq: "monthly" as ChangeFreq },
        { url: "/hc/politicas-de-privacidad", priority: 0.3, changefreq: "yearly" as ChangeFreq },
        { url: "/terminos", priority: 0.3, changefreq: "yearly" as ChangeFreq },
        { url: "/cookies", priority: 0.3, changefreq: "yearly" as ChangeFreq },
    ].map((page) => ({
        url: `${baseUrl}${page.url}`,
        lastModified: new Date(),
        changeFrequency: page.changefreq,
        priority: page.priority,
    }));

    return [
        ...staticPages,
        ...categoryUrls,
        ...productUrls,
    ];
}