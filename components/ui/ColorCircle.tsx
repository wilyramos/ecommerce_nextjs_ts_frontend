import { cn } from "@/lib/utils";

export default function ColorCircle({
    color,
    size,
}: {
    color: string;
    size?: number;
}) {
    const diccionarioColores: Record<string, string> = {
        amarillo: "bg-[#FFFF00]",
        "amarillo claro": "bg-[#FFFACD]",
        "amarillo oscuro": "bg-[#FFD700]",
        ámbar: "bg-[#FFBF00]",
        arena: "bg-[#C2B280]",
        azul: "bg-[#0000FF]",
        "azul claro": "bg-[#ADD8E6]",
        "azul oscuro": "bg-[#00008B]",
        "azul marino": "bg-[#001F3F]",
        "azul celeste": "bg-[#87CEEB]",
        "azul cielo": "bg-[#87CEFA]",
        "azul pastel": "bg-[#A7C7E7]",
        "azul turquesa": "bg-[#40E0D0]",
        beige: "bg-[#F5F5DC]",
        blanco: "bg-[#FFFFFF]",
        bordó: "bg-[#800020]",
        bronce: "bg-[#CD7F32]",
        café: "bg-[#6F4E37]",
        caqui: "bg-[#C3B091]",
        celeste: "bg-[#87CEEB]",
        champán: "bg-[#F7E7CE]",
        chocolate: "bg-[#7B3F00]",
        cian: "bg-[#00FFFF]",
        coral: "bg-[#FF7F50]",
        crema: "bg-[#FFFDD0]",
        dorado: "bg-[#FFD700]",
        fucsia: "bg-[#FF00FF]",
        granate: "bg-[#800000]",
        gris: "bg-[#808080]",
        "gris claro": "bg-[#D3D3D3]",
        "gris oscuro": "bg-[#2F4F4F]",
        "gris perla": "bg-[#C0C0C0]",
        guinda: "bg-[#8B0000]",
        lavanda: "bg-[#E6E6FA]",
        lila: "bg-[#C8A2C8]",
        magenta: "bg-[#FF00FF]",
        malva: "bg-[#B57EDC]",
        marfil: "bg-[#FFFFF0]",
        marrón: "bg-[#8B4513]",
        melocotón: "bg-[#FFDAB9]",
        menta: "bg-[#98FF98]",
        mostaza: "bg-[#FFDB58]",
        naranja: "bg-[#FFA500]",
        "naranja oscuro": "bg-[#FF8C00]",
        negro: "bg-[#000000]",
        grafito: "bg-[#474A51]",
        ocre: "bg-[#CC7722]",
        oro: "bg-[#DAA520]",
        púrpura: "bg-[#800080]",
        plata: "bg-[#C0C0C0]",
        rojo: "bg-[#FF0000]",
        "rojo oscuro": "bg-[#8B0000]",
        "rojo vino": "bg-[#722F37]",
        rosa: "bg-[#FFC0CB]",
        "rosa claro": "bg-[#FFB6C1]",
        "rosa fuerte": "bg-[#FF69B4]",
        salmon: "bg-[#FA8072]",
        "salmon claro": "bg-[#FFA07A]",
        terracota: "bg-[#E2725B]",
        turquesa: "bg-[#40E0D0]",
        verde: "bg-[#00FF00]",
        "verde claro": "bg-[#90EE90]",
        "verde oscuro": "bg-[#006400]",
        "verde lima": "bg-[#32CD32]",
        "verde menta": "bg-[#98FB98]",
        "verde oliva": "bg-[#808000]",
        "verde agua": "bg-[#00FA9A]",
        "verde noche": "bg-[#013220]",
        vino: "bg-[#8B0000]",
        violeta: "bg-[#8A2BE2]",
        "azul pacífico": "bg-[#5F9EA0]",
        "verde alpino": "bg-[#0B6623]",
        "azul sierra": "bg-[#4682B4]",
        "titanio natural": "bg-[#B0B0B0]",
        "gris titanio": "bg-[#4B4B4B]",
    };

    const hexClass = diccionarioColores[color.trim().toLowerCase()] ?? "bg-[#CCCCCC]";
    const dim = size ?? 16;

    return (
        <div
            title={color}
            className={cn(
                "rounded-full shadow-lg border border-gray-200 hover:scale-105 transition-transform duration-150",
                hexClass
            )}
            style={{ width: dim, height: dim }}
        />
    );
}
