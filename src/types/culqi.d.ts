// File: frontend/src/types/culqi.d.ts

// ─── TIPOS PARA CULQI CHECKOUT V4 ──────────────────────────────────────────

export interface CulqiPaymentMethods {
  tarjeta?: boolean;
  yape?: boolean;
  billetera?: boolean;
  bancaMovil?: boolean;
  agente?: boolean;
  cuotealo?: boolean;
}

export interface CulqiCheckoutOptions {
  lang?: string;
  installments?: boolean;
  modal?: boolean;
  paymentMethods?: CulqiPaymentMethods;
}

export interface CulqiCheckoutSettings {
  title?: string;
  currency?: string;
  amount?: number;
  order?: string;
}

export interface CulqiCheckoutClient {
  email?: string;
}

export interface CulqiCheckoutConfig {
  settings: CulqiCheckoutSettings;
  client: CulqiCheckoutClient;
  options?: CulqiCheckoutOptions;
  appearance?: Record<string, unknown>;
}

export interface CulqiToken {
  id: string;
  [key: string]: unknown;
}

export interface CulqiError {
  user_message?: string;
  merchant_message?: string;
  [key: string]: unknown;
}

// Interfaz para la instancia principal de Culqi
export interface CulqiSingletonInstance {
  open: () => void;
  close: () => void;
  culqi?: () => void;
  publicKey?: string;
  settings?: CulqiCheckoutSettings;
  client?: CulqiCheckoutClient;
  options?: CulqiCheckoutOptions;
  appearance?: Record<string, unknown>;
  token?: CulqiToken | null;
  order?: Record<string, unknown> | null;
  closeEvent?: unknown | null;
  error?: CulqiError | null;
}

// ─── TIPOS PARA CULQI 3DS ──────────────────────────────────────────────────

export interface Culqi3DSSettings {
  charge?: {
    totalAmount: number;
    currency: string;
    returnUrl: string;
  };
  card?: {
    email: string;
  };
}

export interface Culqi3DSOptions {
  showModal: boolean;
  showLoading: boolean;
  showIcon: boolean;
  style?: {
    btnColor?: string;
    btnTextColor?: string;
  };
}

export interface Culqi3DSInterface {
  publicKey?: string;
  settings?: Culqi3DSSettings;
  options?: Culqi3DSOptions;
  init?: () => void;
  initAuthentication?: (tokenId: string) => void;
  generateDevice?: () => Promise<string>;
  reset?: () => void;
}

// ─── EXTENSIÓN DEL OBJETO GLOBAL WINDOW ────────────────────────────────────

declare global {
  interface Window {
    // Al instanciar, garantizamos que devuelve la interfaz correcta (no 'unknown')
    CulqiCheckout: new (publicKey: string, config: CulqiCheckoutConfig) => CulqiSingletonInstance;
    Culqi3DS?: Culqi3DSInterface;
    Culqi3DS_Original?: Culqi3DSInterface;
    culqi: () => void;
    _culqiSingletonInstance?: CulqiSingletonInstance;
  }
}

export {};