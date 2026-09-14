// File: frontend/components/ui/Skeleton.tsx
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-surface-secondary animate-pulse rounded-radius-md", className)}
      {...props}
    />
  )
}

export { Skeleton }