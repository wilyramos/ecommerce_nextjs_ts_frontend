export default function ColorCircle({ color }: { color: string }) {
    // Diccionario ampliado de colores comunes en español
    const diccionarioColores: { [key: string]: string } = {
        "amarillo": "#FFFF00",
        "azul": "#0000FF",
        "blanco": "#FFFFFF",
        "celeste": "#87CEEB",
        "champán": "#F7E7CE",
        "dorado": "#FFD700",
        "fucsia": "#FF00FF",
        "gris": "#808080",
        "gris claro": "#D3D3D3",
        "gris oscuro": "#2F4F4F",
        "lila": "#C8A2C8",
        "marfil": "#FFFFF0",
        "marrón": "#8B4513",
        "morado": "#800080",
        "naranja": "#FFA500",
        "negro": "#000000",
        "plata": "#C0C0C0",
        "rojo": "#FF0000",
        "rosa": "#FFC0CB",
        "salmon": "#FA8072",
        "turquesa": "#40E0D0",
        "verde": "#00FF00",
        "verde oscuro": "#006400",
        "verde lima": "#32CD32",
        "vino": "#8B0000",
    };

    // Normalizar clave (evitar errores por mayúsculas)
    const colorKey = color.trim().toLowerCase();
    const colorHex = diccionarioColores[colorKey] || "#CCCCCC";

    return (
        <div
            className="w-4 h-4 rounded-full shadow-sm border-2 border-gray-500 hover:scale-105 transition-transform duration-150"
            title={color}
            style={{
                backgroundColor: colorHex,
            }}
        />
    );
}
