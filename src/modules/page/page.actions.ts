// File: frontend/src/modules/page/page.actions.ts

"use server";

import { verifySession } from "../../auth/dal";
import { revalidateTag } from "next/cache";
import { PageService } from "./page.service";
import { 
  createPageSchema, 
  updatePageSchema, 
  PageActionState 
} from "./page.schema";

/**
 * Server Action para dar de alta una nueva página institucional
 */
export async function createPageAction(
  prevState: PageActionState, 
  formData: FormData
): Promise<PageActionState> {
  await verifySession();

  const rawFormData = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    content: formData.get("content") as string,
    isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
    seo: {
      metaTitle: formData.get("metaTitle") as string,
      metaDescription: formData.get("metaDescription") as string,
    },
  };

  const validatedFields = createPageSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const formattedErrors: PageActionState["errors"] = {};
    const fieldErrors = validatedFields.error.flatten().fieldErrors;

    if (fieldErrors.title) formattedErrors.title = fieldErrors.title;
    if (fieldErrors.slug) formattedErrors.slug = fieldErrors.slug;
    if (fieldErrors.content) formattedErrors.content = fieldErrors.content;
    if (fieldErrors.isActive) formattedErrors.isActive = fieldErrors.isActive;

    const seoErrors = validatedFields.error.format().seo;
    if (seoErrors?.metaTitle?._errors) formattedErrors["seo.metaTitle"] = seoErrors.metaTitle._errors;
    if (seoErrors?.metaDescription?._errors) formattedErrors["seo.metaDescription"] = seoErrors.metaDescription._errors;

    return {
      success: false,
      message: "Por favor, corrige los errores del formulario.",
      errors: formattedErrors,
    };
  }

  try {
    const response = await PageService.createPage(validatedFields.data);
    revalidateTag("pages-list");

    return {
      success: true,
      message: response.message || "Página creada con éxito.",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error inesperado al guardar la página.",
    };
  }
}

/**
 * Server Action para modificar una página existente
 */
export async function updatePageAction(
  prevState: PageActionState, 
  formData: FormData
): Promise<PageActionState> {
  await verifySession();

  const rawFormData = {
    id: formData.get("id") as string,
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    content: formData.get("content") as string,
    isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
    seo: {
      metaTitle: formData.get("metaTitle") as string,
      metaDescription: formData.get("metaDescription") as string,
    },
  };

  const validatedFields = updatePageSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    const formattedErrors: PageActionState["errors"] = {};
    const fieldErrors = validatedFields.error.flatten().fieldErrors;

    if (fieldErrors.id) formattedErrors.id = fieldErrors.id;
    if (fieldErrors.title) formattedErrors.title = fieldErrors.title;
    if (fieldErrors.slug) formattedErrors.slug = fieldErrors.slug;
    if (fieldErrors.content) formattedErrors.content = fieldErrors.content;
    if (fieldErrors.isActive) formattedErrors.isActive = fieldErrors.isActive;

    const seoErrors = validatedFields.error.format().seo;
    if (seoErrors?.metaTitle?._errors) formattedErrors["seo.metaTitle"] = seoErrors.metaTitle._errors;
    if (seoErrors?.metaDescription?._errors) formattedErrors["seo.metaDescription"] = seoErrors.metaDescription._errors;

    return {
      success: false,
      message: "Por favor, corrige los errores del formulario antes de actualizar.",
      errors: formattedErrors,
    };
  }

  try {
    const { id, ...updateData } = validatedFields.data;
    const response = await PageService.updatePage(id, updateData);
    
    revalidateTag("pages-list");
    revalidateTag(`page-${id}`);

    return {
      success: true,
      message: response.message || "Página actualizada con éxito.",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error inesperado al actualizar la página.",
    };
  }
}

/**
 * Server Action para eliminar una página de forma directa
 */
export async function deletePageAction(id: string): Promise<{ success: boolean; message: string }> {
  await verifySession();

  try {
    const response = await PageService.deletePage(id);
    revalidateTag("pages-list");

    return {
      success: true,
      message: response.message || "Página eliminada permanentemente.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Ocurrió un error al intentar eliminar la página.",
    };
  }
}