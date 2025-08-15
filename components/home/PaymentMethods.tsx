import Image from "next/image";
import {
    FaCcVisa,
    FaCcMastercard
} from "react-icons/fa";

export default function PaymentMethods() {
    const icons = [
        { icon: <FaCcVisa />, label: "Visa", className: "text-blue-700" },
        { icon: <FaCcMastercard />, label: "Mastercard", className: "text-gray-500" },
    ];

    return (
        <section className="max-w-7xl mx-auto">
            <div className="flex justify-center gap-8 items-center text-gray-700 text-6xl">
                {icons.map(({ icon, label, className }) => (
                    <div
                        key={label}
                        title={label}
                        className={`cursor-default  opacity-80 hover:opacity-100 transition ${className}`}
                    >
                        {icon}
                    </div>
                ))}

                {/* Yape como imagen */}
                <div title="Yape" className="cursor-default opacity-80 hover:opacity-100 transition w-8 h-8 relative">
                    <Image src="/yape.png" alt="Yape" fill 
                     />
                </div>
            </div>
        </section>
    );
}
