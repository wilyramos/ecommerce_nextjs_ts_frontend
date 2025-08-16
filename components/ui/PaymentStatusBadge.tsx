import { HiMiniCheckCircle, HiMiniClock, HiMiniXCircle } from "react-icons/hi2";
import clsx from "clsx";

interface Props {
    status: string;
}

export default function PaymentStatusBadge({ status }: Props) {
    const config = {
        approved: {
            icon: <HiMiniCheckCircle className="text-green-500" />,
            color: "text-green-600",
            border: "border-green-200",
        },
        pending: {
            icon: <HiMiniClock className="text-amber-500" />,
            color: "text-amber-600",
            border: "border-amber-200",
        },
        rejected: {
            icon: <HiMiniXCircle className="text-red-500" />,
            color: "text-red-600",
            border: "border-red-200",
        },
        failed: {
            icon: <HiMiniXCircle className="text-red-500" />,
            color: "text-red-600",
            border: "border-red-200",
        },
    };

    const { icon, color, border } = config[status as keyof typeof config] ?? {
        icon: <HiMiniClock className="text-gray-400" />,
        color: "text-gray-600",
        border: "border-gray-200",
    };

    return (
        <span
            className={clsx(
                "inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full border",
                color,
                border
            )}
        >
            {icon}
            <span className="capitalize">{status.toLowerCase()}</span>
        </span>
    );
}