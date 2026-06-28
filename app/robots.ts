// File: app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            // Regla general para todos los bots
            {
                userAgent: "*",
                allow: [
                    "/",
                    "/productos",
                    "/catalogo",   
                    "/categorias",
                    "/colecciones",
                    "/ofertas",
                    "/novedades",
                    "/hc",
                    "/store/legal",
                ],
                disallow: [
                    "/admin",
                    "/checkout",
                    "/carrito",
                    "/profile",
                    "/pos",
                    "/api",
                    "/auth",
                    "/*checkout-result*",
                    "/track-order",
                    // Bloquear parámetros de filtro en /search
                    "/search?*sort=",
                    "/search?*priceRange=",
                    "/search?*min=",
                    "/search?*max=",
                    "/search?*page=",
                    // Bloquear parámetros de filtro en /catalogo
                    "/catalogo?*sort=",
                    "/catalogo?*priceRange=",
                    "/catalogo?*min=",
                    "/catalogo?*max=",
                    "/catalogo?*page=",
                    // Parámetros de tracking
                    "/*?utm_",
                    "/*?ref=",
                    "/*?fbclid=",
                    "/*?gclid=",
                    "/*.json$",
                ],
                crawlDelay: 1,
            },

            // Optimizar para Google
            {
                userAgent: "Googlebot",
                allow: [
                    "/",
                    "/productos",
                    "/catalogo",           // ✅ Agregado
                    "/categorias",
                    "/colecciones",
                    "/ofertas",
                    "/novedades",
                ],
                disallow: [
                    "/admin",
                    "/checkout",
                    "/carrito",
                    "/profile",
                    "/pos",
                    "/api",
                    "/auth",
                    "/*checkout-result*",
                ],
                crawlDelay: 0,
            },

            // Google Images
            {
                userAgent: "Googlebot-Image",
                allow: "/",
            },

            // Bing
            {
                userAgent: "Bingbot",
                allow: [
                    "/",
                    "/productos",
                    "/catalogo",           // ✅ Agregado
                    "/categorias",
                    "/colecciones",
                    "/ofertas",
                    "/novedades",
                ],
                disallow: [
                    "/admin",
                    "/checkout",
                    "/carrito",
                    "/profile",
                    "/pos",
                    "/api",
                    "/auth",
                ],
                crawlDelay: 1,
            },

            // Publicidad
            {
                userAgent: ["AdsBot-Google", "AdsBot-Google-Mobile"],
                allow: "/",
            },

            // Bloquear bots maliciosos
            {
                userAgent: [
                    "MJ12bot",
                    "AhrefsBot",
                    "AhrefsBot-Abusively-Aggressive",
                    "SemrushBot",
                    "SemrushBot-BA",
                    "DotBot",
                    "BlackWidow",
                    "Exabot",
                    "Scrapy",
                    "HttpClient",
                ],
                disallow: "/",
            },

            // Redes sociales
            {
                userAgent: [
                    "facebookexternalhit",
                    "Twitterbot",
                    "LinkedInBot",
                    "WhatsApp",
                ],
                allow: "/",
            },
        ],

        sitemap: "https://gophone.pe/sitemap.xml",
        host: "https://gophone.pe",
    };
}