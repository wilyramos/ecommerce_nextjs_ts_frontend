// app/robots.ts

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",

                allow: [
                    "/",
                    "/productos",
                    "/categoria",
                    "/auth",
                    "/marca",
                    // "/tema"
                ],

                disallow: [
                    "/admin",
                    "/checkout",
                    "/carrito",
                    "/profile",
                    "/pos",
                    "/api",
                ],
            },
        ],

        sitemap: "https://www.gophone.pe/sitemap.xml",
    };
}
