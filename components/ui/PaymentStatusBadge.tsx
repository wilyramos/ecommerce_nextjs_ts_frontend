import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import clsx from "clsx";

interface Props {
    status: string;
}

export default function PaymentStatusBadge({ status }: Props) {
    const config = {
        PAGADO: {
            icon: <FaCheckCircle className="text-green-500" />,
            color: "text-green-700",
            bg: "bg-green-100",
        },
        PENDIENTE: {
            icon: <FaClock className="text-yellow-600" />,
            color: "text-yellow-700",
            bg: "bg-yellow-100",
        },
        RECHAZADO: {
            icon: <FaTimesCircle className="text-red-500" />,
            color: "text-red-700",
            bg: "bg-red-100",
        },
        FALLIDO: {
            icon: <FaTimesCircle className="text-red-500" />,
            color: "text-red-700",
            bg: "bg-red-100",
        },
    };

    const { icon, color, bg } = config[status as keyof typeof config] ?? {
        icon: <FaClock className="text-gray-500" />,
        color: "text-gray-700",
        bg: "bg-gray-100",
    };

    return (
        <span className={clsx("inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full", color, bg)}>
            {icon}
        </span>
    );
}
