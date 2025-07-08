// File: frontend/components/ui/SpinnerLoading.tsx

import { HashLoader } from "react-spinners";

export default function SpinnerLoading() {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <HashLoader size={60} speedMultiplier={1.5} />
    </div>
  );
}
