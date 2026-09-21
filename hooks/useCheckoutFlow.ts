// File: frontend/hooks/useCheckoutFlow.ts
'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useCartStore } from '@/src/store/cartStore';
import { useCheckoutStoreV2 } from '@/src/store/checkoutStoreV2';
import { CheckoutService } from '@/src/services/checkout-v3.service';
import { useCulqiCheckoutWith3DS } from '@/hooks/useCulqiCheckoutWith3DS';

import {
    CustomerProfileSchema,
    ShippingAddressSchema,
    CreateOrderDTOSchema,
    type CreateOrderDTO
} from '@/src/schemas/order.schema';

import type { LocalOrder, Culqi3DSParameters, HttpErrorResponse } from '@/src/types/checkout.types';

const loadScript = (scriptId: string, src: string, timeout = 10000): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (document.getElementById(scriptId)) return resolve();

        const timer = window.setTimeout(() => reject(new Error(`Timeout script: ${src}`)), timeout);
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = src;
        script.async = true;

        script.onload = () => { window.clearTimeout(timer); resolve(); };
        script.onerror = () => { window.clearTimeout(timer); reject(new Error(`Error script: ${src}`)); };

        document.body.appendChild(script);
    });
};

const getCulqi3DS = () => typeof window !== 'undefined' ? window.Culqi3DS || null : null;

const resetCulqi3DS = () => {
    const Culqi3DS = getCulqi3DS();
    if (Culqi3DS && typeof Culqi3DS.reset === 'function') {
        try {
            Culqi3DS.reset();
        } catch (error) {
            console.warn('[Checkout] ⚠️ Error en reset de Culqi3DS:', error);
        }
    }
};

