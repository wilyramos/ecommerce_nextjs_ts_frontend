// File: components/store/ServerCategorias.tsx
import { getCategories } from "@/src/services/categorys";
import ClientCategorias from "./ClientCategorias";
import ClientCategoriasDesktop from "./ClientCategoriasDesktop";

export default async function ServerCategorias() {
  const categories = await getCategories();

  return (
    <>
      {/* Mobile categories */}
      <div className="md:hidden">
        <ClientCategorias categories={categories} />
      </div>

      {/* Desktop categories */}
      <div className="hidden md:block">
        <ClientCategoriasDesktop categories={categories} />
      </div>
    </>
  );
}
