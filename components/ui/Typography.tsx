//File: frontend/components/ui/Typography.tsx

import { ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

const H1 = ({ className, ...props }: ComponentPropsWithoutRef<"h1">) => (
  <h1
    className={cn(
      [
        "scroll-m-20",
        "text-2xl lg:text-3xl",
        "font-semibold",
        "tracking-[-0.02em]",
        "leading-tight",
        "text-foreground",
      ],
      className
    )}
    {...props}
  />
)

const H2 = ({ className, ...props }: ComponentPropsWithoutRef<"h2">) => (
  <h2
    className={cn(
      [
        "scroll-m-20",
        "text-3xl",
        "font-bold",
        "tracking-[-0.015em]",
        "leading-tight",
        "text-foreground",
        "border-b",
        "border-border",
        "pb-3",
        "first:mt-0",
      ],
      className
    )}
    {...props}
  />
)

const H3 = ({ className, ...props }: ComponentPropsWithoutRef<"h3">) => (
  <h3
    className={cn(
      [
        "scroll-m-20",
        "text-2xl",
        "font-semibold",
        "tracking-[-0.01em]",
        "leading-snug",
        "text-foreground",
      ],
      className
    )}
    {...props}
  />
)

const H4 = ({ className, ...props }: ComponentPropsWithoutRef<"h4">) => (
  <h4
    className={cn(
      [
        "scroll-m-20",
        "text-xl",
        "font-semibold",
        "leading-snug",
        "text-foreground",
      ],
      className
    )}
    {...props}
  />
)

const P = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn(
      [
        "text-base",
        "leading-7",
        "tracking-normal",
        "text-foreground",
        "[&:not(:first-child)]:mt-6",
      ],
      className
    )}
    {...props}
  />
)

const Lead = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn(
      [
        "text-lg",
        "leading-8",
        "font-normal",
        "text-foreground/80",
      ],
      className
    )}
    {...props}
  />
)

const Muted = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn(
      [
        "text-sm",
        "leading-6",
        "text-muted-foreground",
      ],
      className
    )}
    {...props}
  />
)

const Small = ({ className, ...props }: ComponentPropsWithoutRef<"small">) => (
  <small
    className={cn(
      [
        "text-sm",
        "font-medium",
        "leading-none",
        "text-muted-foreground",
      ],
      className
    )}
    {...props}
  />
)

const Blockquote = ({
  className,
  ...props
}: ComponentPropsWithoutRef<"blockquote">) => (
  <blockquote
    className={cn(
      [
        "mt-6",
        "border-l-4",
        "border-border",
        "pl-6",
        "italic",
        "leading-7",
        "text-foreground/80",
      ],
      className
    )}
    {...props}
  />
)

const Ul = ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => (
  <ul
    className={cn(
      [
        "my-6",
        "ml-6",
        "list-disc",
        "space-y-2",
        "text-foreground",
      ],
      className
    )}
    {...props}
  />
)

const Ol = ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => (
  <ol
    className={cn(
      [
        "my-6",
        "ml-6",
        "list-decimal",
        "space-y-2",
        "text-foreground",
      ],
      className
    )}
    {...props}
  />
)

const Li = ({ className, ...props }: ComponentPropsWithoutRef<"li">) => (
  <li
    className={cn(
      [
        "leading-7",
      ],
      className
    )}
    {...props}
  />
)

const InlineCode = ({
  className,
  ...props
}: ComponentPropsWithoutRef<"code">) => (
  <code
    className={cn(
      [
        "relative",
        "rounded-md",
        "bg-secondary",
        "px-1.5",
        "py-1",
        "font-mono",
        "text-[0.875em]",
        "font-medium",
        "text-secondary-foreground",
      ],
      className
    )}
    {...props}
  />
)

const Pre = ({ className, ...props }: ComponentPropsWithoutRef<"pre">) => (
  <pre
    className={cn(
      [
        "mt-6",
        "mb-4",
        "overflow-x-auto",
        "rounded-xl",
        "border",
        "border-border",
        "bg-primary",
        "p-4",
        "text-sm",
        "leading-6",
        "text-primary-foreground",
      ],
      className
    )}
    {...props}
  />
)

const Hr = ({ className, ...props }: ComponentPropsWithoutRef<"hr">) => (
  <hr
    className={cn(
      [
        "my-8",
        "border-0",
        "border-t",
        "border-border",
      ],
      className
    )}
    {...props}
  />
)

const Table = ({ className, ...props }: ComponentPropsWithoutRef<"table">) => (
  <div className="my-6 w-full overflow-x-auto rounded-xl border border-border">
    <table
      className={cn(
        [
          "w-full",
          "border-collapse",
          "text-sm",
          "text-foreground",
        ],
        className
      )}
      {...props}
    />
  </div>
)

const Tr = ({ className, ...props }: ComponentPropsWithoutRef<"tr">) => (
  <tr
    className={cn(
      [
        "border-b",
        "border-border",
        "transition-colors",
        "even:bg-muted-neutral",
      ],
      className
    )}
    {...props}
  />
)

const Th = ({ className, ...props }: ComponentPropsWithoutRef<"th">) => (
  <th
    className={cn(
      [
        "px-4",
        "py-3",
        "text-left",
        "text-sm",
        "font-semibold",
        "tracking-wide",
        "text-secondary-foreground",
        "bg-secondary",
      ],
      className
    )}
    {...props}
  />
)

const Td = ({ className, ...props }: ComponentPropsWithoutRef<"td">) => (
  <td
    className={cn(
      [
        "px-4",
        "py-3",
        "align-middle",
        "text-foreground",
      ],
      className
    )}
    {...props}
  />
)

export {
  H1,
  H2,
  H3,
  H4,
  P,
  Lead,
  Muted,
  Small,
  Blockquote,
  Ul,
  Ol,
  Li,
  InlineCode,
  Pre,
  Hr,
  Table,
  Tr,
  Th,
  Td,
}