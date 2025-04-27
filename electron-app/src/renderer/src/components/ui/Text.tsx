import { ComponentProps } from 'react'
import clsx from 'clsx'

interface TextProps extends ComponentProps<'p'> {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  isBold?: boolean
  variant?: 'base' | 'subtitle'
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
}

const variantClasses = {
  base: 'text-neutral-900',
  subtitle: 'text-neutral-500'
}

export const Text = ({
  size = 'base',
  isBold,
  variant = 'base',
  children,
  className,
  ...props
}: TextProps) => {
  return (
    <p
      className={clsx(
        sizeClasses[size],
        variantClasses[variant],
        { 'font-semibold': isBold },
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}
