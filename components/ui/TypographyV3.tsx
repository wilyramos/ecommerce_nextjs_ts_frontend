// File: frontend/components/ui/TypographyV3.tsx

import { ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

const H1 = ({ className, ...props }: ComponentPropsWithoutRef<"h1">) => (
  <h1
    className={cn(
      "scroll-m-20 text-2xl font-bold tracking-tight text-text-primary sm:text-3xl lg:text-4xl select-none",
      className
    )}
    {...props}
  />
)

const H2 = ({ className, ...props }: ComponentPropsWithoutRef<"h2">) => (
  <h2
    className={cn(
      "scroll-m-20 text-xl font-semibold tracking-tight text-text-primary sm:text-2xl select-none",
      className
    )}
    {...props}
  />
)

const H3 = ({ className, ...props }: ComponentPropsWithoutRef<"h3">) => (
  <h3
    className={cn(
      "scroll-m-20 text-lg font-semibold tracking-tight text-text-primary select-none",
      className
    )}
    {...props}
  />
)

const H4 = ({ className, ...props }: ComponentPropsWithoutRef<"h4">) => (
  <h4
    className={cn(
      "scroll-m-20 text-xs font-semibold uppercase text-text-tertiary select-none",
      className
    )}
    {...props}
  />
)

const P = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn(
      "text-sm font-normal leading-relaxed text-text-secondary",
      className
    )}
    {...props}
  />
)

const Lead = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn(
      "text-base font-medium leading-normal text-text-primary sm:text-lg",
      className
    )}
    {...props}
  />
)

const Muted = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn(
      "text-xs font-normal tracking-normal text-text-tertiary",
      className
    )}
    {...props}
  />
)

const Small = ({ className, ...props }: ComponentPropsWithoutRef<"small">) => (
  <small
    className={cn(
      "text-[11px] font-medium uppercase text-text-tertiary",
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
      "mt-3 border-l-2 border-border-strong pl-3.5 italic text-sm text-text-secondary",
      className
    )}
    {...props}
  />
)

const Ul = ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => (
  <ul
    className={cn(
      "my-2 ml-4 list-disc space-y-1 text-sm font-normal text-text-secondary marker:text-text-tertiary",
      className
    )}
    {...props}
  />
)

const Ol = ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => (
  <ol
    className={cn(
      "my-2 ml-4 list-decimal space-y-1 text-sm font-normal text-text-secondary marker:text-text-tertiary",
      className
    )}
    {...props}
  />
)

const Li = ({ className, ...props }: ComponentPropsWithoutRef<"li">) => (
  <li className={cn("leading-relaxed", className)} {...props} />
)

const InlineCode = ({
  className,
  ...props
}: ComponentPropsWithoutRef<"code">) => (
  <code
    className={cn(
      "relative rounded-radius-sm border border-border-primary bg-surface-secondary px-1.5 py-0.5 font-mono text-xs font-medium text-text-primary",
      className
    )}
    {...props}
  />
)

const Pre = ({ className, ...props }: ComponentPropsWithoutRef<"pre">) => (
  <pre
    className={cn(
      "my-3 overflow-x-auto rounded-radius-md border border-border-primary bg-surface-secondary p-3.5 font-mono text-xs text-text-primary",
      className
    )}
    {...props}
  />
)

const Hr = ({ className, ...props }: ComponentPropsWithoutRef<"hr">) => (
  <hr className={cn("my-4 border-border-primary", className)} {...props} />
)

const Table = ({ className, ...props }: ComponentPropsWithoutRef<"table">) => (
  <div className="my-3 w-full overflow-x-auto rounded-radius-md border border-border-primary bg-surface-primary">
    <table
      className={cn(
        "w-full border-collapse text-left text-xs text-text-primary",
        className
      )}
      {...props}
    />
  </div>
)

const Tr = ({ className, ...props }: ComponentPropsWithoutRef<"tr">) => (
  <tr
    className={cn(
      "border-b border-border-primary transition-colors duration-fast last:border-0 hover:bg-surface-secondary data-[state=selected]:bg-surface-secondary",
      className
    )}
    {...props}
  />
)

const Th = ({ className, ...props }: ComponentPropsWithoutRef<"th">) => (
  <th
    className={cn(
      "border-b border-border-primary bg-surface-secondary px-3.5 py-2.5 text-left text-[11px] font-semibold uppercase text-text-tertiary select-none",
      className
    )}
    {...props}
  />
)

const Td = ({ className, ...props }: ComponentPropsWithoutRef<"td">) => (
  <td
    className={cn(
      "px-3.5 py-2.5 text-left align-middle font-normal text-text-primary",
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