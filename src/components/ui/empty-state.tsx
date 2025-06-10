import { AlertCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  actionText?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionText = "Reset filters",
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="rounded-full bg-gray-100 p-3">
        {icon || <Search className="h-8 w-8 text-gray-500" />}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {onAction && (
        <Button
          variant="outline"
          className="mt-6"
          onClick={onAction}
        >
          {actionText}
        </Button>
      )}
    </div>
  )
}
