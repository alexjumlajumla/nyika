import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title: string
  description: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title,
  description,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="rounded-full bg-red-100 p-3">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <Button
          variant="outline"
          className="mt-6"
          onClick={onRetry}
        >
          Try again
        </Button>
      )}
    </div>
  )
}
