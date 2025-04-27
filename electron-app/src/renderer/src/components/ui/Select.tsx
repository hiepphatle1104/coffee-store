import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const Select = ({ children, className, ...props }: ComponentProps<'select'>) => {
  return (
    <select
      className={twMerge('h-full focus:ring-0 focus:outline-none cursor-pointer', className)}
      {...props}
    >
      {children}
    </select>
  )
}
