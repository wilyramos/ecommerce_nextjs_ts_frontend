import { z } from "zod";

// --- Schema de Validación del Formulario ---
export const lineFormSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  slug: z.string().optional(),
  brand: z.string().min(24, { message: "Debes seleccionar una marca válida." }), // Mongo ID
  category: z.string().optional(),
  isActive: z.boolean().default(true),
  description: z.string().optional(),
});

export type LineFormValues = z.infer<typeof lineFormSchema>;

// --- Tipos de la Entidad (Backend Response) ---
interface BaseEntity {
  _id: string;
  nombre: string;
  slug: string;
}

export interface ProductLine {
  _id: string;
  nombre: string;
  slug: string;
  brand: BaseEntity;
  category?: BaseEntity;
  isActive: boolean;
  createdAt: string;
}

// --- NUEVO: Tipos para Server Actions (Movido aquí para evitar el error) ---
export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  timestamp?: number;
};

export const initialState: ActionState = {
  success: false,
  message: "",
};