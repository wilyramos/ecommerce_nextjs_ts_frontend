import {
    FaShieldAlt,
    FaCreditCard,
    FaUniversity,
    FaMobileAlt,
    FaShippingFast,
    FaUndoAlt,
} from "react-icons/fa";

// Datos de los beneficios
const items = [
    {
        icon: <FaShieldAlt className="text-gray-600 text-xl" />,
        label: "Compras Garantizadas",
    },
    {
        icon: <FaCreditCard className="text-gray-600 text-xl" />,
        label: "Tarjetas Crédito / Débito",
    },
    {
        icon: <FaUniversity className="text-gray-600 text-xl" />,
        label: "Transferencias Bancarias",
    },
    {
        icon: <FaMobileAlt className="text-gray-600 text-xl" />,
        label: "Yape / Plin",
    },
    {
        icon: <FaShippingFast className="text-gray-600 text-xl" />,
        label: "Envíos Rápidos",
    },
    {
        icon: <FaUndoAlt className="text-gray-600 text-xl" />,
        label: "Devoluciones Fáciles",
    },
];

// Componente principal
export default function ComprasGarantizadas() {
    return (
        <section className="w-full max-w-6xl mx-auto mt-10 px-4">
            <div className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-4">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="min-w-[160px] flex flex-col items-center text-center text-sm text-gray-700 hover:text-black transition bg-gray-50 p-6 rounded-2xl shadow-xl hover:shadow-lg cursor-pointer"
                    >
                        <div className="mb-2">{item.icon}</div>
                        <span className="whitespace-nowrap">{item.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
