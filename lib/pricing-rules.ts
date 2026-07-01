export interface PricingRule {
    minCost: number;
    maxCost: number;
    defaultMargin: number; // Margen neto real que deseas recibir en tu cuenta
    label: string;
}

// Configuración de márgenes agresivos y competitivos para tecnología (Enfoque GoPhone: Buenos Precios)
export const PRICING_RULES: PricingRule[] = [
    { minCost: 0, maxCost: 30, defaultMargin: 35, label: "Accesorios económicos (Precio Ultra Competitivo)" },
    { minCost: 30, maxCost: 150, defaultMargin: 25, label: "Accesorios Premium / Repuestos" },
    { minCost: 150, maxCost: 700, defaultMargin: 18, label: "Tecnología Gama Media / Gadgets" },
    { minCost: 700, maxCost: 2500, defaultMargin: 10, label: "Gama Alta / Smartwatches / Tablets" },
    { minCost: 2500, maxCost: 99999, defaultMargin: 6, label: "iPhones / Laptops / Flagships (Margen de Volumen 6%)" },
];

/**
 * Aplica redondeo psicológico e-commerce (.90, .00, .50) adecuado para Perú
 */
export function applyPsychologicalPricing(price: number): number {
    if (price < 100) return Math.floor(price) + 0.90;
    if (price >= 2500) return Math.floor(price / 10) * 10 + 9;
    return Math.floor(price) + 0.90;
}

/**
 * Calcula el precio de venta sugerido compensando de forma exacta la estructura de comisiones de Culqi.
 * Protege el margen de retorno configurado en PRICING_RULES.
 */
export function calculateSuggestedPrice(cost: number, marginPercentage: number): number {
    if (cost <= 0) return 0;

    const margin = marginPercentage / 100;

    // 1. Definición de las variables de Culqi (Asumiendo tarifa estándar nacional + IGV preventivo)
    const CULQI_PERCENTAGE = 0.0405; // 3.44% + IGV = 4.05%
    const CULQI_FIXED_PEN = 0.75;    // $0.20 USD convertidos a soles aprox.

    // 2. Simulación previa para detectar el piso mínimo de PagoEfectivo (S/. 3.50 + IGV = S/. 4.13)
    const preliminaryPrice = (cost + CULQI_FIXED_PEN) / (1 - margin - CULQI_PERCENTAGE);

    let rawPrice = 0;
    if (preliminaryPrice < 87.72) {
        // Si el precio estimado es bajo, aplicamos la comisión mínima fija de Culqi en soles
        const CULQI_MINIMUM_FEE = 4.13; // S/. 3.50 + IGV
        rawPrice = (cost + CULQI_MINIMUM_FEE) / (1 - margin);
    } else {
        // Para montos mayores, aplicamos la tasa porcentual + el costo fijo por transacción
        rawPrice = (cost + CULQI_FIXED_PEN) / (1 - margin - CULQI_PERCENTAGE);
    }

    // 3. Evita errores matemáticos si los costos superan la unidad
    if (isNaN(rawPrice) || rawPrice <= 0) return cost;

    return applyPsychologicalPricing(rawPrice);
}

/**
 * Evalúa el subtotal en el carrito de compras para aplicar la regla de envío gratis (> S/. 50)
 */
export function calculateCheckoutTotal(subtotal: number): { subtotal: number; shippingCost: number; total: number } {
    const FREE_SHIPPING_THRESHOLD = 49; // S/. 49 para envío gratis en Perú
    const DEFAULT_SHIPPING_COST = 10;

    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_COST;
    const total = subtotal + shippingCost;

    return {
        subtotal,
        shippingCost,
        total
    };
}