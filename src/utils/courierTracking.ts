// File: frontend/src/utils/courierTracking.ts

export interface CourierTrackingData {
    courierName: string;
    cleanCode: string;
    trackingUrl: string;
}

/**
 * Resuelve la información del courier y el enlace de rastreo directo.
 * Soporta formato de prefijo "COURIER: CODIGO" o detección por método de envío.
 */
export function getCourierTrackingInfo(
    trackingNumber?: string,
    shippingMethod?: string
): CourierTrackingData | null {
    if (!trackingNumber) return null;

    let courierKey = "";
    let cleanCode = trackingNumber.trim();

    // 1. Extraer prefijo si viene en formato "COURIER: CODIGO"
    if (trackingNumber.includes(":")) {
        const [prefix, ...rest] = trackingNumber.split(":");
        courierKey = prefix.trim().toUpperCase();
        cleanCode = rest.join(":").trim();
    } else {
        // Fallback: Inferir del método de envío si no tiene prefijo guardado
        const method = (shippingMethod || "").toUpperCase();
        if (method.includes("SHALOM")) courierKey = "SHALOM";
        else if (method.includes("MARVISUR")) courierKey = "MARVISUR";
        else if (method.includes("URBANO")) courierKey = "URBANO";
        else courierKey = "OLVA";
    }

    // 2. Mapeo de URLs oficiales y funcionales en Perú
    switch (courierKey) {
        case "SHALOM":
            return {
                courierName: "Shalom",
                cleanCode,
                // Shalom requiere número de guía y clave de seguridad en su plataforma
                trackingUrl: "https://rastrea.shalom.pe/",
            };

        case "MARVISUR":
            return {
                courierName: "Marvisur",
                cleanCode,
                trackingUrl: "https://expresomarvisur.com/",
            };

        case "URBANO":
            return {
                courierName: "Urbano Express",
                cleanCode,
                trackingUrl: `https://portal.urbano.com.pe/rastrear-shipper/${encodeURIComponent(cleanCode)}`,
            };

        case "CUSTOM":
            return {
                courierName: "Rastreo Externo",
                cleanCode,
                trackingUrl: cleanCode.startsWith("http") ? cleanCode : `https://${cleanCode}`,
            };

        case "OLVA":
        default:
            return {
                courierName: "Olva Courier",
                cleanCode,
                trackingUrl: `https://tracking.olvaexpress.pe/?tipo=byExternal&codigo=${encodeURIComponent(cleanCode)}`,
            };
    }
}