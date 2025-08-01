import { z } from 'zod';

// For register validation
export const RegisterSchema = z.object({
    email: z.string()
        .email({ message: 'Email no válido' }),
    nombre: z.string()
        .min(1, { message: 'El nombre es obligatorio' }),
    password: z.string()
        .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
    //     password_confirmation: z.string(),
    // }).refine((data) => data.password === data.password_confirmation, {
    //     message: 'Las contraseñas no coinciden',
    //     path: ['password_confirmation'],
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


// Schema para el user edit

export const BaseUserSchema = z.object({
    nombre: z.string().optional(),
    apellidos: z.string().optional(),
    tipoDocumento: z.enum(['DNI', 'RUC', 'CE']).optional(),
    numeroDocumento: z.string().optional(),
    telefono: z.string().optional(),
    email: z.string().email().optional(),
    rol: z.enum(['cliente', 'administrador', 'vendedor']).optional(),
    googleId: z.string().optional(),
})


export const UserEditSchema = BaseUserSchema.extend({
    _id: z.string().optional(),
})

export const UserSchema = z.object({
    _id: z.string(),
    nombre: z.string().optional(),
    apellidos: z.string().optional(),
    tipoDocumento: z.enum(['DNI', 'RUC', 'CE']).optional(),
    numeroDocumento: z.string().optional(),
    telefono: z.string().optional(),
    email: z.string().email().optional(),
    rol: z.enum(['cliente', 'administrador', 'vendedor']).optional(),
    googleId: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    __v: z.number().optional(),
})


export type User = z.infer<typeof UserSchema>

//TODO:HACER SCHEMAS ESCALABLES PARA CATEGORY Y PRODUCT





// ************* NEW CATEGORY **************//
// ***********************************
// //////////////////////////////****
// ********************************* */


export const categoryAttributeSchema = z.object({
    name: z.string().min(1, 'El nombre del atributo es obligatorio'),
    values: z.array(z.string().min(1, 'El valor no puede estar vacío')),
});

export const categoryAttributesArraySchema = z.array(categoryAttributeSchema);


export const categoryBaseSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    descripcion: z.string().optional(),
    slug: z.string().optional(),
    parent: z.string().nullable().optional(),
    attributes: categoryAttributesArraySchema.optional(),
});

// Create category
export const createCategorySchema = categoryBaseSchema;
// Update category
export const updateCategorySchema = categoryBaseSchema.partial();

export const categoryParentSchema = z.object({
    _id: z.string(),
    nombre: z.string(),
    slug: z.string().optional(),
});


// Response category
export const apiCategorySchema = categoryBaseSchema.extend({
    _id: z.string(),
    slug: z.string().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
    __v: z.number().optional(),
    parent: z.union([z.string(), categoryParentSchema]).nullable().optional(),
});

export type categoryParentSchemaType = z.infer<typeof categoryParentSchema>;
export const apiCategoryListSchema = z.array(apiCategorySchema);
export type CategoryResponse = z.infer<typeof apiCategorySchema>;
export type CategoryListResponse = z.infer<typeof apiCategoryListSchema>;


// *****************************************//


/* PRODUCTS NUEVO */

const atributosSchema = z.record(z.string(), z.string());

export const productBaseSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    slug: z.string().optional(),
    descripcion: z.string().optional(),
    precio: z.number().min(0, 'El precio no puede ser negativo').optional(),
    costo: z.number().min(0, 'El costo no puede ser negativo').optional(),
    imagenes: z.array(z.string().url('Debe ser una URL válida')).optional(),
    categoria: z.string().min(1, 'La categoría es obligatoria'),
    stock: z.number().min(0, 'El stock no puede ser negativo').optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    isActive: z.boolean().optional().default(true),
    esDestacado: z.boolean().optional().default(false),
    esNuevo: z.boolean().optional().default(false),
    atributos: atributosSchema.optional(),
});

// Create product

