import Image from "next/image";

export default function PaymentMethods() {
    return (
        <section className="py-2">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center gap-8 max-w-md mx-auto">

                    <div className="relative w-10 h-6 ">
                        <Image src="/payments/visa.png" alt="Visa" fill className="object-contain" />
                    </div>

                    <div className="relative w-10 h-6 ">
                        <Image src="/payments/mastercard.png" alt="Mastercard" fill className="object-contain" />
                    </div>

                    <div className="relative w-10 h-6 ">
                        <Image src="/payments/amex.png" alt="American Express" fill className="object-contain" />
                    </div>

                    <div className="relative w-10 h-6 ">
                        <Image src="/payments/mp.png" alt="Mercado Pago" fill className="object-contain" />
                    </div>

                    <div className="relative w-10 h-6 ">
                        <Image src="/payments/yape.png" alt="Yape" fill className="object-contain" />
                    </div>

                </div>
            </div>
        </section>
    );
}
