// components/home/CategoriasDestacadasWrapper.tsx
import { getCategories } from "@/src/services/categorys";
import CategoriasDestacadas from "./CategoriasDestacadas";

export default async function CategoriasDestacadasWrapper() {
  const categories = await getCategories();
  
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6 pt-8 pb-4">
      <CategoriasDestacadas categorias={categories} />
    </div>
  );
}