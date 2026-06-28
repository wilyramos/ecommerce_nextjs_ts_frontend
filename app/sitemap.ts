// File: app/sitemap.ts
import { GetAllProductsSlug } from "@/src/services/products";
import { getCategories } from "@/src/services/categorys";
import { getActiveBrands, type Brand } from "@/src/services/brands";
import { linesService } from "@/src/services/lines.service";
import { collectionService } from "@/src/services/collection-service";
import { ComparisonService } from "@/src/services/comparison-service";
import type { Comparison } from "@/src/schemas/comparison.schema";
import type { Collection } from "@/src/schemas/collection.schema";
import type { ProductLine } from "@/src/schemas/line.schema";
import type { MetadataRoute } from "next";

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

// Tipos para respuestas de servicios
interface ProductSlug {
    slug: string;
    updatedAt?: Date | string;
}

interface CategoryItem {
    slug: string;
    updatedAt?: Date | string;
}

interface ComparisonResponse {
    data?: Comparison[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gophone.pe";

    // ===================================================================
    // 1. Obtener TODOS los datos en paralelo
    // ===================================================================
    const [
        products,
        categories,
        brands,
        lines,
        collections,
        comparisonsResponse,
    ] = await Promise.all([
        GetAllProductsSlug().catch((err: Error) => {
            console.error("Error cargando productos para sitemap:", err);
            return [] as ProductSlug[];
        }),
        getCategories().catch((err: Error) => {
            console.error("Error cargando categorías para sitemap:", err);
            return [] as CategoryItem[];
        }),
        getActiveBrands().catch((err: Error) => {
            console.error("Error cargando marcas para sitemap:", err);
            return [] as Brand[];
        }),
        linesService.getAllActive().catch((err: Error) => {
            console.error("Error cargando líneas para sitemap:", err);
            return [] as ProductLine[];
        }),
        collectionService.getAll({ active: true }).catch((err: Error) => {
            console.error("Error cargando colecciones para sitemap:", err);
            return [] as Collection[];
        }),
        ComparisonService.getAll({ isActive: true, limit: 1000 }).catch((err: Error) => {
            console.error("Error cargando comparativas para sitemap:", err);
            return { data: [] } as ComparisonResponse;
        }),
    ]);

    // Extraer array de respuestas
    const comparisons: Comparison[] = comparisonsResponse?.data || [];

    // Filtrar colecciones activas y vigentes (por rango de fechas)
    const now = new Date();
    const activeCollections: Collection[] = collections.filter((collection: Collection) => {
        const hasStarted = !collection.startsAt || new Date(collection.startsAt) <= now;
        const hasNotEnded = !collection.endsAt || new Date(collection.endsAt) >= now;
        return hasStarted && hasNotEnded;
    });

    // ===================================================================
    // 2. URLs de PRODUCTOS
    // ===================================================================
    const productUrls: MetadataRoute.Sitemap = products.map((product: ProductSlug) => ({
        url: `${baseUrl}/productos/${product.slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: "weekly" as ChangeFreq,
        priority: 0.8,
    }));

    // ===================================================================
    // 3. URLs de CATEGORÍAS (Landing Pages SEO)
    // ===================================================================
    const categoryUrls: MetadataRoute.Sitemap = categories.map((category: CategoryItem) => ({
        url: `${baseUrl}/catalogo/${category.slug}`,
        lastModified: category.updatedAt ? new Date(category.updatedAt) : new Date(),
        changeFrequency: "weekly" as ChangeFreq,
        priority: 0.9,
    }));

    // ===================================================================
    // 4. URLs de MARCAS (Landing Pages SEO)
    // ===================================================================
    const brandUrls: MetadataRoute.Sitemap = brands.map((brand: Brand) => ({
        url: `${baseUrl}/catalogo/${brand.slug}`,
        lastModified: brand.createdAt ? new Date(brand.createdAt) : new Date(),
        changeFrequency: "weekly" as ChangeFreq,
        priority: 0.85,
    }));

    // ===================================================================
    // 5. URLs de LÍNEAS (Landing Pages SEO) - NUEVO
    // ===================================================================
    const lineUrls: MetadataRoute.Sitemap = lines.map((line: ProductLine) => ({
        url: `${baseUrl}/catalogo/${line.slug}`,
        lastModified: line.createdAt ? new Date(line.createdAt) : new Date(),
        changeFrequency: "weekly" as ChangeFreq,
        priority: 0.8,
    }));

    // ===================================================================
    // 6. URLs de COLECCIONES (Landing Pages SEO) - NUEVO
    // ===================================================================
    const collectionUrls: MetadataRoute.Sitemap = activeCollections.map((collection: Collection) => ({
        url: `${baseUrl}/colecciones/${collection.slug}`,
        lastModified: collection.updatedAt ? new Date(collection.updatedAt) : new Date(),
        changeFrequency: "weekly" as ChangeFreq,
        priority: 0.85,
    }));

    // ===================================================================
    // 7. URLs de COMPARATIVAS
    // ===================================================================
    const comparisonUrls: MetadataRoute.Sitemap = comparisons.map((comparison: Comparison) => ({
        url: `${baseUrl}/comparativas/${comparison.slug}`,
        lastModified: comparison.updatedAt ? new Date(comparison.updatedAt) : new Date(),
        changeFrequency: "weekly" as ChangeFreq,
        priority: 0.75,
    }));

    // ===================================================================
    // 8. PÁGINAS ESTÁTICAS DEL SISTEMA
    // ===================================================================
    interface StaticPage {
        url: string;
        priority: number;
        changefreq: ChangeFreq;
    }

    const staticPages: StaticPage[] = [
        // Home
        { url: "", priority: 1.0, changefreq: "daily" },

        // Catálogo y Filtros
        { url: "/catalogo", priority: 1.0, changefreq: "daily" },
        { url: "/ofertas", priority: 0.95, changefreq: "daily" },
        { url: "/novedades", priority: 0.95, changefreq: "daily" },

        // Colecciones
        { url: "/colecciones", priority: 0.9, changefreq: "weekly" },

        // Catálogo Dinámico
        { url: "/categorias", priority: 0.85, changefreq: "weekly" },

        // Comparativas
        { url: "/comparativas", priority: 0.8, changefreq: "weekly" },

        // Carrito (para crawlers de ecommerce)
        { url: "/carrito", priority: 0.5, changefreq: "never" },

        // Centro de Ayuda / FAQ
        { url: "/hc/preguntas-frecuentes", priority: 0.7, changefreq: "monthly" },
        { url: "/hc/contacto-y-soporte", priority: 0.6, changefreq: "monthly" },
        { url: "/hc/garantias-y-devoluciones", priority: 0.6, changefreq: "monthly" },
        { url: "/hc/proceso-de-compra", priority: 0.6, changefreq: "monthly" },
        { url: "/hc/politicas-de-privacidad", priority: 0.5, changefreq: "monthly" },

        // Páginas Legales
        { url: "/store/legal/terminos-y-condiciones", priority: 0.4, changefreq: "yearly" },
        { url: "/store/legal/politicas-de-privacidad", priority: 0.4, changefreq: "yearly" },
        { url: "/store/legal/politicas-de-cambios-y-devoluciones", priority: 0.4, changefreq: "yearly" },
        { url: "/store/legal/cookies", priority: 0.3, changefreq: "yearly" },

        // Libro de reclamaciones
        { url: "/store/legal/libro-de-reclamaciones", priority: 0.5, changefreq: "monthly" },
    ];

    const staticSitemapUrls: MetadataRoute.Sitemap = staticPages.map((page: StaticPage) => ({
        url: `${baseUrl}${page.url}`,
        lastModified: new Date(),
        changeFrequency: page.changefreq,
        priority: page.priority,
    }));

    // ===================================================================
    // 9. COMBINAR Y RETORNAR
    // ===================================================================
    // Ordenar por importancia (priority descendente) para mejor indexación
    const allSitemapUrls: MetadataRoute.Sitemap = [
        ...staticSitemapUrls,    // Páginas críticas primero
        ...collectionUrls,       // Colecciones (nuevas)
        ...categoryUrls,         // Categorías
        ...brandUrls,            // Marcas
        ...lineUrls,             // Líneas (nuevas)
        ...comparisonUrls,       // Comparativas
        ...productUrls,          // Productos (muchísimos, al final)
    ];

    return allSitemapUrls;
}