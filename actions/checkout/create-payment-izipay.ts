"use server";

export type IzipayPaymentPayload = {
  amount: number;
  currency: string;
  orderId: string;
  customer: {
    email: string;
    reference: string;
    billingDetails: {
      address: string;
      city: string;
      country: string;
      district: string;
      phoneNumber: string;
    };
    shippingDetails: {
      address: string;
      city: string;
      country: string;
      district: string;
      phoneNumber: string;
    };
    shoppingCart: {
      productId: string;
      quantity: number;
    }[];
  };
};

export async function createPaymentIzipay(
  paymentData: IzipayPaymentPayload
): Promise<{ formToken: string }> {

  const url = process.env.API_URL;
  const response = await fetch(
    `${url}/checkout/izipay/create-payment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
      // Next.js fetch: no-cache para siempre pedir fresh (opcional)
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error creando pago Izipay: ${errorText}`);
  }

  const data = await response.json();

  const formToken = data?.paymentData?.answer?.formToken;

  if (!formToken) {
    throw new Error("No se recibió el token de formulario en la respuesta");
  }

  return { formToken };
}
