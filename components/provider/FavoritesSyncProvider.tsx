// File: frontend/components/providers/FavoritesSyncProvider.tsx
"use client";

import { useEffect, useRef } from "react";
import { useFavoriteStore } from "@/src/store/favoriteStore";

interface Props {
  isAuthenticated: boolean;
}

export default function FavoritesSyncProvider({ isAuthenticated }: Props) {
  const syncFavorites = useFavoriteStore(state => state.syncFavorites);
  const hasSynced = useRef(false);

  useEffect(() => {
    // Sincroniza automáticamente los favoritos locales con el backend al detectar sesión
    if (isAuthenticated && !hasSynced.current) {
      syncFavorites();
      hasSynced.current = true;
    }
  }, [isAuthenticated, syncFavorites]);

  return null; // Es un componente puramente lógico
}