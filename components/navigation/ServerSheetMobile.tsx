// components/store/ServerSheetMobile.tsx
import { getCategories } from "@/src/services/categorys";
import ButtonShowSheetMobile from "./ButtonShowSheetMobile";

export default async function ServerSheetMobile() {
    const categories = await getCategories();
    return <ButtonShowSheetMobile categories={categories} />;
}
