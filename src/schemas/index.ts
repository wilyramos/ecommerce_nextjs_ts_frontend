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
    role: z.enum(['cliente', 'administrador', 'vendedor']),
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
    nombre: z.string().optional(),
    email: z.string().email().optional(),
    rol: z.enum(['cliente', 'administrador', 'vendedor']).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    __v: z.number().optional(),
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
    barcode: z.string().optional(),
    brand: z.string().optional(),
    color: z.string().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    __v: z.number().optional(),
})

const brand = z.enum([
    'Iphone',
    'Samsung',
    'Ifans',
]);

// Create product schema
export const CreateProductSchema = z.object({
    nombre: z.string().min(1, { message: 'El nombre es obligatorio' }),
    descripcion: z.string().min(1, { message: 'La descripción es obligatoria' }),
    precio: z.number().min(0, { message: 'El precio es obligatorio' }),
    categoria: z.string().min(1, { message: 'La categoría es obligatoria' }),
    stock: z.number().min(0, { message: 'El stock es obligatorio' }),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    brand: brand.optional(),
    color: z.string().optional(),
    imagenes: z.array(z.string())
});


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


const ProductObjectSchema = ProductAPIResponse.pick({
    _id: true,
    nombre: true,
    imagenes: true,
})

const OrderProductSchema = z.object({
    product: ProductObjectSchema,
    quantity: z.number().min(1, { message: 'La cantidad debe ser al menos 1' }),
    price: z.number().min(0, { message: 'El precio debe ser al menos 0' }),
});

const OrderProductSchemaWithId = OrderProductSchema.extend({
    product: z.string().optional(), // Para mantener compatibilidad con el backend
});

export const OrderSchema = z.object({
    user: z.string().optional(), // TODO: implementar el login
    items: z.array(OrderProductSchemaWithId).min(1, { message: 'El pedido no puede estar vacío' }),
    totalPrice: z.number().min(0, { message: 'El total debe ser al menos 0' }),
    shippingAddress: shippingAddress,
    status: z.enum(['PENDIENTE', 'ENVIADO', 'ENTREGADO', 'CANCELADO']),
    paymentMethod: z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'PAYPAL']),
});

export const OrderAPIResponse = z.object({

    _id: z.string(),
    user: UserSchema.nullable(), // User can be null if not logged in
    items: z.array(OrderProductSchemaWithId),
    totalPrice: z.number(),
    shippingAddress: shippingAddress,
    status: z.enum(['PENDIENTE', 'ENVIADO', 'ENTREGADO', 'CANCELADO']),
    paymentMethod: z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'PAYPAL']),
    trackingId: z.string().optional(),
    createdAt: z.string().datetime().optional(),
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


export const OrderAPIResponseSchema = z.object({
    _id: z.string(),
    user: UserSchema.nullable(), // User can be null if not logged in
    items: z.array(OrderProductSchema),
    totalPrice: z.number(),
    shippingAddress: shippingAddress,
    status: z.enum(['PENDIENTE', 'ENVIADO', 'ENTREGADO', 'CANCELADO']),
    paymentMethod: z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'PAYPAL']),
    trackingId: z.string().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    __v: z.number().optional(),
});
export type OrderAPIResponseType = z.infer<typeof OrderAPIResponseSchema>;


// SALES


export const CreateSaleSchema = z.object({
    items: z.array(z.object({
        product: z.string().min(1).max(100),
        quantity: z.number().min(1),
        price: z.number().min(0)
    })).min(1),
    totalPrice: z.number().min(0),
    totalDiscountAmount: z.number().min(0).default(0),
    source: z.enum(['ONLINE', 'POS']).default('POS'),
    order: z.string().optional(),
    status: z.enum(['COMPLETADA', 'REEMBOLSADA', 'ANULADA']).default("COMPLETADA"),
    paymentMethod: z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'YAPE', 'PLIN']).default('EFECTIVO'),
    paymentStatus: z.enum(['PAGADO', 'PENDIENTE', 'CANCELADO']).default("PAGADO"),
    customerDNI: z.string().optional(), // ID del cliente, puede ser null si no se asigna un cliente
    employee: z.string().optional(), // ID del empleado, puede ser null si no se asigna un empleado
});

export type CreateSaleInput = z.infer<typeof CreateSaleSchema>;

const SaleProductSchema = z.object({
    product: ProductObjectSchema,
    quantity: z.number().min(1, { message: 'La cantidad debe ser al menos 1' }),
    price: z.number().min(0, { message: 'El precio debe ser al menos 0' }),
});

export const SaleAPIResponse = z.object({
    _id: z.string(),
    items: z.array(SaleProductSchema),
    totalDiscountAmount: z.number().min(0).default(0),
    source: z.enum(['ONLINE', 'POS']).default('POS'),
    status: z.enum(['COMPLETADA', 'REEMBOLSADA', 'ANULADA']).default("COMPLETADA"),
    paymentMethod: z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'YAPE', 'PLIN']).default('EFECTIVO'),
    paymentStatus: z.enum(['PAGADO', 'PENDIENTE', 'CANCELADO']).default("PAGADO"),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    totalPrice: z.number().min(0),
    customerDNI: z.string().optional(), // DNI del cliente, si existe
    employee: UserSchema.nullable().optional(), // ID del empleado, si existe
    order: z.string().optional(), // ID de la orden asociada, si existe
    __v: z.number().optional(),
});

export type Sale = z.infer<typeof SaleAPIResponse>;

export const SalesAPIResponse = z.object({
    sales: z.array(SaleAPIResponse),
    totalSales: z.number(),
    totalAmount: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
});

// DNI

export const DniSchema = z.object({
    dni: z.string().length(8, { message: 'El DNI debe tener 8 dígitos' }),
});