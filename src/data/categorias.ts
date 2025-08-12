import { IconType } from "react-icons";
import { MdSmartphone } from "react-icons/md";
import { PiHeadphonesBold } from "react-icons/pi";
import { HiOutlineDevicePhoneMobile } from "react-icons/hi2";

export interface Subcategoria {
    slug: string;
    name: string;
}

export interface CategoriaConSubcategorias {
    slug: string;
    name: string;
    icon: IconType; // Icono para la categoría
    subcategorias: Subcategoria[];
}

export const categoriasEstaticas: CategoriaConSubcategorias[] = [
    {
        name: "Smartphones",
        slug: "smartphones",
        icon: MdSmartphone,
        subcategorias: [
            { name: "iPhone", slug: "iphone" },
            { name: "Android", slug: "android" },
        ],
    },
    {
        name: "Accesorios para Celulares",
        slug: "accesorios-para-celulares",
        icon: HiOutlineDevicePhoneMobile,
        subcategorias: [
            { name: "Fundas y Carcasas", slug: "fundas-y-carcasas" },
            { name: "Protectores de Pantalla", slug: "protectores-de-pantalla" },
            { name: "Cargadores y Cables", slug: "cargadores-y-cables" },
            { name: "Power Banks", slug: "power-banks" },
            { name: "Auriculares y audífonos", slug: "auriculares-y-audifonos" },
        ],
    },
    {
        name: "Audio y Video",
        slug: "audio-y-video",
        icon: PiHeadphonesBold,
        subcategorias: [
            { name: "Auriculares y audífonos", slug: "auriculares-y-audifonos" },
        ],
    },
];
