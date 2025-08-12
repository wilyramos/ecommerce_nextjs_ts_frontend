// File: frontend/components/ui/SpinnerLoading.tsx

import { HashLoader } from "react-spinners";

export default function SpinnerLoading() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <HashLoader size={35} speedMultiplier={1.5} color="#4F46E5"/>
    </div>
  );
}
