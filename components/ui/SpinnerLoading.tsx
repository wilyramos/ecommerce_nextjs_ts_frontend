// File: frontend/components/ui/SpinnerLoading.tsx

import { ClipLoader } from "react-spinners";

export default function SpinnerLoading() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <ClipLoader size={30} speedMultiplier={1.5} className="text-gray-500" />
    </div>
  );
}
