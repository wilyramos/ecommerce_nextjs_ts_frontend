// File: frontend/src/schemas/user-v3.schema.ts
import { z } from "zod";

export const UserRoleSchema = z.enum(["cliente", "administrador", "vendedor"]);
export const TipoDocumentoSchema = z.enum(["DNI", "RUC", "CE"]);

export const UserAddressSchema = z.object({
  departamento: z.string().trim().optional(),
  provincia: z.string().trim().optional(),
  distrito: z.string().trim().optional(),
  direccion: z.string().trim().optional(),
  numero: z.string().trim().optional(),
  pisoDpto: z.string().trim().optional(),
  referencia: z.string().trim().optional(),
});

export type UserAddress = z.infer<typeof UserAddressSchema>;

// ── 1. Esquema Base de Usuario ─────────────────────────────────────────────

export const UserBaseSchema = z.object({
  _id: z.string(),
  nombre: z.string().min(1, "El nombre es requerido"),
  apellidos: z.string().optional(),
  tipoDocumento: TipoDocumentoSchema.optional(),
  numeroDocumento: z.string().optional(),
  email: z.string().email("Correo electrónico inválido"),
  telefono: z.string().optional(),
  direccion: UserAddressSchema.optional().default({}),
  rol: UserRoleSchema.default("cliente"),
  isActive: z.boolean().default(true),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type UserResponse = z.infer<typeof UserBaseSchema>;

// ── 2. Esquemas de Mutación de Perfil (Cliente) ───────────────────────────

export const UpdateProfileDTOSchema = z.object({
  nombre: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellidos: z.string().trim().optional(),
  tipoDocumento: TipoDocumentoSchema.optional(),
  numeroDocumento: z.string().trim().optional(),
  telefono: z.string().trim().optional(),
  direccion: UserAddressSchema.optional(),
});

export type UpdateProfileDTO = z.infer<typeof UpdateProfileDTOSchema>;

// ── 3. Envoltorio Genérico de Respuesta API ───────────────────────────────

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    statusCode: z.number(),
    message: z.string(),
    data: dataSchema,
    timestamp: z.string().optional(),
  });