// File: components/store/ServerCategorias.tsx
import { getCategories } from "@/src/services/categorys";
import ClientCategorias from "./ClientCategorias";

export default async function ServerCategorias() {
  const categories = await getCategories();
  return <ClientCategorias categories={categories} />;
}
