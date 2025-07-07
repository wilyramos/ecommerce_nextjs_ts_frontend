// src/data/categoriasEstaticas.ts

export interface Subcategoria {
    slug: string;
    name: string;
}

export interface CategoriaConSubcategorias {
    slug: string;
    name: string;
    subcategorias: Subcategoria[];
}

export const categoriasEstaticas: CategoriaConSubcategorias[] = [
    {
        name: "Smartphones",
        slug: "smartphones",
        subcategorias: [
            { name: "iPhone", slug: "iphone" },
            { name: "Android", slug: "android" },
        ],
    },
    {
        name: "Accesorios para Celulares",
        slug: "accesorios-para-celulares",
        subcategorias: [
            { name: "Fundas y Carcasas", slug: "fundas-y-carcasas" },
            { name: "Protectores de Pantalla", slug: "protectores-de-pantalla" },
            { name: "Cargadores y Cables", slug: "cargadores-y-cables" },
            { name: "Power Banks", slug: "power-banks" },
            { name: "Auriculares y audífonos", slug: "auriculares-y-audifonos" },
        ],
    },
    {
        name: "Computadoras y Laptops",
        slug: "computadoras-y-laptops",
        subcategorias: [
            { name: "Laptops", slug: "laptops" },
            { name: "PCs de escritorio", slug: "pcs-de-escritorio" },
            { name: "Monitores", slug: "monitores" },
            { name: "Teclados y Mouse", slug: "teclados-y-mouse" },
        ],
    },
    {
        name: "Audio y Video",
        slug: "audio-y-video",
        subcategorias: [
            { name: "Smart TVs", slug: "smart-tvs" },
            { name: "Auriculares y audífonos", slug: "auriculares-y-audifonos" },
            { name: "Parlantes", slug: "parlante" },
            { name: "Micrófonos", slug: "microfonos" },
        ],
    },
    {
        name: "Gaming",
        slug: "gaming",
        subcategorias: [
            { name: "Consolas", slug: "consolas-playstation-xbox-nintendo" },
            { name: "Juegos", slug: "juegos" },
            { name: "Controles y Mandos", slug: "controles-y-mandos" },
            { name: "Accesorios Gamer", slug: "accesorios-gamer" },
        ],
    },
    {
        name: "Redes y Almacenamiento",
        slug: "redes-y-almacenamiento",
        subcategorias: [
            { name: "Routers y Repetidores", slug: "routers-y-repetidores" },
            { name: "Discos Duros Externos", slug: "discos-duros-externos" },
            { name: "Memorias USB", slug: "memorias-usb-pendrives" },
            { name: "Tarjetas de Memoria", slug: "tarjetas-de-memoria" },
        ],
    },
    {
        name: "Especiales",
        slug: "especiales",
        subcategorias: [
            { name: "Novedades", slug: "novedades" },
            { name: "Ofertas", slug: "ofertas" },
        ],
    },
];
