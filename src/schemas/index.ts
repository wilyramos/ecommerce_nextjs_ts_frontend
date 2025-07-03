import { User } from 'lucide-react';
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

// For register validation with user data

export const CheckoutRegisterSchema = z.object({
    nombre: z.string()
        .min(1, { message: 'El nombre es obligatorio' }),
    apellidos: z.string()
        .min(1, { message: 'Los apellidos son obligatorios' }),
    tipoDocumento: z.enum(['DNI', 'RUC', 'CE']),
    numeroDocumento: z.string()
        .min(1, { message: 'El número de documento es obligatorio' }),
    email: z.string()
        .email({ message: 'Email no válido' }),
    telefono: z.string()
        .min(1, { message: 'El teléfono es obligatorio' }),
})

export type CheckoutRegister = z.infer<typeof CheckoutRegisterSchema>;

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
    apellidos: z.string().optional(),
    tipoDocumento: z.enum(['DNI', 'RUC', 'CE']).optional(),
    numeroDocumento: z.string().optional(),
    telefono: z.string().optional(),
    email: z.string().email().optional(),
    rol: z.enum(['cliente', 'administrador', 'vendedor']).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    __v: z.number().optional(),
})

export type User = z.infer<typeof UserSchema>


// PRODUCT

export const VariantOptionSchema = z.object({
    nombre: z.string().min(1, { message: 'El nombre de la opción es obligatorio' }),
    valores: z.array(
        z.string().min(1, { message: 'Cada valor de la opción es obligatorio' })
    ).min(1, { message: 'Debe haber al menos un valor para la opción' })
});

export const VariantSchema = z.object({
    opciones: z.array(VariantOptionSchema).min(1, { message: 'Cada variante debe tener al menos una opción' }),
    stock: z.number().min(0, { message: 'El stock es obligatorio y debe ser mayor o igual a 0' }),
    barcode: z.string().optional().or(z.literal('')), // Permite opcional o cadena vacía
});

const AtributosProductSchema = z.record(z.string(), z.string());

// Create product schema
export const CreateProductSchema = z.object({
    nombre: z.string().min(1, { message: 'El nombre es obligatorio' }),
    descripcion: z.string().min(1, { message: 'La descripción es obligatoria' }),
    precio: z.number().min(0, { message: 'El precio es obligatorio' }),
    costo: z.number().min(0).optional(),
    categoria: z.string().min(1, { message: 'La categoría es obligatoria' }),
    stock: z.number().min(0, { message: 'El stock es obligatorio' }),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    imagenes: z.array(z.string()),
    variantes: z.array(VariantSchema).optional(),
    esDestacado: z.boolean().default(false).optional(),
    esNuevo: z.boolean().default(false).optional(),
    isActive: z.boolean().default(true),
    atributos: AtributosProductSchema.optional(),
});

export const ProductSchema = z.object({
    _id: z.string(),
    nombre: z.string(),
    slug: z.string().optional(),
    descripcion: z.string(),
    precio: z.number(),
    costo: z.number().optional(),
    imagenes: z.array(z.string()),
    categoria: z.string(),
    stock: z.number(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    isActive: z.boolean().default(true),
    esDestacado: z.boolean().default(false).optional(),
    esNuevo: z.boolean().default(false).optional(),
    variantes: z.array(VariantSchema).optional(),
    atributos: AtributosProductSchema.optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),

})

export type Variant = z.infer<typeof VariantSchema>
export type VariantOption = z.infer<typeof VariantOptionSchema>
export type Product = z.infer<typeof ProductSchema>
export const productsSchema = z.array(ProductSchema);

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

export const AttributeSchema = z.object({
    name: z.string().min(1, { message: 'El nombre del atributo es obligatorio' }),
    values: z.array(z.string().min(1, { message: 'Cada valor del atributo es obligatorio' }))
        .min(1, { message: 'Debe haber al menos un valor para el atributo' })
});


export const AttributesSchema = z.array(AttributeSchema)
export type Attribute = z.infer<typeof AttributeSchema>
export type Attributes = z.infer<typeof AttributesSchema>


export const CreateCategorySchema = z.object({
    nombre: z.string()
        .min(1, { message: 'El nombre es obligatorio' }),
    descripcion: z.string()
        .min(1, { message: 'La descripción es obligatoria' }),
    parent: z.string().nullable().optional(),
    attributes: AttributesSchema.optional(),
})

const CategorySchemaParent = z.object({
    _id: z.string(),
    nombre: z.string().min(1, { message: 'El nombre es obligatorio' }),
    parent: z.string().nullable().optional(), // Puede ser null si no tiene padre
});

export const CategorySchema = z.object({
    _id: z.string(),
    nombre: z.string(),
    slug: z.string(),
    parent: CategorySchemaParent.nullable().optional(), // Puede ser null si no tiene padre
    descripcion: z.string().optional(),
    attributes: z.array(AttributeSchema).optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    __v: z.number().optional(),
})

