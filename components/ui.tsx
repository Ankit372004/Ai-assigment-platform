import type React from "react"
export const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
    >
      {children}
    </div>
  )
}

export const Button = ({
  children,
  variant,
  size,
  className,
  ...props
}: {
  children: React.ReactNode
  variant?: "default" | "outline"
  size?: "default" | "sm"
  className?: string
  props?: any
}) => {
  const variantClasses =
    variant === "outline"
      ? "bg-transparent border border-input hover:bg-accent hover:text-accent-foreground"
      : "bg-primary text-primary-foreground hover:bg-primary/90"

  const sizeClasses = size === "sm" ? "text-sm py-2 px-3" : "py-2 px-4"

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>{children}</div>
}

export const CardHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
}

export const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
}

export const CardDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
}

export const CardContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>
}

export const Input = ({ className, ...props }: { className?: string; props?: any }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

export const Label = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string; props?: any }) => {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}

export const Select = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string; props?: any }) => {
  return (
    <select
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </select>
  )
}

export const SelectTrigger = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string; props?: any }) => {
  return (
    <button
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export const SelectContent = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string; props?: any }) => {
  return (
    <div
      className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 slide-in-from-bottom-10 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export const SelectItem = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string; props?: any }) => {
  return (
    <div
      className={`relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export const SelectValue = ({
  children,
  className,
  ...props
}: { children: React.ReactNode; className?: string; props?: any }) => {
  return (
    <span className={`line-clamp-1 ${className}`} {...props}>
      {children}
    </span>
  )
}

export const Textarea = ({ className, ...props }: { className?: string; props?: any }) => {
  return (
    <textarea
      className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}
