



export default function ColorCircle({ color }: { color: string }) {


    // Colores en orden alfabético
    const diccionarioColores: { [key: string]: string } = {
        "amarillo": "#FFFF00",
        "azul": "#0000FF",
        "blanco": "#FFFFFF",
        "gris": "#808080",
        "morado": "#800080",
        "naranja": "#FFA500",
        "negro": "#000000",
        "rojo": "#FF0000",
        "rosa": "#FFC0CB",
        "verde": "#00FF00"
        
        

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