export const ProductAPIResponse = z.object({
    _id: z.string(),
    nombre: z.string(),
    slug: z.string().optional(),
    descripcion: z.string(),
    precio: z.number(),
    costo: z.number().optional(),
    imagenes: z.array(z.string()),
    categoria: z.string(),
    stock: z.number(),
    sku: z.string().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    __v: z.number().optional(),
    barcode: z.string().optional(),
    isActive: z.boolean().default(true), // Campo para indicar si el producto está activo
    variantes: z.array(VariantSchema).optional(),
    esDestacado: z.boolean().default(false).optional(),
    esNuevo: z.boolean().default(false).optional(),
    atributos: AtributosProductSchema.optional(),
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


//Enums 

const OrderStatusEnum = z.enum(['PENDIENTE', 'PROCESANDO', 'ENVIADO', 'ENTREGADO', 'CANCELADO']);
const PaymentMethodEnum = z.enum(['MERCADOPAGO', 'TARJETA', 'TRANSFERENCIA', 'YAPE', 'PLIN']);
const PaymentStatusEnum = z.enum(['PAGADO', 'PENDIENTE', 'CANCELADO']);

// Dirección de envío
export const ShippingAddressSchema = z.object({
    departamento: z.string().min(1, { message: 'El departamento es obligatorio' }),
    provincia: z.string().min(1, { message: 'La provincia es obligatoria' }),
    distrito: z.string().min(1, { message: 'El distrito es obligatorio' }),
    direccion: z.string().min(1, { message: 'La dirección es obligatoria' }),
    numero: z.string().optional(),
    piso: z.string().optional(),
    referencia: z.string().min(1, { message: 'La referencia es obligatoria' }),
});

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;


// Producto que se está pidiendo (solo se envía el ID)
export const OrderItemSchema = z.object({
    productId: z.string(),
    quantity: z.number().min(1, { message: 'La cantidad debe ser al menos 1' }),
    price: z.number().min(0, { message: 'El precio debe ser al menos 0' }),
});


// Creación de la orden
export const OrderCreateSchema = z.object({
    user: z.string().optional(),
    items: z.array(OrderItemSchema).min(1, { message: 'Debe haber al menos un producto en la orden' }),
    totalPrice: z.number().min(0, { message: 'El precio total es obligatorio y debe ser mayor o igual a 0' }),
    shippingAddress: ShippingAddressSchema,
    status: OrderStatusEnum.default('PENDIENTE'),
    paymentMethod: PaymentMethodEnum.default('MERCADOPAGO'),
    paymentStatus: PaymentStatusEnum.default('PENDIENTE'),
});

export type OrderCreateInput = z.infer<typeof OrderCreateSchema>;

// Respuesta de la API para una orden
export const OrderItemResponseSchema = z.object({
    product: ProductAPIResponse.or(z.string()), // Puede ser un objeto Product o un ID de producto
    quantity: z.number(),
    price: z.number(),
});

export const OrderResponseSchema = z.object({
    _id: z.string(),
    user: UserSchema.or(z.string()), // Puede ser un objeto User o un ID de usuario
    items: z.array(OrderItemResponseSchema),
    totalPrice: z.number(),
    shippingAddress: ShippingAddressSchema,
    status: OrderStatusEnum,
    paymentMethod: PaymentMethodEnum,
    paymentStatus: PaymentStatusEnum,
    trackingId: z.string().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    __v: z.number().optional(),
});

export type Order = z.infer<typeof OrderResponseSchema>;

export const OrdersListSchema = z.object({
    orders: z.array(OrderResponseSchema),
    totalOrders: z.number(),
    totalAmount: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
});

export type OrdersList = z.infer<typeof OrdersListSchema>;


// SALES

export const SaleSourceEnum = z.enum(['ONLINE', 'POS']);
export const SaleStatusEnum = z.enum(['COMPLETADA', 'REEMBOLSADA', 'ANULADA']);
export const SalePaymentMethodEnum = z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'YAPE', 'PLIN']);
export const SalePaymentStatusEnum = z.enum(['PAGADO', 'PENDIENTE', 'CANCELADO']);

export const SaleItemSchema = z.object({
    productId: z.string(), // para envío solo se usa el id
    quantity: z.number().min(1, { message: 'La cantidad debe ser al menos 1' }),
    price: z.number().min(0, { message: 'El precio debe ser al menos 0' }),
});


export const CreateSaleSchema = z.object({
    items: z.array(SaleItemSchema).min(1, { message: 'Debe tener al menos un producto' }),
    totalPrice: z.number().min(0),
    employee: z.string().optional(),
    customerDNI: z.string().optional(),

    totalDiscountAmount: z.number().min(0).optional(),
    source: SaleSourceEnum,
    order: z.string().optional(),
    status: SaleStatusEnum,
    paymentMethod: SalePaymentMethodEnum,
    paymentStatus: SalePaymentStatusEnum
});

export type CreateSaleInput = z.infer<typeof CreateSaleSchema>;


// Esquemas para ventas


export const SaleItemResponseSchema = z.object({
    product: ProductAPIResponse.or(z.string()), // puede venir populado o como id
    quantity: z.number(),
    price: z.number(),
});


export const SaleResponseSchema = z.object({
    _id: z.string(),
    customerDNI: z.string().optional(),
    employee: UserSchema.or(z.string()).optional().nullable(),
    items: z.array(SaleItemResponseSchema),
    totalPrice: z.number(),
    totalDiscountAmount: z.number().optional(),
    source: SaleSourceEnum,
    order: z.string().optional().nullable(),
    status: SaleStatusEnum,
    paymentMethod: SalePaymentMethodEnum,
    paymentStatus: SalePaymentStatusEnum,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    __v: z.number().optional(),
});

export type Sale = z.infer<typeof SaleResponseSchema>;

export const SalesAPIResponse = z.object({
    sales: z.array(SaleResponseSchema),
    totalSales: z.number(),
    totalAmount: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
});

// DNI

export const DniSchema = z.object({
    dni: z.string().length(8, { message: 'El DNI debe tener 8 dígitos' }),
});