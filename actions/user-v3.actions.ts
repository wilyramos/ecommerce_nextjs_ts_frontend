// File: frontend/actions/user-v3.actions.ts
"use server";

import { revalidateTag, revalidatePath } from "next/cache";
import { getTokenOptional } from "@/src/auth/dal";
import { userService, USER_PROFILE_CACHE_TAG } from "@/src/services/user-v3.service";
import {
  UpdateProfileDTOSchema,
  type UserResponse,
} from "@/src/schemas/user-v3.schema";

export type ActionState<T = unknown> = {
  ok: boolean;
  message?: string;
  error?: string;
  data?: T;
  errors?: Record<string, string[]>;
} | null;

export async function getProfileUserAction(): Promise<{
  ok: boolean;
  data?: UserResponse;
  error?: string;
}> {
  const token = await getTokenOptional();
  if (!token) return { ok: false, error: "No autorizado. Inicie sesión." };

  try {
    const user = await userService.getProfile(token);
    return { ok: true, data: user };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error al obtener perfil.",
    };
  }
}

export async function updateProfileUserAction(
  _prevState: ActionState<UserResponse>,
  formData: FormData
): Promise<ActionState<UserResponse>> {
  const token = await getTokenOptional();
  if (!token) return { ok: false, error: "No autorizado. Inicie sesión." };

  try {
    const tipoDocumentoRaw = formData.get("tipoDocumento") as string | null;

    const rawDto: Record<string, unknown> = {
      nombre: (formData.get("nombre") as string)?.trim(),
      apellidos: (formData.get("apellidos") as string)?.trim() || undefined,
      tipoDocumento: tipoDocumentoRaw && tipoDocumentoRaw.trim() !== "" ? tipoDocumentoRaw.trim() : undefined,
      numeroDocumento: (formData.get("numeroDocumento") as string)?.trim() || undefined,
      telefono: (formData.get("telefono") as string)?.trim() || undefined,
      direccion: {
        departamento: (formData.get("departamento") as string)?.trim() || undefined,
        provincia: (formData.get("provincia") as string)?.trim() || undefined,
        distrito: (formData.get("distrito") as string)?.trim() || undefined,
        direccion: (formData.get("direccion") as string)?.trim() || undefined,
        numero: (formData.get("numero") as string)?.trim() || undefined,
        pisoDpto: (formData.get("pisoDpto") as string)?.trim() || undefined,
        referencia: (formData.get("referencia") as string)?.trim() || undefined,
      },
    };

    const validation = UpdateProfileDTOSchema.safeParse(rawDto);

    if (!validation.success) {
      return {
        ok: false,
        error: validation.error.errors[0]?.message || "Error en los campos ingresados.",
        errors: validation.error.flatten().fieldErrors,
      };
    }

    const updatedUser = await userService.updateProfile(validation.data, token);

    revalidateTag(USER_PROFILE_CACHE_TAG);
    revalidatePath("/profile");

    return {
      ok: true,
      message: "Perfil y dirección actualizados correctamente.",
      data: updatedUser,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error al actualizar el perfil.",
    };
  }
}