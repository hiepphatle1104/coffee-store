import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const Button = ({ children, className, ...props }: ComponentProps<'button'>) => {
  return (
    <button className={twMerge(className, 'button')} {...props}>
      {children}
    </button>
  )
}
