import Image from "next/image";

export default function PaymentMethods() {
    const methods = [
        { src: "/payments/visa-small.svg", alt: "Visa" },
        { src: "/payments/master-small.svg", alt: "Mastercard" },
        { src: "/payments/amex-small.svg", alt: "American Express" },
        { src: "/payments/yape-small.svg", alt: "Yape" },
        { src: "/payments/pagoefectivo-small.svg", alt: "PagoEfectivo" },
        { src: "/payments/cuotelao-small.svg", alt: "Cuotealo" },
    ];

    return (
        <div className="flex items-center gap-2 ">
            {methods.map(({ src, alt }) => (
                <div key={alt} className="relative w-8 h-6 md:w-8 md:h-6 shrink-0">
                    <Image src={src} alt={alt} fill className="object-contain" sizes="36px" unoptimized />
                </div>
            ))}
        </div>
    );
}