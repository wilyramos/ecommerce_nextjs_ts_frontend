import { FaClock, FaCheckCircle, FaTimesCircle, FaTruck } from "react-icons/fa";
import { MdLocalShipping } from "react-icons/md";
import clsx from "clsx";

interface Props {
    status: string;
}

export default function OrderStatusBadge({ status }: Props) {
    const getStatusStyle = () => {
        switch (status) {
            case "PENDIENTE":
                return {
                    color: "text-yellow-700",
                    bg: "bg-yellow-100",
                    icon: <FaClock className="text-yellow-500" />,
                };
            case "PROCESANDO":
                return {
                    color: "text-blue-700",
                    bg: "bg-blue-100",
                    icon: <FaTruck className="text-blue-500" />,
                };
            case "ENVIADO":
                return {
                    color: "text-indigo-700",
                    bg: "bg-indigo-100",
                    icon: <MdLocalShipping className="text-indigo-500" />,
                };
            case "ENTREGADO":
                return {
                    color: "text-green-700",
                    bg: "bg-green-100",
                    icon: <FaCheckCircle className="text-green-500" />,
                };
            case "CANCELADO":
                return {
                    color: "text-red-700",
                    bg: "bg-red-100",
                    icon: <FaTimesCircle className="text-red-500" />,
                };
            default:
                return {
                    color: "text-gray-700",
                    bg: "bg-gray-100",
                    icon: <FaClock className="text-gray-500" />,
                };
        }
    };

    const { color, bg, icon } = getStatusStyle();

    return (
        <span className={clsx("inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full", color, bg)}>
            {icon}
            {status}
        </span>
    );
}
