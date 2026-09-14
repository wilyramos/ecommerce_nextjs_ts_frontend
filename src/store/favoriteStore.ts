// File: frontend/src/store/favoriteStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toggleFavoriteAction, syncFavoritesAction, getMyFavoritesAction } from '@/actions/favorite-v3.actions';

interface FavoriteStore {
  favorites: string[];
  toggleFavorite: (productId: string) => Promise<void>;
  syncFavorites: () => Promise<void>;
  fetchMyFavorites: () => Promise<void>;
  setFavorites: (productIds: string[]) => void;
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      toggleFavorite: async (productId: string) => {
        const current = get().favorites;
        const isFavorited = current.includes(productId);
        
        // 1. Actualización Optimista UI
        const newFavorites = isFavorited 
          ? current.filter(id => id !== productId)
          : [...current, productId];
        
        set({ favorites: newFavorites });

        // 2. Intentar guardar en backend (falla silenciosamente si es invitado)
        const res = await toggleFavoriteAction(productId);
        
        if (!res.ok && res.error !== "No autorizado") {
          // Revertir solo si fue un error real del servidor (ej. 500)
          set({ favorites: current });
        }
      },

      syncFavorites: async () => {
        const localIds = get().favorites;
        const res = await syncFavoritesAction(localIds);
        if (res.ok && res.data) {
          set({ favorites: res.data });
        }
      },

      fetchMyFavorites: async () => {
        const res = await getMyFavoritesAction();
        if (res.ok && res.data) {
          set({ favorites: res.data });
        }
      },
      
      setFavorites: (productIds) => set({ favorites: productIds })
    }),
    { name: 'gophone-favorites-storage' }
  )
);