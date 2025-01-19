import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

const Card = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { className, ...rest } = props
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-white text-gray-900 shadow-sm',
        className
      )}
      {...rest}
    />
  )
})
Card.displayName = 'Card'

const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { className, ...rest } = props
  return (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...rest}
    />
  )
})
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>((props, ref) => {
  const { className, ...rest } = props
  return (
    <h3
      ref={ref}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        className
      )}
      {...rest}
    />
  )
})
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>((props, ref) => {
  const { className, ...rest } = props
  return (
    <p
      ref={ref}
      className={cn('text-sm text-gray-500', className)}
      {...rest}
    />
  )
})
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { className, ...rest } = props
  return (
    <div 
      ref={ref} 
      className={cn('p-6 pt-0', className)} 
      {...rest}
    />
  )
})
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const { className, ...rest } = props
  return (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...rest}
    />
  )
})
CardFooter.displayName = 'CardFooter'

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
}