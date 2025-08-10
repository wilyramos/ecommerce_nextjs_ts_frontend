import { createOrderAction } from "@/actions/order/create-order-action";
import { useCartStore } from "@/src/store/cartStore";
import type { CreateOrderInput } from "../schemas";
// import { OrderStatusEnum } from "../schemas";

import type { ShippingAddress } from '../schemas';



export interface PaymentResponse extends Record<string, unknown> {
  transaction_amount: number;
  payment_method_id: string;
  status: string;
  shippingMethod?: string;
}
 

export async function handlePaymentSuccess(paymentResponse: PaymentResponse, shipping?: ShippingAddress) {


    console.log("Respuesta de PAYMEET:", paymentResponse);
    try {
        // 1. Obtener carrito y datos de usuario
        const { cart, clearCart } = useCartStore.getState();

        // 2. Preparar datos para la orden
        const orderData : CreateOrderInput = {
            items: cart.map(item => ({
                productId: item._id,
                quantity: item.cantidad,
                price: item.precio,
            })),
            subtotal: paymentResponse.transaction_amount,
            shippingCost: 0,
            totalPrice: paymentResponse.transaction_amount,
            status: "PENDIENTE",
            paymentMethod: paymentResponse.payment_method_id,
            paymentStatus: paymentResponse.status,
            shippingMethod: paymentResponse.shippingMethod as string,
            shippingAddress: {
                departamento: shipping?.departamento || '',
                provincia: shipping?.provincia || '',
                distrito: shipping?.distrito || '',
                direccion: shipping?.direccion || '',
                numero: shipping?.numero || '',
                piso: shipping?.piso || '',
                referencia: shipping?.referencia || '',
            },
        };

        console.log("Datos de la orden:", orderData);
    

        // 3. Crear orden en backend
        const { order } = await createOrderAction(orderData);

        // 4. Limpiar carrito
        clearCart();

        // 5. Redirigir a confirmación

        window.location.href = `/checkout-result/success?orderId=${order._id}`;

    } catch (error) {
        console.error("Error creando la orden:", error);
        alert("Hubo un problema registrando tu orden. Contáctanos.");
    }
}
