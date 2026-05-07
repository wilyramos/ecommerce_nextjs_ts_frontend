//File: frontend/components/ui/Alert.tsx

import { ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { X } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "error" | "warning" | "success" | "info";
type Mode = "inline" | "banner";

interface AlertProps {
    children: ReactNode;
    variant?: Variant;
    mode?: Mode;
    onDismiss?: () => void;
}

const CONFIG: Record<Variant, {
    icon: React.ElementType;
    bg: string;
    border: string;
    color: string;
}> = {
    error: {
        icon: XCircleIcon,
        bg: "var(--color-error-light)",
        border: "var(--color-error)",
        color: "var(--color-error)",
    },
    warning: {
        icon: ExclamationTriangleIcon,
        bg: "var(--color-warning-light)",
        border: "var(--color-warning)",
        color: "var(--color-warning)",
    },
    success: {
        icon: CheckCircleIcon,
        bg: "var(--color-success-light)",
        border: "var(--color-success)",
        color: "var(--color-success)",
    },
    info: {
        icon: InformationCircleIcon,
        bg: "var(--color-action-primary-light)",
        border: "var(--color-action-primary)",
        color: "var(--color-action-primary)",
    },
};

export default function Alert({
    children,
    variant = "error",
    mode = "inline",
    onDismiss,
}: AlertProps) {
    const { icon: Icon, bg, border, color } = CONFIG[variant];

    if (mode === "inline") {
        return (
            <div className="flex items-center gap-1.5 text-sm mt-1" style={{ color }}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{children}</span>
            </div>
        );
    }

    return (
        <div
            role="alert"
            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm"
            style={{ background: bg, border: `1px solid ${border}`, color }}
        >
            <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{children}</span>
            </div>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    aria-label="Cerrar"
                    className="flex-shrink-0 transition-opacity hover:opacity-60"
                    style={{ color }}
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}