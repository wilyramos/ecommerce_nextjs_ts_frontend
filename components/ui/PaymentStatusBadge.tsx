import { HiMiniCheckCircle, HiMiniClock, HiMiniXCircle } from "react-icons/hi2";
import clsx from "clsx";

interface Props {
    status: string;
}

export default function PaymentStatusBadge({ status }: Props) {
    const config = {
        PAGADO: {
            icon: <HiMiniCheckCircle className="text-green-600" />,
            color: "text-green-700",
            bg: "bg-green-50",
        },
        PENDIENTE: {
            icon: <HiMiniClock className="text-amber-500" />,
            color: "text-amber-700",
            bg: "bg-amber-50",
        },
        RECHAZADO: {
            icon: <HiMiniXCircle className="text-red-500" />,
            color: "text-red-700",
            bg: "bg-red-50",
        },
        FALLIDO: {
            icon: <HiMiniXCircle className="text-red-500" />,
            color: "text-red-700",
            bg: "bg-red-50",
        },
        approved: {
            icon: <HiMiniCheckCircle className="text-green-600" />,
            color: "text-green-700",
            bg: "bg-green-50",
        },
        pending: {
            icon: <HiMiniClock className="text-amber-500" />,
            color: "text-amber-700",
            bg: "bg-amber-50",
        },
        rejected: {
            icon: <HiMiniXCircle className="text-red-500" />,
            color: "text-red-700",
            bg: "bg-red-50",
        },
        failed: {
            icon: <HiMiniXCircle className="text-red-500" />,
            color: "text-red-700",
            bg: "bg-red-50",
        },
    };

    const { icon, color, bg } = config[status as keyof typeof config] ?? {
        icon: <HiMiniClock className="text-gray-400" />,
        color: "text-gray-700",
        bg: "bg-gray-50",
    };

    return (
        <span
            className={clsx(
                "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md",
                color,
                bg
            )}
        >
            {icon}
            <span className="capitalize">{status.toLowerCase()}</span>
        </span>
    );
}
