// File: components/store/ServerCategorias.tsx
import { getCategories } from "@/src/services/categorys";
import { getActiveCollections } from "@/src/services/collection-service";
import ClientCategorias from "./ClientCategorias";
import ClientCategoriasDesktop from "./ClientCategoriasDesktop";

export default async function ServerCategorias() {
  const [categories, collections] = await Promise.all([
    getCategories(),
    getActiveCollections(),
  ]);

  return (
    <>
      <div className="md:hidden">
        <ClientCategorias categories={categories} />
      </div>

      <div className="hidden w-full md:block">
        <ClientCategoriasDesktop
          categories={categories}
          collections={collections}
        />
      </div>
    </>
  );
}