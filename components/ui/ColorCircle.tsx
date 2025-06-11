



export default function ColorCircle({ color }: { color: string }) {


    const diccionarioColores: { [key: string]: string } = {
        "rojo": "#FF0000",
        "verde": "#00FF00",
        "azul": "#0000FF",
        "amarillo": "#FFFF00",
        "negro": "#000000",
        "blanco": "#FFFFFF",
        "rosado": "#FFC0CB",
        "morado": "#800080",
        "naranja": "#FFA500",
        "gris": "#808080",

    }

    const colorHex = diccionarioColores[color] || "#000000";

    return (
        <>
            <div
                className="w-5 h-5 rounded-full border-2 border-gray-300"
                style={{ backgroundColor: colorHex }}
            ></div>

        </>
    )
}
