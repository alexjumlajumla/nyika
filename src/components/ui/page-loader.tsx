import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface PageLoaderProps {
  className?: string
  text?: string
}

export function PageLoader({ className, text = "Loading..." }: PageLoaderProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  )
}
