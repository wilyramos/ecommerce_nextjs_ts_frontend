// File: frontend/src/services/order-v3.service.ts
import { HttpClient, apiHttpClient } from "@/src/lib/http-client";
import { 
    OrderResponseSchema, 
    OrderResponse, 
    ApiResponseSchema,
    PaginatedOrderResponseSchema
} from "../schemas/order-v3.schema";

export class OrderService {
    constructor(private readonly http: HttpClient) { }

    /**
     * Obtiene una orden por su número correlativo (ej. 1234567890)
     */
    async getByOrderNumber(orderNumber: string, token?: string): Promise<OrderResponse> {
        const ResponseSchema = ApiResponseSchema(OrderResponseSchema);

        const response = await this.http.get<unknown>(`/orders/v3/number/${orderNumber}`, {
            token,
            cache: "no-store",
        });

        const parsed = ResponseSchema.parse(response);
        return parsed.data;
    }

    /**
     * Obtiene el historial de órdenes del usuario autenticado
     */
    async getMyOrders(token: string, page = 1): Promise<{ data: OrderResponse[], total: number }> {
        // 1. Usamos <unknown> en lugar de <any> por seguridad
        const response = await this.http.get<unknown>(`/orders/v3/my-orders?page=${page}&limit=10`, {
            token,
            cache: "no-store",
        });
        
        // 2. Parseamos con Zod para garantizar las propiedades y tipado seguro
        const parsed = PaginatedOrderResponseSchema.parse(response);
        
        return {
            data: parsed.data,
            total: parsed.total
        };
    }
}

export const orderService = new OrderService(apiHttpClient);