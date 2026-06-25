// File: frontend/components/ui/SpinnerLoadingV2.tsx
import { BarLoader } from "react-spinners";

interface SpinnerLoadingProps {
    message?: string;
    showMessage?: boolean;
    color?: string;
}

export default function SpinnerLoadingV2({
    message = "Cargando...",
    showMessage = true,
    color
}: SpinnerLoadingProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <BarLoader
                width={100}
                speedMultiplier={1.5}
                color={color}
                aria-label={message}
            />
            {showMessage && (
                <p className="text-sm text-[var(--color-text-secondary)]">
                    {message}
                </p>
            )}
        </div>
    );
}