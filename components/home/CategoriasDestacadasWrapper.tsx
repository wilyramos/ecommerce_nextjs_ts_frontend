// components/home/CategoriasDestacadasWrapper.tsx
import { getAllSubcategories } from "@/src/services/categorys"
import CategoriasDestacadas from "./CategoriasDestacadas"

export default async function CategoriasDestacadasWrapper() {
  const categories = await getAllSubcategories()
  return <CategoriasDestacadas categorias={categories} />
}
