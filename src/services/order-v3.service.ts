// File: frontend/src/services/order-v3.service.ts
import { HttpClient, apiHttpClient } from "@/src/lib/http-client";
import { OrderResponseSchema, OrderResponse, ApiResponseSchema } from "../schemas/order-v3.schema";

export class OrderService {
    constructor(private readonly http: HttpClient) { }

    /**
     * Obtiene una orden por su número correlativo (ej. 1234567890)
     * Pasamos el token opcionalmente por si el backend lo requiere a futuro 
     * para mostrar datos sensibles (facturación, etc).
     */
    async getByOrderNumber(orderNumber: string, token?: string): Promise<OrderResponse> {
        const ResponseSchema = ApiResponseSchema(OrderResponseSchema);

        // Cache configurado en "no-store" porque el estado de una orden 
        // recién pagada puede cambiar en milisegundos (webhooks).
        const response = await this.http.get<unknown>(`/orders/v3/number/${orderNumber}`, {
            token,
            cache: "no-store",
        });

        const parsed = ResponseSchema.parse(response);
        return parsed.data;
    }
}

export const orderService = new OrderService(apiHttpClient);