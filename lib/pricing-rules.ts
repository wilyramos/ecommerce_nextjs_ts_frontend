// File: frontend/lib/pricing-rules.ts

export interface PricingRule {
    minCost: number;
    maxCost: number;
    defaultMargin: number; // Margen real sobre el precio de venta (Margen de Retorno)
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
    if (price < 100) {
        // En rangos bajos, el .90 sigue mandando la percepción de oferta
        return Math.floor(price) + 0.90;
    }

    // Para productos caros (> S/.2500), terminar en .90 a veces se ve informal o altera el margen ultra ajustado.
    // Buscamos que termine en números limpios o redondeados hacia abajo de manera atractiva.
    if (price >= 2500) {
        return Math.floor(price / 10) * 10 + 9; // Ejem: S/. 5432.12 -> S/. 5439 (atractivo y limpio)
    }

    return Math.floor(price) + 0.90;
}

/**
 * Calcula el precio de venta sugerido basado en Margen Real (Retorno)
 */
export function calculateSuggestedPrice(cost: number, marginPercentage: number): number {
    if (cost <= 0) return 0;
    const margin = marginPercentage / 100;

    // Evita división por cero si el margen es 100%
    if (margin >= 1) return cost;

    const rawPrice = cost / (1 - margin);
    return applyPsychologicalPricing(rawPrice);
}