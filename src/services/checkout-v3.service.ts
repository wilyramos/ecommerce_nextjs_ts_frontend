// File: frontend/src/services/checkout.service.ts

import { apiHttpClient } from '@/src/lib/http-client';
import type { CreateOrderDTO } from '@/src/schemas/order.schema';
import type { CheckoutResponse, ChargeResponse, Culqi3DSParameters } from '@/src/types/checkout.types';

export const CheckoutService = {
    /**
     * Crea la orden localmente y en Culqi.
     */
    async createOrder(payload: CreateOrderDTO): Promise<CheckoutResponse> {
        const response = await apiHttpClient.post<CheckoutResponse>('/orders/v3/checkout', payload);
        // Desempaquetado seguro
        return response.data?.data || response.data || response;
    },

    /**
     * Procesa el cargo, soporta flujo normal y flujo 3DS.
     */
    async processCharge(
        orderId: string,
        tokenId: string,
        deviceId: string,
        parameters3DS?: Culqi3DSParameters
    ): Promise<ChargeResponse> {
        const payload = {
            tokenId,
            deviceFingerPrintId: deviceId,
            ...(parameters3DS && { authentication_3DS: parameters3DS })
        };

        const response = await apiHttpClient.post<ChargeResponse>(
            `/orders/v3/${orderId}/charge`,
            payload
        );

        return response.data?.data || response.data || response;
    }
};