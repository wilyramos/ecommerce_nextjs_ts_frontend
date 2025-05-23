import type React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ErrorMessage({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-start gap-2 px-2 py-1 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
            <ExclamationTriangleIcon className="w-5 h-5 mt-0.5 text-red-500" />
            <p className="font-semibold leading-snug">{children}</p>
        </div>
    );
}