export function useCheckoutFlow() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [is3DSLoading, setIs3DSLoading] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const { cart, clearCart } = useCartStore();
    const { customerProfile, shippingAddress, notes, appliedDiscount } = useCheckoutStoreV2();

    const localOrderRef = useRef<LocalOrder | null>(null);
    const currentTokenIdRef = useRef<string | null>(null);
    const currentDeviceIdRef = useRef<string | null>(null);
    const messageHandlerRef = useRef<((event: MessageEvent) => void) | null>(null);

    // Banderas de control de flujo
    const isProgrammaticCloseRef = useRef<boolean>(false);

    useEffect(() => {
        const initializeCulqi = async () => {
            try {
                if (!document.getElementById('culqi-3ds-container')) {
                    const container = document.createElement('div');
                    container.id = 'culqi-3ds-container';
                    document.body.appendChild(container);
                }

                await loadScript('culqi-3ds-script-core', 'https://3ds.culqi.com');
                await loadScript('culqi-checkout-script-core', 'https://js.culqi.com/checkout-js');

                if (window.Culqi3DS && typeof window.Culqi3DS.initAuthentication === 'function' && !window.Culqi3DS_Original) {
                    window.Culqi3DS_Original = window.Culqi3DS;
                }
                if (window.Culqi3DS_Original) {
                    window.Culqi3DS = window.Culqi3DS_Original;
                }
            } catch (error) {
                toast.error('Ocurrió un error al cargar el sistema de pagos.');
                console.error('[Checkout] ❌ Error inicializando Culqi:', error);
            }
        };

        void initializeCulqi();
    }, []);

    const { openCulqiModal, closeCulqiModal } = useCulqiCheckoutWith3DS({
        onToken: async (tokenId: string): Promise<void> => {
            const currentOrder = localOrderRef.current;
            if (!currentOrder) {
                setIsLoading(false);
                toast.error('No existe una orden local válida.');
                return;
            }

            currentTokenIdRef.current = tokenId;
            setIsLoading(true);

            try {
                const Culqi3DS = getCulqi3DS();
                let deviceId = "default-device-id";

                if (Culqi3DS) {
                    Culqi3DS.publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;
                    if (typeof Culqi3DS.generateDevice === 'function') {
                        try {
                            const generatedId = await Culqi3DS.generateDevice();
                            if (generatedId) deviceId = generatedId;
                        } catch (e) {
                            console.warn('⚠️ Error al generar deviceId', e);
                        }
                    }
                }
                currentDeviceIdRef.current = deviceId;

                const responseData = await CheckoutService.processCharge(currentOrder._id, tokenId, deviceId);

                // Si necesita 3DS
                if (responseData?.needs3DS === true || responseData?.is3DS === true) {
                    isProgrammaticCloseRef.current = true;
                    closeCulqiModal();
                    setIs3DSLoading(true);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await initiate3DS(tokenId, currentOrder.customerProfile.email);
                    return;
                }

                // Éxito Sin 3DS
                isProgrammaticCloseRef.current = true;
                closeCulqiModal();
                resetCulqi3DS();
                clearCart();
                toast.success('Pago procesado correctamente');
                router.push(`/checkout-result/success?order=${currentOrder.orderNumber}`);

            } catch (error: unknown) {
                const err = error as HttpErrorResponse;
                const errData = err.response?.data?.data || err.response?.data || err.data || err;
                const is3DS = errData?.needs3DS === true || errData?.is3DS === true || err?.needs3DS === true;

                if (is3DS) {
                    isProgrammaticCloseRef.current = true;
                    closeCulqiModal();
                    setIs3DSLoading(true);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await initiate3DS(currentTokenIdRef.current as string, currentOrder.customerProfile.email);
                    return;
                }

                // Error real
                isProgrammaticCloseRef.current = true;
                closeCulqiModal();
                resetCulqi3DS();
                setIsLoading(false);
                toast.error(errData?.message || err.message || 'Error al procesar el pago');
            }
        },

        onOrderAsynchronous: () => {
            const currentOrder = localOrderRef.current;
            if (!currentOrder) return;
            isProgrammaticCloseRef.current = true;
            closeCulqiModal();
            resetCulqi3DS();
            clearCart();
            router.push(`/checkout-result/pending?order=${currentOrder.orderNumber}`);
        },

        onError: (errorMessage: string) => {
            isProgrammaticCloseRef.current = true;
            closeCulqiModal();
            resetCulqi3DS();
            setIsLoading(false);
            setIs3DSLoading(false);
            toast.error(errorMessage);
        },

        // Si el usuario cierra el modal de Culqi o hace clic fuera
        onClose: () => {
            if (isProgrammaticCloseRef.current) {
                return; // Nosotros lo cerramos por código (Ej. para el 3DS), ignorar.
            }

            // El usuario cerró el modal manualmente, apagamos el estado "Procesando..."
            console.log('[Checkout] ℹ️ El usuario cerró el modal. Liberando estado de carga...');
            resetCulqi3DS();
            setIsLoading(false);
            setIs3DSLoading(false);
        }
    });

    const processCharge3DS = async (parameters3DS: Culqi3DSParameters): Promise<void> => {
        const currentOrder = localOrderRef.current;
        const tokenId = currentTokenIdRef.current;
        const deviceId = currentDeviceIdRef.current;

        if (!currentOrder || !tokenId || !deviceId) {
            setIs3DSLoading(false);
            setIsLoading(false);
            toast.error('Se perdieron los datos de la autenticación.');
            return;
        }

        try {
            const responseData = await CheckoutService.processCharge(currentOrder._id, tokenId, deviceId, parameters3DS);

            if (responseData?.needs3DS === true) {
                throw new Error('La transacción todavía requiere autenticación 3DS.');
            }

            toast.success('Autenticación y pago exitosos');
            resetCulqi3DS();
            clearCart();
            router.push(`/checkout-result/success?order=${currentOrder.orderNumber}`);

        } catch (error: unknown) {
            const err = error as HttpErrorResponse;
            resetCulqi3DS();
            setIsLoading(false);
            toast.error(err.response?.data?.data?.message || err.message || 'Error al completar 3DS.');
        } finally {
            setIs3DSLoading(false);
        }
    };

    const initiate3DS = async (tokenId: string, email: string): Promise<void> => {
        return new Promise((resolve) => {
            const Culqi3DS = getCulqi3DS();
            const currentOrder = localOrderRef.current;

            if (!Culqi3DS || typeof Culqi3DS.initAuthentication !== 'function' || !currentOrder) {
                setIs3DSLoading(false);
                setIsLoading(false);
                toast.error('Sistema de autenticación bancaria no disponible.');
                return resolve();
            }

            setIs3DSLoading(true);

            if (messageHandlerRef.current) {
                window.removeEventListener('message', messageHandlerRef.current, false);
            }

            const handleMessage = (event: MessageEvent) => {
                if (event.origin !== window.location.origin) return;

                const response = event.data as Record<string, unknown>;

                if (response?.error) {
                    cleanup();
                    resetCulqi3DS();
                    setIs3DSLoading(false);
                    setIsLoading(false); // Liberar si falla 3DS
                    toast.error(typeof response.error === 'string' ? response.error : 'No se pudo autenticar la transacción.');
                    return resolve();
                }

                if (response?.parameters3DS) {
                    cleanup();
                    void processCharge3DS(response.parameters3DS as Culqi3DSParameters);
                    return resolve();
                }
            };

            const cleanup = () => {
                window.removeEventListener('message', handleMessage, false);
                messageHandlerRef.current = null;
            };

            messageHandlerRef.current = handleMessage;
            window.addEventListener('message', handleMessage, false);

            const publicKey = process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY;
            if (!publicKey) {
                cleanup();
                setIs3DSLoading(false);
                setIsLoading(false);
                toast.error('La llave pública de Culqi no está configurada.');
                return resolve();
            }

            Culqi3DS.publicKey = publicKey;
            Culqi3DS.settings = {
                charge: {
                    totalAmount: Math.round(Number(currentOrder.totalPrice) * 100),
                    currency: 'PEN',
                    returnUrl: `${window.location.origin}/checkout-v3`
                },
                card: { email: email.trim().toLowerCase() }
            };

            Culqi3DS.options = {
                showModal: true,
                showLoading: true,
                showIcon: true,
                style: { btnColor: '#00A19B', btnTextColor: '#FFFFFF' }
            };

            try {
                Culqi3DS.initAuthentication(tokenId);
            } catch (error) {
                console.error('[Checkout] Error iniciando autenticación 3DS:', error);
                cleanup();
                setIs3DSLoading(false);
                setIsLoading(false);
                toast.error('No se pudo iniciar la autenticación 3DS.');
                resolve();
            }
        });
    };

    const validateForm = useCallback((): boolean => {
        const profileResult = CustomerProfileSchema.safeParse(customerProfile);
        const addressResult = ShippingAddressSchema.safeParse(shippingAddress);

        const errors: Record<string, string> = {};

        if (!profileResult.success) {
            profileResult.error.issues.forEach(i => errors[`customerProfile.${i.path[0]}`] = i.message);
        }
        if (!addressResult.success) {
            addressResult.error.issues.forEach(i => errors[`shippingAddress.${i.path[0]}`] = i.message);
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [customerProfile, shippingAddress]);

    const handlePayClick = async (): Promise<void> => {
        if (!validateForm()) {
            toast.warning('Revisa los campos requeridos en el formulario.');
            return;
        }

        if (cart.length === 0) {
            toast.warning('El carrito está vacío.');
            return;
        }

        if (typeof window.CulqiCheckout === 'undefined') {
            toast.info('El sistema de pagos está cargando. Intenta en un momento.');
            return;
        }

        // Antes de proceder, marcamos isLoading y garantizamos que la bandera de cierre está limpia
        setIsLoading(true);
        isProgrammaticCloseRef.current = false;

        try {
            const payload: CreateOrderDTO = CreateOrderDTOSchema.parse({
                customerProfile,
                shippingAddress,
                items: cart.map((item) => ({
                    productId: item._id,
                    variantId: item.variant?._id,
                    quantity: item.cantidad
                })),
                notes: notes.trim() || undefined,
                currency: 'PEN',
                discountCode: appliedDiscount?.code
            });

            // Siempre creamos una orden limpia
            const orderData = await CheckoutService.createOrder(payload);

            if (!orderData?.culqiOrderId || !orderData.totalPrice || !orderData._id) {
                throw new Error('Error al crear la orden localmente');
            }

            localOrderRef.current = orderData as LocalOrder;
            currentTokenIdRef.current = null;
            currentDeviceIdRef.current = null;

            openCulqiModal({
                settings: {
                    title: 'GoPhone',
                    currency: 'PEN',
                    amount: Math.round(Number(orderData.totalPrice) * 100),
                    order: String(orderData.culqiOrderId).trim()
                },
                client: {
                    email: customerProfile?.email?.trim().toLowerCase() || ''
                },
                options: {
                    lang: 'es',
                    installments: true,
                    modal: true,
                    paymentMethods: { tarjeta: true, yape: true, billetera: true, bancaMovil: true, agente: true, cuotealo: true }
                }
            });

        } catch (error: unknown) {
            const err = error as HttpErrorResponse;
            toast.error(err?.message || 'Error inesperado al iniciar el pago.');
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        is3DSLoading,
        formErrors,
        setFormErrors,
        handlePayClick
    };
}