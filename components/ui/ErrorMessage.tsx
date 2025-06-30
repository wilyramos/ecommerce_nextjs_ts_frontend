// components/ui/ErrorMessage.tsx
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";

export default function ErrorMessage({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
            <ExclamationTriangleIcon className="w-4 h-4" />
            <span>{children}</span>
        </div>
    );
}
