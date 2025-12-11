import { FaClock, FaCheck, FaTimes, FaTruck } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import clsx from "clsx";

interface Props {
    status: string;
}

export default function OrderStatusBadge({ status }: Props) {
    const getStatusStyle = () => {
        switch (status) {
            case "awaiting_payment":
                return {
                    color: "text-yellow-600",
                    bg: "bg-yellow-50",
                    icon: <FaClock className="w-3 h-3" />,
                    label: "Pendiente de pago",
                };
            case "processing":
                return {
                    color: "text-blue-600",
                    bg: "bg-blue-50",
                    icon: <FaTruck className="w-3 h-3" />,
                    label: "Procesando",
                };
            case "shipped":
                return {
                    color: "text-indigo-600",
                    bg: "bg-indigo-50",
                    icon: <MdLocalShipping className="w-3 h-3" />,
                    label: "Enviado",
                };
            case "delivered":
                return {
                    color: "text-green-600",
                    bg: "bg-green-50",
                    icon: <FaCheck className="w-3 h-3" />,
                    label: "Entregado",
                };
            case "canceled":
                return {
                    color: "text-red-600",
                    bg: "bg-red-50",
                    icon: <FaTimes className="w-3 h-3" />,
                    label: "Cancelado",
                };
            case "paid_but_out_of_stock":
                return {
                    color: "text-orange-600",
                    bg: "bg-orange-50",
                    icon: <FaClock className="w-3 h-3" />,
                    label: "Sin stock",
                };
            default:
                return {
                    color: "text-gray-600",
                    bg: "bg-gray-50",
                    icon: <FaClock className="w-3 h-3" />,
                    label: "Desconocido",
                };
        }
    };

    const { color, bg, icon, label } = getStatusStyle();

    return (
        <span
            className={clsx(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                color,
                bg
            )}
        >
            {icon}
            <div className="hidden md:block">
            {label}

            </div>
        </span>
    );
}
