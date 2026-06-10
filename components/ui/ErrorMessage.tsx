import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { X } from "lucide-react";
import type { ReactNode, ElementType } from "react";

type Variant = "error" | "warning" | "success" | "info";
type Mode = "inline" | "banner";

interface ErrorMessageProps {
  children: ReactNode;
  variant?: Variant;
  mode?: Mode;
  onDismiss?: () => void;
}

const CONFIG: Record<Variant, { icon: ElementType; bg: string; border: string; color: string }> = {
  error: { icon: XCircleIcon, bg: "color-mix(in oklab, var(--destructivered) 10%, white)", border: "var(--destructivered)", color: "var(--destructivered)" },
  warning: { icon: ExclamationTriangleIcon, bg: "color-mix(in oklab, var(--warning) 14%, white)", border: "var(--warning)", color: "var(--warning)" },
  success: { icon: CheckCircleIcon, bg: "color-mix(in oklab, var(--success) 12%, white)", border: "var(--success)", color: "var(--success)" },
  info: { icon: InformationCircleIcon, bg: "color-mix(in oklab, var(--info) 12%, white)", border: "var(--info)", color: "var(--info)" },
};

export default function ErrorMessage({ children, variant = "error", mode = "inline", onDismiss }: ErrorMessageProps) {
  const { icon: Icon, bg, border, color } = CONFIG[variant];

  if (mode === "inline") {
    return (
      <div className="mt-2 flex items-center gap-1.5 text-xs font-medium px-1" style={{ color }}>
        <span>{children}</span>
      </div>
    );
  }

  return (
    <div 
      role="alert" 
      className="my-4 flex items-start justify-between gap-3.5 rounded-lg border-2 px-4 py-3.5 text-xs font-medium shadow-xs transition-colors" 
      style={{ background: bg, borderColor: border, color }}
    >
      <div className="flex items-start gap-2.5">
        <Icon className="h-4 w-4 shrink-0 mt-[1px]" style={{ color }} />
        <div className="leading-relaxed whitespace-pre-line">{children}</div>
      </div>
      {onDismiss && (
        <button 
          onClick={onDismiss} 
          aria-label="Cerrar" 
          className="shrink-0 rounded-md p-0.5 transition-opacity hover:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-1" 
          style={{ color, outlineColor: "var(--ring)" }}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}