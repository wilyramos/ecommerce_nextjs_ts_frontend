import type { CategoryResponse } from "../schemas";

export function buildCategoryTree(categories: CategoryResponse[]): CategoryResponse[] {
  const categoryMap: Record<string, CategoryResponse & { children: CategoryResponse[] }> = {};

  categories.forEach((cat) => {
    categoryMap[cat._id] = { ...cat, children: [] };
  });

  const tree: CategoryResponse[] = [];

  categories.forEach((cat) => {
    // Verificar que parent es un objeto (no string) y que tiene _id
    if (cat.parent && typeof cat.parent !== "string" && cat.parent._id) {
      const parent = categoryMap[cat.parent._id];
      if (parent) {
        parent.children.push(categoryMap[cat._id]);
      }
    } else {
      tree.push(categoryMap[cat._id]);
    }
  });

  return tree;
}
