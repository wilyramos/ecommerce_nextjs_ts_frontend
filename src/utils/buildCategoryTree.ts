import type { Category } from "../schemas";

export function buildCategoryTree(categories: Category[]) {
    // Creamos un mapa rápido por id para acceder a las categorías fácilmente
    const map: Record<string, Category & { subcategories: Category[] }> = {};

    // Primero inicializamos el mapa con todas las categorías y añadimos el array de subcategorías vacío
    categories.forEach(cat => {
        map[cat._id] = { ...cat, subcategories: [] };
    });

    // Aquí vamos a guardar el resultado con solo las categorías raíz (sin padre)
    const tree: (Category & { subcategories: Category[] })[] = [];

    categories.forEach(cat => {
        // Si la categoría tiene un padre, la añadimos a su subcategoría
        if (cat.parent) {
            const parentCategory = map[cat.parent._id];
            if (parentCategory) {
                parentCategory.subcategories.push(map[cat._id]);
            }
        } else {
            // Si no tiene padre, es una categoría raíz, la añadimos al árbol
            tree.push(map[cat._id]);
        }
    });

    return tree;
}
