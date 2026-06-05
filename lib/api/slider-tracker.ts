// File: frontend/lib/api/slider-tracker.ts
// ─────────────────────────────────────────────────────────────

//TODO: Este módulo es un placeholder para futuras funcionalidades de tracking de interacciones con los banners del slider. Actualmente, solo se expone una función para registrar vistas y clics, pero en el futuro podría ampliarse para incluir métricas más detalladas o integraciones con servicios de analítica.

const BASE_URL = process.env.API_URL; // Asegúrate de que esta variable esté definida en tu entorno

/**
 * Registra una interacción de vista o clic en el banner indicado.
 * No lanza errores ni bloquea el hilo — falla silenciosamente.
 */
export function trackBannerInteraction(
    id: string,
    type: "view" | "click"
): void {
    if (!id?.trim() || !BASE_URL) return;

    // fetch sin await — fire-and-forget
    fetch(`${BASE_URL}/slider-banners/${id}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
        // keepalive: true asegura que la request se complete
        // aunque el componente se desmonte antes de recibir respuesta
        keepalive: true,
    }).catch(() => {
        // Silencioso: el tracking nunca debe interrumpir la UX
    });
}