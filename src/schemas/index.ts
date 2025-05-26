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
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    __v: z.number().optional(),
})

// Create product schema
export const CreateProductSchema = z.object({
    nombre: z.string().min(1, { message: 'El nombre es obligatorio' }),
    descripcion: z.string().min(1, { message: 'La descripción es obligatoria' }),
    precio: z.number().min(0, { message: 'El precio es obligatorio' }),
    categoria: z.string().min(1, { message: 'La categoría es obligatoria' }),
    stock: z.number().min(0, { message: 'El stock es obligatorio' }),
    imagenes: z.array(z.string())
})


export type Product = z.infer<typeof ProductSchema>
export const ProductsAPIResponse = z.object({
    products: z.array(ProductSchema),
    totalPages: z.number(),
    currentPage: z.number(),
    totalProducts: z.number(),
})
export type ProductsList = z.infer<typeof ProductsAPIResponse>

// image 

export const ImageSchemaResponse = z.object({
    images: z.array(z.string()),
})

// CATEGORIA

export const CreateCategorySchema = z.object({
    nombre: z.string()
        .min(1, { message: 'El nombre es obligatorio' }),
    descripcion: z.string()
        .min(1, { message: 'La descripción es obligatoria' }),
})

export const CategorySchema = z.object({
    _id: z.string(),
    nombre: z.string(),
    descripcion: z.string().optional(),
    slug: z.string(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    __v: z.number().optional(),
})

export const ProductAPIResponse = z.object({
    _id: z.string(),
    nombre: z.string(),
    descripcion: z.string(),
    precio: z.number(),
    imagenes: z.array(z.string()),
    categoria: CategorySchema,
    stock: z.number(),
    sku: z.string().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    __v: z.number().optional(),
})

export type ProductType = z.infer<typeof ProductAPIResponse>

export const ProductAPIResponseList = z.object({
    products: z.array(ProductAPIResponse),
    totalPages: z.number(),
    currentPage: z.number(),
    totalProducts: z.number(),
})
export type ProductList = z.infer<typeof ProductAPIResponseList>

export type ProductAPIResponseType = z.infer<typeof ProductAPIResponse>

export const CategoryAPIResponse = CategorySchema
export type Category = z.infer<typeof CategorySchema>

export const CategoriesAPIResponse = z.array(CategorySchema)
export type CategoriasList = z.infer<typeof CategoriesAPIResponse>

// CART
const CartItemSchema = ProductSchema.pick({
    _id: true,
    nombre: true,
    precio: true,
    imagenes: true,
}).extend({
    cantidad: z.number().min(1, { message: 'La cantidad debe ser al menos 1' }),
    subtotal: z.number().min(0, { message: 'El subtotal debe ser al menos 0' }),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export const CartSchema = z.object({
    cart: z.array(CartItemSchema),
    total: z.number(),
});
export type Cart = z.infer<typeof CartSchema>;

// ORDER

export const shippingAddress = z.object({
    direccion: z.string().min(1, { message: 'La dirección es obligatoria' }),
    ciudad: z.string().min(1, { message: 'La ciudad es obligatoria' }),
    telefono: z.string().min(1, { message: 'El teléfono es obligatorio' }),
});

const OrderProductSchema = z.object({
    productId: z.string().min(1, { message: 'El ID del producto es obligatorio' }),
    quantity: z.number().min(1, { message: 'La cantidad debe ser al menos 1' }),
    price: z.number().min(0, { message: 'El precio debe ser al menos 0' }),
});

export const OrderSchema = z.object({
    user: z.string().optional(), // TODO: implementar el login
    items: z.array(OrderProductSchema).min(1, { message: 'El pedido no puede estar vacío' }),
    totalPrice: z.number().min(0, { message: 'El total debe ser al menos 0' }),
    shippingAddress: shippingAddress,
    status: z.enum(['PENDIENTE', 'ENVIADO', 'ENTREGADO', 'CANCELADO']),
    paymentMethod: z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'PAYPAL']),
});

export const OrderAPIResponse = z.object({

    _id: z.string().nullable(), // Order ID can be null if not created yet
    user: UserSchema.nullable(), // User can be null if not logged in
    items: z.array(OrderProductSchema),
    totalPrice: z.number(),
    shippingAddress: shippingAddress,
    status: z.enum(['PENDIENTE', 'ENVIADO', 'ENTREGADO', 'CANCELADO']),
    paymentMethod: z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'PAYPAL']),
    trackingId: z.string().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().optional(),
    __v: z.number().optional(),
})

export const OrdersAPIResponse = z.object({
    orders: z.array(OrderAPIResponse),
    totalOrders: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
});

export type Order = z.infer<typeof OrderAPIResponse>;
export type OrdersList = z.infer<typeof OrdersAPIResponse>;