// components/ui/ErrorMessage.tsx
import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { X } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "error" | "warning" | "success" | "info";
type Mode = "inline" | "banner";

interface ErrorMessageProps {
  children: ReactNode;
  variant?: Variant;
  mode?: Mode;
  onDismiss?: () => void;
}

const CONFIG: Record<
  Variant,
  {
    icon: React.ElementType;
    bg: string;
    border: string;
    color: string;
  }
> = {
  error: {
    icon: XCircleIcon,
    bg: "color-mix(in oklab, var(--destructivered) 10%, white)",
    border: "var(--destructivered)",
    color: "var(--destructivered)",
  },

  warning: {
    icon: ExclamationTriangleIcon,
    bg: "color-mix(in oklab, var(--warning) 14%, white)",
    border: "var(--warning)",
    color: "var(--warning)",
  },

  success: {
    icon: CheckCircleIcon,
    bg: "color-mix(in oklab, var(--success) 12%, white)",
    border: "var(--success)",
    color: "var(--success)",
  },

  info: {
    icon: InformationCircleIcon,
    bg: "color-mix(in oklab, var(--info) 12%, white)",
    border: "var(--info)",
    color: "var(--info)",
  },
};

export default function ErrorMessage({
  children,
  variant = "error",
  mode = "inline",
  onDismiss,
}: ErrorMessageProps) {
  const { icon: Icon, bg, border, color } = CONFIG[variant];

  // ── Inline ─────────────────────────────────────────────
  if (mode === "inline") {
    return (
      <div
        className="mt-1 flex items-center gap-1.5 text-sm font-medium"
        style={{ color }}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span>{children}</span>
      </div>
    );
  }

  // ── Banner ─────────────────────────────────────────────
  return (
    <div
      role="alert"
      className="
        flex items-start justify-between gap-3
        rounded-xl border px-4 py-3
        text-sm shadow-sm
        transition-colors
      "
      style={{
        background: bg,
        borderColor: border,
        color,
      }}
    >
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />

        <div className="leading-relaxed">
          {children}
        </div>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Cerrar"
          className="
            flex-shrink-0 rounded-md p-1
            transition-opacity hover:opacity-60
            focus:outline-none focus:ring-2
          "
          style={{
            color,
            outlineColor: "var(--ring)",
          }}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}