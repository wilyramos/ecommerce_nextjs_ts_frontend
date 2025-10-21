import Image from "next/image";


export default function PaymentMethods() {

    return (
        <section className="bg-white py-2">
            <div className="max-w-7xl mx-auto px-4 ">
                <h3 className=" text-gray-800 mb-2">
                    Métodos de pago:
                </h3>
                <div className="flex items-center gap-8 text-5xl">

                    
                    <div className="relative w-10 h-10">
                        <Image src="/payments/1.webp" alt="Visa" fill className="object-contain" />
                    </div>
                    <div className="relative w-10 h-10">
                        <Image src="/payments/2.webp" alt="Mastercard" fill className="object-contain" />
                    </div>
                    <div className="relative w-10 h-10">
                        <Image src="/payments/3.webp" alt="Plin" fill className="object-contain" />
                    </div>
                   
                    <div className="relative w-10 h-10">
                        <Image src="/payments/4.webp" alt="Yape" fill className="object-contain" />
                    </div>
                   
                    <div className="relative w-10 h-10">
                        <Image src="/payments/5.webp" alt="Mercado Pago" fill className="object-contain" />
                    </div>
                </div>

            </div>
        </section >
    );
}
