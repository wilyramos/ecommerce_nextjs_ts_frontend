
export function HeadingH1({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-2xl text-gray-800 tracking-tight border-l-4 border-blue-800 pl-2">{children}</div>
  )
}

export function HeadingH2({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xl text-gray-800 tracking-tight border-l-4 border-blue-800 pl-2">{children}</div>
  )
}
