// app/sitemap.ts
import { GetAllProductsSlug } from "@/src/services/products";
import { getAllSubcategories } from "@/src/services/categorys";
import { getActiveBrands } from "@/src/services/brands";
import { ComparisonService } from "@/src/services/comparison-service";
import { Comparison } from "@/src/schemas/comparison.schema";
import type { MetadataRoute } from "next";

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.gophone.pe";

    // 1. Obtener Datos en Paralelo aplicando filtros al servicio de comparativas
    const [products, categories, brands, comparisonsResult] = await Promise.all([
        GetAllProductsSlug(),
        getAllSubcategories(),
        getActiveBrands(),
        // Forzamos traer solo las activas y un límite alto por si hay paginación por defecto en tu API
        ComparisonService.getAll({ isActive: true, limit: 1000 }).catch((err) => {
            console.error("Error cargando sitemap de comparativas:", err);
            return { data: [] };
        }),
    ]);

    // Extraemos el array del objeto de respuesta basándonos en el patrón del backend ({ data: [...] })
    const comparisons = (comparisonsResult?.data || []) as Comparison[];

    // 2. URLs de Productos
    const productUrls = products.map((p) => ({
        url: `${baseUrl}/productos/${p.slug}`,
        lastModified: p.updatedAt || new Date(),
        changeFrequency: "daily" as ChangeFreq,
        priority: 0.8,
    }));

    // 3. URLs de Categorías (Landing Pages SEO)
    const categoryUrls = categories.map((c) => ({
        url: `${baseUrl}/catalogo/${c.slug}`,
        lastModified: c.updatedAt || new Date(),
        changeFrequency: "weekly" as ChangeFreq,
        priority: 0.9,
    }));

    // 4. URLs de Marcas (Landing Pages SEO)
    const brandUrls = brands.map((b) => ({
        url: `${baseUrl}/catalogo/${b.slug}`,
        changeFrequency: "weekly" as ChangeFreq,
        priority: 0.9,
    }));

    // 5. URLs de Comparativas Dinámicas
    const comparisonUrls = comparisons.map((c) => ({
        url: `${baseUrl}/comparativas/${c.slug}`,
        // Caemos en la fecha actual si el backend no expone updatedAt en el esquema base
        lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
        changeFrequency: "weekly" as ChangeFreq,
        priority: 0.8,
    }));

    // 6. Páginas Estáticas del Sistema
    const staticPages = [
        { url: "", priority: 1.0, changefreq: "daily" as ChangeFreq },
        { url: "/catalogo", priority: 1.0, changefreq: "daily" as ChangeFreq },
        { url: "/comparativas", priority: 0.9, changefreq: "daily" as ChangeFreq }, // Directorio raíz indexable
        { url: "/ofertas", priority: 0.9, changefreq: "daily" as ChangeFreq },
        { url: "/novedades", priority: 0.9, changefreq: "daily" as ChangeFreq },
        { url: "/categorias", priority: 0.8, changefreq: "weekly" as ChangeFreq },

        // Páginas Legales y Soporte
        { url: "/hc/contacto-y-soporte", priority: 0.6, changefreq: "monthly" as ChangeFreq },
        { url: "/hc/preguntas-frecuentes", priority: 0.5, changefreq: "monthly" as ChangeFreq },
        { url: "/hc/garantias-y-devoluciones", priority: 0.5, changefreq: "monthly" as ChangeFreq },
        { url: "/hc/politicas-de-privacidad", priority: 0.3, changefreq: "yearly" as ChangeFreq },
        { url: "/terminos-y-condiciones", priority: 0.3, changefreq: "yearly" as ChangeFreq },
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
        ...brandUrls,
        ...comparisonUrls,
        ...productUrls,
    ];
}