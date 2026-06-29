import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gophone.pe";

    return {
        rules: [
            {
                userAgent: "*",
                allow: [
                    "/",
                    "/productos/",
                    "/catalogo/",   
                    "/categorias",
                    "/colecciones/",
                    "/ofertas",
                    "/novedades",
                    "/hc/",
                    "/store/legal/",
                ],
                disallow: [
                    "/admin/",
                    "/checkout/",
                    "/carrito",
                    "/profile/",
                    "/pos/",
                    "/api/",
                    "/auth/",
                    "/checkout-result/",
                    "/track-order",
                    "/*?*sort=",
                    "/*?*priceRange=",
                    "/*?*min=",
                    "/*?*max=",
                    "/*?*page=",
                    "/*?*utm_",
                    "/*?*ref=",
                    "/*?*fbclid=",
                    "/*?*gclid=",
                    "/*.json$",
                ],
            },
            {
                userAgent: "Googlebot",
                allow: [
                    "/",
                    "/productos/",
                    "/catalogo/",
                    "/categorias",
                    "/colecciones/",
                    "/ofertas",
                    "/novedades",
                ],
                disallow: [
                    "/admin/",
                    "/checkout/",
                    "/carrito",
                    "/profile/",
                    "/pos/",
                    "/api/",
                    "/auth/",
                    "/checkout-result/",
                    "/search",
                ],
            },
            {
                userAgent: "Googlebot-Image",
                allow: "/",
            },
            {
                userAgent: ["AdsBot-Google", "AdsBot-Google-Mobile"],
                allow: "/",
            },
            {
                userAgent: [
                    "MJ12bot",
                    "AhrefsBot",
                    "SemrushBot",
                    "DotBot",
                    "Exabot",
                    "Scrapy",
                ],
                disallow: "/",
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}