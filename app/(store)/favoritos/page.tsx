// File: frontend/app/(store)/favoritos/page.tsx
import { Suspense } from "react";
import type { Metadata } from "next";
import FavoritesView from "@/components/favorites/FavoritesView";
import { FavoritesGridSkeleton } from "@/components/favorites/FavoritesSkeleton";

export const metadata: Metadata = {
  title: "Mis Favoritos | GoPhone",
  description: "Tus productos favoritos guardados en GoPhone.",
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return (
    <main className="container mx-auto min-h-[65vh] px-4 py-8">
      <Suspense fallback={<FavoritesGridSkeleton />}>
        <FavoritesView />
      </Suspense>
    </main>
  );
}