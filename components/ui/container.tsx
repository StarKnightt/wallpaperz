
interface ContainerProps {
  children: React.ReactNode
}

export function Container({ children }: ContainerProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}