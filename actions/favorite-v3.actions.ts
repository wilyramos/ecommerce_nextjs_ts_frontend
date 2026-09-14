// File: frontend/actions/favorite-v3.actions.ts
"use server";

import { getTokenOptional } from "@/src/auth/dal";
import { favoriteService } from "@/src/services/favorite-v3.service";

export async function toggleFavoriteAction(productId: string) {
    const token = await getTokenOptional();
    // Si no hay token, fallamos silenciosamente en el backend para que siga funcionando en localStorage
    if (!token) return { ok: false, error: "No autorizado" };

    try {
        const data = await favoriteService.toggle(productId, token);
        return { ok: true, data };
    } catch (error) {
        console.error("Error al actualizar favorito:", error);
        return { ok: false, error: "Error al actualizar favorito" };
    }
}

export async function syncFavoritesAction(localProductIds: string[]) {
    const token = await getTokenOptional();
    if (!token) return { ok: false, error: "No autorizado" };

    try {
        const data = await favoriteService.sync(localProductIds, token);
        return { ok: true, data };
    } catch (error) {
        console.error("Error al sincronizar favoritos:", error);
        return { ok: false, error: "Error de sincronización" };
    }
}

export async function getMyFavoritesAction() {
    const token = await getTokenOptional();
    if (!token) return { ok: false, error: "No autorizado" };

    try {
        const data = await favoriteService.getMine(token);
        return { ok: true, data };
    } catch (error) {
        console.error("Error al obtener favoritos:", error);
        return { ok: false, error: "Error al obtener los favoritos" };
    }
}