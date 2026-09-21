// components/home/CategoriasDestacadasWrapper.tsx
import { getCategories } from "@/src/services/categorys";
import CategoriasDestacadas from "./CategoriasDestacadas";

export default async function CategoriasDestacadasWrapper() {
  const categories = await getCategories();
  
  if (!categories || categories.length === 0) return null;

  return (
    <div className="w-full mx-auto md:px-6 py-5">
      <CategoriasDestacadas categorias={categories} />
    </div>
  );
}