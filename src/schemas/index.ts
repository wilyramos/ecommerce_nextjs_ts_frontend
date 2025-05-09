import { z } from 'zod';

// For register validation
export const RegisterSchema = z.object({
    email: z.string()
        .email({ message: 'Email no válido' }),
    nombre: z.string()
        .min(1, { message: 'El nombre es obligatorio' }),
    password: z.string()
        .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
});

// For login validation

export const LoginSchema = z.object({
    email: z.string()
        .email({ message: 'Email no válido' }),
    password: z.string()
        .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
})


// For succes validation

export const SuccessSchemaRegister = z.object({
    message: z.string(),
    userId: z.string(),
    token: z.string(),
})


// Infeteria del succes y añadir el rol

export const SuccessSchemaLogin = z.object({
    message: z.string(),
    token: z.string(),
    role: z.enum(['cliente', 'administrador']),
})

// succes for forgot password

export const SuccessSchemaForgotPassword = z.object({
    message: z.string(),
})


export const ErrorResponseSchema = z.object({
    message: z.string(),
})

export const ForgotPasswordSchema = z.object({
    email: z.string()
        .email({ message: 'Email no válido' }),
})

// schema for error response with message
export const ErrorResponse = z.object({
    message: z.string(),
})

// schema for success response with message
export const SuccessResponse = z.object({
    message: z.string(),
})

// Schema for token validation

export const TokenSchema = z.string({ message: "Token inválido" })
    .length(6, { message: "Token inválido" })

export const SuccessSchemaTokenValidation = z.object({
    message: z.string(),
})

// Schema for reset password
export const resetPasswordSchema = z.object({
    password: z.string()
        .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['password_confirmation'],
});


// Schema para el user - get user

export const UserSchema = z.object({
    _id: z.string(),
    nombre: z.string(),
    email: z.string().email(),
    rol: z.enum(['cliente', 'administrador']),
    createdAt: z.string(),
    updatedAt: z.string(),
    __v: z.number(),
})

export type User = z.infer<typeof UserSchema>



// PRODUCT

export const ProductSchema = z.object({
    _id: z.string(),
    nombre: z.string(),
    descripcion: z.string(),
    precio: z.number(),
    imagenes: z.array(z.string()),
    categoria: z.string(),
    stock: z.number(),
    sku: z.string().optional(),
})

// Create product schema
export const CreateProductSchema = z.object({
    nombre: z.string()
        .min(1, { message: 'El nombre es obligatorio' }),
    descripcion: z.string()
        .min(1, { message: 'La descripción es obligatoria' }),
    precio: z.number()
        .min(0, { message: 'El precio es obligatorio' }),
    categoria: z.string()
        .min(1, { message: 'La categoría es obligatoria' }),
    stock: z.number()
        .min(0, { message: 'El stock es obligatorio' }),
})



export type Product = z.infer<typeof ProductSchema>
export const ProductsAPIResponse = z.object({
    products: z.array(ProductSchema),
    totalPages: z.number(),
    currentPage: z.number(),
    totalProducts: z.number(),
})
export type ProductsList = z.infer<typeof ProductsAPIResponse>


// CATEGORY

export const CreateCategorySchema = z.object({
    nombre: z.string()
        .min(1, { message: 'El nombre es obligatorio' }),
    descripcion: z.string()
        .min(1, { message: 'La descripción es obligatoria' }),
})

export const CategorySchema = z.object({
    _id: z.string(),
    nombre: z.string(),
    descripcion: z.string(),
    slug: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    __v: z.number(),
})

export const CategoryAPIResponseProduct = CategorySchema.pick({
    _id: true,
    nombre: true,
    slug: true,
})

export const ProductAPIResponse = z.object({
    _id: z.string(),
    nombre: z.string(),
    descripcion: z.string(),
    precio: z.number(),
    imagenes: z.array(z.string()),
    categoria: CategoryAPIResponseProduct,
    stock: z.number(),
    sku: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
    __v: z.number(),
})

export type ProductAPIResponseType = z.infer<typeof ProductAPIResponse>
export const CategoriesAPIResponse = z.array(CategorySchema)
export const CategoryAPIResponse = CategorySchema
export type Category = z.infer<typeof CategorySchema>
export type CategoriasList = z.infer<typeof CategoriesAPIResponse>