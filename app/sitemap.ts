import { GetAllProductsSlug } from "@/src/services/products";
import { getCategories } from "@/src/services/categorys";
import { getActiveBrands } from "@/src/services/brands";
import { linesService } from "@/src/services/lines.service";
import { collectionService } from "@/src/services/collection-service";
import { ComparisonService } from "@/src/services/comparison-service";
import type { Comparison } from "@/src/schemas/comparison.schema";
import type { Collection } from "@/src/schemas/collection.schema";
import type { ProductLine } from "@/src/schemas/line.schema";
import type { Brand } from "@/src/schemas/brand.schema";
import type { MetadataRoute } from "next";

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

interface ProductSlug { slug: string; updatedAt?: Date | string; }
interface CategoryItem { slug: string; updatedAt?: Date | string; }
interface ComparisonResponse { data?: Comparison[]; }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gophone.pe";

    const [
        products,
        categories,
        brands,
        lines,
        collections,
        comparisonsResponse,
    ] = await Promise.all([
        GetAllProductsSlug().catch(() => [] as ProductSlug[]),
        getCategories().catch(() => [] as CategoryItem[]),
        getActiveBrands().catch(() => [] as Brand[]),
        linesService.getAllActive().catch(() => [] as ProductLine[]),
        collectionService.getAll({ active: true }).catch(() => [] as Collection[]),
        ComparisonService.getAll({ isActive: true, limit: 1000 }).catch(() => ({ data: [] } as ComparisonResponse)),
    ]);

    const comparisons = comparisonsResponse?.data || [];
    const now = new Date();
    const activeCollections = collections.filter((c) => {
        const hasStarted = !c.startsAt || new Date(c.startsAt) <= now;
        const hasNotEnded = !c.endsAt || new Date(c.endsAt) >= now;
        return hasStarted && hasNotEnded;
    });

    // 1. Productos
    const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
        url: `${baseUrl}/productos/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
        changeFrequency: "daily",
        priority: 0.8,
    }));

    // 2. Categorías (Asegura actualización dinámica)
    const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
        url: `${baseUrl}/catalogo/${c.slug}`,
        lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
    }));

    // 3. Marcas (Corregido de createdAt a updatedAt/now para forzar rastreo en Search Console)
    const brandUrls: MetadataRoute.Sitemap = brands.map((b) => ({
        url: `${baseUrl}/catalogo/${b.slug}`,
        lastModified: b.updatedAt ? new Date(b.updatedAt) : b.createdAt ? new Date(b.createdAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
    }));

    // 4. Líneas (Corregido de createdAt a updatedAt/now para evitar fechas obsoletas de 2025)
    const lineUrls: MetadataRoute.Sitemap = lines.map((l) => ({
        url: `${baseUrl}/catalogo/${l.slug}`,
        lastModified: l.updatedAt ? new Date(l.updatedAt) : l.createdAt ? new Date(l.createdAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
    }));

    // 5. Colecciones
    const collectionUrls: MetadataRoute.Sitemap = activeCollections.map((c) => ({
        url: `${baseUrl}/colecciones/${c.slug}`,
        lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: 0.9,
    }));

    // 6. Comparativas
    const comparisonUrls: MetadataRoute.Sitemap = comparisons.map((c: Comparison) => ({
        url: `${baseUrl}/comparativas/${c.slug}`,
        lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    // 7. Páginas Estáticas
    const staticPages = [
        { url: "", priority: 1.0, changefreq: "daily" as ChangeFreq },
        { url: "/catalogo", priority: 1.0, changefreq: "daily" as ChangeFreq },
        { url: "/ofertas", priority: 0.95, changefreq: "daily" as ChangeFreq },
        { url: "/novedades", priority: 0.95, changefreq: "daily" as ChangeFreq },
        { url: "/colecciones", priority: 0.9, changefreq: "weekly" as ChangeFreq },
        { url: "/categorias", priority: 0.85, changefreq: "weekly" as ChangeFreq },
        { url: "/comparativas", priority: 0.8, changefreq: "weekly" as ChangeFreq },
        { url: "/hc/preguntas-frecuentes", priority: 0.7, changefreq: "monthly" as ChangeFreq },
        { url: "/hc/contacto-y-soporte", priority: 0.6, changefreq: "monthly" as ChangeFreq },
        { url: "/hc/garantias-y-devoluciones", priority: 0.6, changefreq: "monthly" as ChangeFreq },
        { url: "/hc/proceso-de-compra", priority: 0.6, changefreq: "monthly" as ChangeFreq },
        { url: "/store/legal/terminos-y-condiciones", priority: 0.4, changefreq: "yearly" as ChangeFreq },
        { url: "/store/legal/politicas-de-privacidad", priority: 0.4, changefreq: "yearly" as ChangeFreq },
        { url: "/store/legal/politicas-de-cambios-y-devoluciones", priority: 0.4, changefreq: "yearly" as ChangeFreq },
        { url: "/store/legal/libro-de-reclamaciones", priority: 0.5, changefreq: "monthly" as ChangeFreq },
    ];

    const staticSitemapUrls: MetadataRoute.Sitemap = staticPages.map((page) => ({
        url: `${baseUrl}${page.url}`,
        lastModified: new Date(),
        changeFrequency: page.changefreq,
        priority: page.priority,
    }));

    return [
        ...staticSitemapUrls,
        ...collectionUrls,
        ...categoryUrls,
        ...brandUrls,
        ...lineUrls,
        ...comparisonUrls,
        ...productUrls,
    ];
}