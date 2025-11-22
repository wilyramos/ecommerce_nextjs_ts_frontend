// 'use client';

// import { useEffect, useState } from 'react';

// interface MercadoPagoConstructor {
//     new(publicKey: string, options?: { locale?: string }): MercadoPagoInstance;
// }

// interface MercadoPagoInstance {
//     cardForm(options: CardFormOptions): void;
// }

// interface CardFormOptions {
//     amount: string;
//     autoMount: boolean;
//     form: {
//         id: string;
//         cardholderName: FieldConfig;
//         cardholderEmail: FieldConfig;
//         cardNumber: FieldConfig;
//         expirationDate: FieldConfig;
//         securityCode: FieldConfig;
//         installments: FieldConfig;
//         identificationType: FieldConfig;
//         identificationNumber: FieldConfig;
//         issuer: FieldConfig;
//     };
//     callbacks: {
//         onFormMounted: (error: unknown) => void;
//     };
// }

// interface FieldConfig {
//     id: string;
//     placeholder: string;
// }

// declare global {
//     interface Window {
//         MercadoPago: MercadoPagoConstructor;
//     }
// }

// export default function ClientCheckoutWrapper() {
//     const [mercadoPago, setMercadoPago] = useState<MercadoPagoInstance | null>(null);

//     useEffect(() => {
//         const mpKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY;
//         console.log("🔑 MercadoPago Public Key:", mpKey);

//         const checkSDK = () => {
//             if (typeof window !== "undefined" && window.MercadoPago && mpKey) {
//                 console.log("✅ MercadoPago SDK disponible");
//                 const mpInstance = new window.MercadoPago(mpKey, {
//                     locale: 'es-PE',
//                 });
//                 setMercadoPago(mpInstance);
//             } else {
//                 console.warn("❌ MercadoPago SDK o clave pública no disponible");
//             }
//         };

//         const interval = setInterval(() => {
//             if (window.MercadoPago) {
//                 checkSDK();
//                 clearInterval(interval);
//             }
//         }, 100);

//         return () => clearInterval(interval);
//     }, []);

//     useEffect(() => {
//         if (mercadoPago) {
//             console.log("🚀 Instancia MercadoPago creada", mercadoPago);

//             mercadoPago.cardForm({
//                 amount: "100",
//                 autoMount: true,
//                 form: {
//                     id: "form-checkout",
//                     cardholderName: {
//                         id: "form-checkout__cardholderName",
//                         placeholder: "Nombre del titular",
//                     },
//                     cardholderEmail: {
//                         id: "form-checkout__cardholderEmail",
//                         placeholder: "Email",
//                     },
//                     cardNumber: {
//                         id: "form-checkout__cardNumber",
//                         placeholder: "Número de tarjeta",
//                     },
//                     expirationDate: {
//                         id: "form-checkout__expirationDate",
//                         placeholder: "MM/YY",
//                     },
//                     securityCode: {
//                         id: "form-checkout__securityCode",
//                         placeholder: "CVC",
//                     },
//                     installments: {
//                         id: "form-checkout__installments",
//                         placeholder: "Cuotas",
//                     },
//                     identificationType: {
//                         id: "form-checkout__identificationType",
//                         placeholder: "Tipo de documento",
//                     },
//                     identificationNumber: {
//                         id: "form-checkout__identificationNumber",
//                         placeholder: "Número de documento",
//                     },
//                     issuer: {
//                         id: "form-checkout__issuer",
//                         placeholder: "Banco emisor",
//                     },
//                 },
//                 callbacks: {
//                     onFormMounted: function (error) {
//                         if (error) return console.warn("Error al montar el formulario", error);
//                         console.log("✅ Formulario montado correctamente");
//                     },
//                 },
//             });
//         }
//     }, [mercadoPago]);

//     return (
//         <form
//             id="form-checkout"
//             className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 space-y-4"
//         >
//             <h2 className="text-xl font-semibold text-gray-800">Pago con tarjeta</h2>

//             <input id="form-checkout__cardholderName" type="text" className="input-style" placeholder="Nombre del titular" />
//             <input id="form-checkout__cardholderEmail" type="email" className="input-style" placeholder="Correo electrónico" />
//             <input id="form-checkout__cardNumber" type="text" className="input-style" placeholder="Número de tarjeta" />

//             <div className="flex gap-2">
//                 <input id="form-checkout__expirationDate" type="text" className="input-style w-1/2" placeholder="MM/YY" />
//                 <input id="form-checkout__securityCode" type="text" className="input-style w-1/2" placeholder="CVC" />
//             </div>

//             <select id="form-checkout__installments" className="input-style bg-white"></select>
//             <select id="form-checkout__issuer" className="input-style bg-white"></select>
//             <select id="form-checkout__identificationType" className="input-style bg-white"></select>

//             <input id="form-checkout__identificationNumber" type="text" className="input-style" placeholder="Número de documento" />

//             <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//                 Pagar
//             </button>
//         </form>
//     );
// }
