// File: frontend/components/ui/Typography.tsx

import { ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

const H1 = ({ className, ...props }: ComponentPropsWithoutRef<"h1">) => (
  <h1
    className={cn(
      "scroll-m-20 text-xl font-bold tracking-tight text-foreground sm:text-2xl select-none",
      className
    )}
    {...props}
  />
)

const H2 = ({ className, ...props }: ComponentPropsWithoutRef<"h2">) => (
  <h2
    className={cn(
      "scroll-m-20 text-lg font-bold tracking-tight text-foreground select-none",
      className
    )}
    {...props}
  />
)

const H3 = ({ className, ...props }: ComponentPropsWithoutRef<"h3">) => (
  <h3
    className={cn(
      "scroll-m-20 text-base font-bold tracking-tight text-foreground select-none",
      className
    )}
    {...props}
  />
)

const H4 = ({ className, ...props }: ComponentPropsWithoutRef<"h4">) => (
  <h4
    className={cn(
      "scroll-m-20 text-sm font-bold tracking-tight text-foreground select-none",
      className
    )}
    {...props}
  />
)

const P = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn(
      "text-sm font-medium leading-relaxed text-foreground",
      className
    )}
    {...props}
  />
)

const Lead = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn(
      "text-sm font-semibold text-muted leading-normal",
      className
    )}
    {...props}
  />
)

const Muted = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn(
      "text-xs font-medium tracking-normal text-muted-foreground",
      className
    )}
    {...props}
  />
)

const Small = ({ className, ...props }: ComponentPropsWithoutRef<"small">) => (
  <small
    className={cn(
      "text-xs font-normal text-muted-foreground",
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
      "mt-3 border-l-2 border-border pl-3 italic text-xs text-muted-foreground",
      className
    )}
    {...props}
  />
)

const Ul = ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => (
  <ul
    className={cn(
      "my-2 ml-4 list-disc space-y-1 text-sm font-medium text-foreground",
      className
    )}
    {...props}
  />
)

const Ol = ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => (
  <ol
    className={cn(
      "my-2 ml-4 list-decimal space-y-1 text-sm font-medium text-foreground",
      className
    )}
    {...props}
  />
)

const Li = ({ className, ...props }: ComponentPropsWithoutRef<"li">) => (
  <li
    className={cn(
      "leading-relaxed",
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
      "relative rounded-[var(--radius-sm)] bg-muted-neutral px-1 py-0.5 font-mono text-[11px] font-semibold text-foreground border border-border/40",
      className
    )}
    {...props}
  />
)

const Pre = ({ className, ...props }: ComponentPropsWithoutRef<"pre">) => (
  <pre
    className={cn(
      "my-3 overflow-x-auto rounded-[var(--radius-md)] border border-border bg-background-secondary p-3 text-xs font-mono text-foreground",
      className
    )}
    {...props}
  />
)

const Hr = ({ className, ...props }: ComponentPropsWithoutRef<"hr">) => (
  <hr
    className={cn(
      "my-3 border-border",
      className
    )}
    {...props}
  />
)

const Table = ({ className, ...props }: ComponentPropsWithoutRef<"table">) => (
  <div className="my-3 w-full overflow-x-auto rounded-[var(--radius-sm)] border border-border bg-card text-card-foreground">
    <table
      className={cn(
        "w-full border-collapse text-left text-xs text-foreground",
        className
      )}
      {...props}
    />
  </div>
)

const Tr = ({ className, ...props }: ComponentPropsWithoutRef<"tr">) => (
  <tr
    className={cn(
      "border-b border-border last:border-0 transition-colors hover:bg-background-secondary data-[state=selected]:bg-background-secondary",
      className
    )}
    {...props}
  />
)

const Th = ({ className, ...props }: ComponentPropsWithoutRef<"th">) => (
  <th
    className={cn(
      "px-3 py-2 text-left font-bold text-foreground bg-background-secondary border-b border-border select-none uppercase tracking-wider",
      className
    )}
    {...props}
  />
)

const Td = ({ className, ...props }: ComponentPropsWithoutRef<"td">) => (
  <td
    className={cn(
      "px-3 py-2 text-left align-middle font-medium text-foreground",
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