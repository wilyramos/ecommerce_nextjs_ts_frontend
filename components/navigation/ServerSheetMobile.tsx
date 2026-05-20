// components/store/ServerSheetMobile.tsx
import { getCategories } from "@/src/services/categorys";
import ButtonShowSheetMobile from "./ButtonShowSheetMobile";
import { getActiveCollections } from "@/src/services/collection-service";


export default async function ServerSheetMobile() {
     const [categories, collections] = await Promise.all([
    getCategories(),
    getActiveCollections(),
  ]);



    return <ButtonShowSheetMobile categories={categories} collections={collections} />;
}
