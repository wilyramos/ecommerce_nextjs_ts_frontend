// File: frontend/src/types/checkout.types.ts

export interface Culqi3DSParameters {
    eci: string;
    xid: string;
    cavv: string;
    protocolVersion: string;
    directoryServerTransactionId: string;
}

export interface LocalOrder {
    _id: string;
    orderNumber: string;
    totalPrice: number;
    culqiOrderId?: string;
    customerProfile: { email: string };
}

// Tipo recursivo para soportar anidamientos seguros de response.data.data
export type ApiBaseResponse<T> = Partial<T> & {
    data?: ApiBaseResponse<T>;
    message?: string;
    needs3DS?: boolean;
    is3DS?: boolean;
};

export type CheckoutResponse = ApiBaseResponse<LocalOrder>;
export type ChargeResponse = ApiBaseResponse<Record<string, unknown>>;

export interface HttpErrorResponse {
    response?: {
        data?: ChargeResponse;
        status?: number;
    };
    data?: ChargeResponse;
    message?: string;
    needs3DS?: boolean;
    is3DS?: boolean;
}