export const createProductSchema = productBaseSchema.extend({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    categoria: z.string().min(1, 'La categoría es obligatoria'),
});

// Update product
export const updateProductSchema = productBaseSchema.partial();


// Product response schema
export const ApiProductSchema = productBaseSchema
    .omit({
        slug: true,
    })
    .extend({
        _id: z.string(),
        slug: z.string(),
        createdAt: z.string().datetime().optional(),
        updatedAt: z.string().datetime().optional(),
        __v: z.number().optional(),
});

export const productsAPIResponse = z.object({
    products: z.array(ApiProductSchema),
    totalPages: z.number(),
    currentPage: z.number(),
    totalProducts: z.number(),
})

// Type inference

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductResponse = z.infer<typeof ApiProductSchema>;

export type ProductsAPIResponse = z.infer<typeof productsAPIResponse>;


// Producto con la categoría poblada (en vez de solo un string)
export const ApiProductWithCategorySchema = ApiProductSchema.extend({
  categoria: apiCategorySchema, // Reemplazo del string por el esquema de categoría
});


export const productsWithCategoryAPIResponse = z.object({
    products: z.array(ApiProductWithCategorySchema),
    totalPages: z.number(),
    currentPage: z.number(),
    totalProducts: z.number(),
});

export type ProductWithCategoryResponse = z.infer<typeof ApiProductWithCategorySchema>;

/* **********************************************
*************************************************


END END END 



*************************************************
*/


export const AttributeSchema = z.object({
    name: z.string().min(1, { message: 'El nombre del atributo es obligatorio' }),
    values: z.array(z.string().min(1, { message: 'Cada valor del atributo es obligatorio' }))
        .min(1, { message: 'Debe haber al menos un valor para el atributo' })
});


export const AttributesSchema = z.array(AttributeSchema)
export type Attribute = z.infer<typeof AttributeSchema>
export type Attributes = z.infer<typeof AttributesSchema>


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
    descripcion: z.string().min(1, { message: 'La descripciónn es obligatoria' }),
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

