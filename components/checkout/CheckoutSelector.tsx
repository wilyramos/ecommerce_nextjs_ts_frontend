'use client';

import { useCartStore } from '@/src/store/cartStore';
import { useCheckoutStore } from '@/src/store/checkoutStore';
import { iniciarCheckoutMP } from '@/src/payments/mercadopago';
import { SiMercadopago } from 'react-icons/si';
import { FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import Image from 'next/image';

export default function CheckoutSelector() {
    const { cart } = useCartStore();
    const { shipping, profile } = useCheckoutStore();

    if (!cart || cart.length === 0) {
        return (
            <div className="flex flex-col items-center mt-6 gap-4">
                <p className="text-gray-500">El carrito está vacío</p>
            </div>
        );
    }
    if (!shipping || !profile) {
        return (
            <div className="flex flex-col items-center mt-6 gap-4">
                <p className="text-gray-500">Por favor, completa tu información de envío y perfil antes de continuar.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center mt-6 gap-4">
            <button
                onClick={() => iniciarCheckoutMP(cart, shipping, profile)}
                className="w-full max-w-md p-5 border rounded-3xl bg-white hover:bg-gray-50 transition cursor-pointer"
            >
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100">
                        <SiMercadopago size={22} className="text-[#009ee3]" />
                    </div>
                    <span className="font-medium text-sm">Pagar con MercadoPago</span>
                </div>

                <div className="flex items-center gap-4 pl-12">
                    <FaCcVisa size={48} className="text-blue-600" />
                    <FaCcMastercard size={48} />
                    <Image src="/yape.png" alt="Yape" width={44} height={44} className="rounded-md" />
                </div>
            </button>
        </div>
    );
}
