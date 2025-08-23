
export function HeadingH1({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xl text-gray-800 tracking-tight border-l-4 border-blue-800 pl-2 font-semibold">{children}</div>
  )
}

export function HeadingH2({ children }: { children: React.ReactNode }) {
  return (
    <div className=" text-gray-800 tracking-tight border-l-4 border-blue-800 pl-2 font-semibold">{children}</div>
  )
}

export function HeadingH3({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm text-gray-800 tracking-tight border-b-2 border-b-gray-500 pl-1 font-base">{children}</div>
  )
}
