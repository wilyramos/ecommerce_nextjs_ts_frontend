// File: frontend/components/ui/SpinnerLoading.tsx

import { BarLoader } from "react-spinners";

export default function SpinnerLoading() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <BarLoader width={100} speedMultiplier={1.5} className="text-gray-500" />
    </div>
  );
}
