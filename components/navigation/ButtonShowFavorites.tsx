// File: frontend/components/navigation/ButtonShowFavorites.tsx
"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavoriteStore } from "@/src/store/favoriteStore";

export default function ButtonShowFavorites() {
  const favorites = useFavoriteStore((state) => state.favorites);
  const count = favorites.length;

  return (
    <Link
      href="/favoritos"
      aria-label="Mis Favoritos"
      className="group relative flex size-9 items-center justify-center rounded-full text-text-secondary outline-none transition-colors duration-fast hover:bg-surface-secondary hover:text-status-error active:scale-95"
    >
      <Heart
        size={19}
        strokeWidth={2}
        className="transition-colors duration-fast group-hover:fill-status-error/10"
      />
      {count > 0 && (
        <span className="absolute right-0 top-0 flex size-[15px] animate-in zoom-in-50 items-center justify-center rounded-full bg-status-error text-[9px] font-bold text-text-inverse shadow-xs duration-fast">
          {count}
        </span>
      )}
    </Link>
  );
}