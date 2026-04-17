interface PageLoaderProps {
  message?: string
}

export default function PageLoader({ message = 'Loading...' }: PageLoaderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🍽️</div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
