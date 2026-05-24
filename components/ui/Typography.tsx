import { ComponentPropsWithoutRef } from "react"
import { cn } from "@/lib/utils"

const H1 = ({ className, ...props }: ComponentPropsWithoutRef<"h1">) => (
  <h1
    className={cn(
      "scroll-m-20 text-xl font-bold tracking-tight text-foreground sm:text-2xl",
      className
    )}
    {...props}
  />
)

const H2 = ({ className, ...props }: ComponentPropsWithoutRef<"h2">) => (
  <h2
    className={cn(
      "scroll-m-20 text-lg font-semibold tracking-tight text-foreground",
      className
    )}
    {...props}
  />
)

const H3 = ({ className, ...props }: ComponentPropsWithoutRef<"h3">) => (
  <h3
    className={cn(
      "scroll-m-20 text-base font-semibold tracking-tight text-foreground",
      className
    )}
    {...props}
  />
)

const H4 = ({ className, ...props }: ComponentPropsWithoutRef<"h4">) => (
  <h4
    className={cn(
      "scroll-m-20 text-sm font-semibold tracking-tight text-foreground",
      className
    )}
    {...props}

  />
)

const P = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn(
      "text-sm leading-relaxed text-foreground [&:not(:first-child)]:mt-2",
      className
    )}
    {...props}
  />
)

const Lead = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn(
      "text-sm font-medium text-muted leading-normal",
      className
    )}
    {...props}
  />
)

const Muted = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p
    className={cn(
      "text-xs tracking-normal text-muted-foreground",
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
      "mt-3 border-l border-border pl-3 italic text-xs text-muted-foreground",
      className
    )}
    {...props}
  />
)

const Ul = ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => (
  <ul
    className={cn(
      "my-2 ml-4 list-disc space-y-1 text-sm text-foreground",
      className
    )}
    {...props}
  />
)

const Ol = ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => (
  <ol
    className={cn(
      "my-2 ml-4 list-decimal space-y-1 text-sm text-foreground",
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
      "relative rounded bg-muted-neutral px-1 py-0.5 font-mono text-[11px] font-medium text-foreground",
      className
    )}
    {...props}
  />
)

const Pre = ({ className, ...props }: ComponentPropsWithoutRef<"pre">) => (
  <pre
    className={cn(
      "my-3 overflow-x-auto rounded-md border border-border bg-background-secondary p-3 text-xs font-mono text-foreground",
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
  <div className="my-3 w-full overflow-x-auto rounded-md border border-border">
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
      "border-b border-border last:border-0 even:bg-muted-neutral/40 transition-colors hover:bg-muted-neutral/20",
      className
    )}
    {...props}
  />
)

const Th = ({ className, ...props }: ComponentPropsWithoutRef<"th">) => (
  <th
    className={cn(
      "px-3 py-2 text-left font-medium text-muted-neutral-foreground bg-muted-neutral border-b border-border",
      className
    )}
    {...props}
  />
)

const Td = ({ className, ...props }: ComponentPropsWithoutRef<"td">) => (
  <td
    className={cn(
      "px-3 py-2 text-left align-middle text-foreground",
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