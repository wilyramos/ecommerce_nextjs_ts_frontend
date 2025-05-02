import type React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid"; // Asegúrate de tener instaladas las Hero Icons

export default function ErrorMessage({ children }: { children : React.ReactNode }) {
  return (
    <div className="flex my-3 bg-red-100 px-2 py-1 rounded-r-xl border-red-600 border-l-4 text-sm gap-1">
      <ExclamationCircleIcon className="w-6 h-6 text-red-500" />
      <span>{children}</span>
    </div>
  );
}