// Response API
export const ProductSchema = z.object({
    _id: z.string(),
    nombre: z.string(),
    slug: z.string().optional(),
    descripcion: z.string().optional(),
    precio: z.number(),
    costo: z.number().optional(),
    imagenes: z.array(z.string()),
    categoria: CategorySchema.optional(),
    stock: z.number(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    isActive: z.boolean().default(true).optional(),
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



export const ProductAPIResponse = z.object({
    _id: z.string(),
    nombre: z.string(),
    slug: z.string().optional(),
    descripcion: z.string().optional(),
    precio: z.number(),
    costo: z.number().optional(),
    imagenes: z.array(z.string()),
    categoria: CategorySchema.optional(),
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

export const ProductAPIResponseInPopulate = ProductAPIResponse.pick({
    _id: true,
    nombre: true,
    imagenes: true,
    sku: true,
    updatedAt: true,
    barcode: true,
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
    stock: true,
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
    departamento: z.string(),
    provincia: z.string(),
    distrito: z.string(),
    direccion: z.string(),
    numero: z.string().optional(),
    piso: z.string().optional(),
    referencia: z.string().optional(),
});

export type ShippingAddress = z.infer<typeof ShippingAddressSchema>;


// Producto que se está pidiendo (solo se envía el ID)
export const OrderItemSchema = z.object({
    productId: z.string().min(1, { message: 'El ID del producto es obligatorio' }),
    quantity: z.number().min(1, { message: 'La cantidad debe ser al menos 1' }),
    price: z.number().min(0, { message: 'El precio debe ser al menos 0' }),
});

export const statusHistorySchema = z.object({
    status: OrderStatusEnum,
    changedAt: z.string().datetime().default(() => new Date().toISOString()),
});


// Creación de la orden
export const CreateOrderSchema = z.object({
    items: z.array(OrderItemSchema).min(1, { message: 'Debe haber al menos un producto en la orden' }),
    subtotal: z.number().nonnegative(),
    shippingCost: z.number().nonnegative(),
    totalPrice: z.number().nonnegative(),
    shippingAddress: ShippingAddressSchema,
    status: OrderStatusEnum.default('PENDIENTE').optional(),
    shippingMethod: z.string(),
    notes: z.string().optional(),
});

// Respuesta de la orden populada

// item de la orden

const ProductSchemaOrder = z.object({
    productId: ProductAPIResponseInPopulate.nullable(),
    quantity: z.number(),
    price: z.number()
})

export const OrderResponseSchemaPopulate = z.object({
    _id: z.string(),
    user: UserSchema,
    items: z.array(ProductSchemaOrder),
    subtotal: z.number(),
    shippingCost: z.number(),
    totalPrice: z.number(),
    shippingAddress: ShippingAddressSchema,
    status: OrderStatusEnum,
    statusHistory: z.array(statusHistorySchema).optional(),
    shippingMethod: z.string(),
    paymentMethod: PaymentMethodEnum,
    paymentStatus: PaymentStatusEnum,
    trackingId: z.string().optional(),
    isPrinted: z.boolean().default(false).optional(),
    paymentId: z.string().optional(),
    notes: z.string().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
})

// Respuesta de la orden de la api
export const OrderResponseSchema = z.object({
    _id: z.string(),
    user: UserSchema.or(z.string()).optional().nullable(),
    items: z.array(OrderItemSchema),
    subtotal: z.number(),
    shippingCost: z.number(),
    totalPrice: z.number(),
    shippingAddress: ShippingAddressSchema,
    status: OrderStatusEnum,
    statusHistory: z.array(statusHistorySchema).optional(),
    shippingMethod: z.string(),
    paymentMethod: PaymentMethodEnum,
    paymentStatus: PaymentStatusEnum,
    trackingId: z.string().optional(),
    isPrinted: z.boolean().default(false).optional(),
    paymentId: z.string().optional(),
    notes: z.string().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});

// inferencias 
export type Order = z.infer<typeof OrderResponseSchemaPopulate>;
export const OrdersAPIResponse = z.object({
    orders: z.array(OrderResponseSchema),
    totalOrders: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
});
export type OrdersList = z.infer<typeof OrdersAPIResponse>;


// Payload para enviar a mercadopago

export const PreferenceItemSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string().optional(),
    quantity: z.number(),
    unit_price: z.number().nonnegative(),
    currency_id: z.string().default('PEN'),
    picture_url: z.string().optional(),
});

export const PreferencePayerSchema = z.object({
    email: z.string().email({ message: 'Email no válido' }),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    phone: z.object({
        area_code: z.string().optional(),
        number: z.string().optional(),
    }).optional(),
});

export const CreatePreferenceSchema = z.object({
    items: z.array(PreferenceItemSchema),
    payer: PreferencePayerSchema,
    orderId: z.string()
});

// Inferencias
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
export type CreatePreferenceInput = z.infer<typeof CreatePreferenceSchema>;

// Esquemas para izipay


export const IzipayTokenSchema = z.object({
    token: z.string(),
});





//** SALES **//

export const SaleSourceEnum = z.enum(['ONLINE', 'POS']);
export const SaleStatusEnum = z.enum(['COMPLETADA', 'REEMBOLSADA', 'ANULADA']);
export const SalePaymentMethodEnum = z.enum(['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'YAPE', 'PLIN', 'MERCADOPAGO', 'OTRO']);
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
    product: ProductAPIResponseInPopulate.or(z.string()), // puede venir populado o como id
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


// Izipay

export type IzipayOptions = {
     public_key: string;
  amount: number;
  currency: 'PEN' | 'USD';
  order_id: string;
  customer: {
    name: string;
    email: string;
  };
  metadata?: Record<string, string>;
  callback_url?: string;
}; 

export type IzipayInstance = {
  open: () => void;
    close: () => void; 
}

export interface Window {
    Izipay?: {
        new (options: IzipayOptions): IzipayInstance;
    };
}