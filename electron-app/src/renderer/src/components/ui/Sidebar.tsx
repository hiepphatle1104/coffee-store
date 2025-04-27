import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const Sidebar = ({ children, className, ...props }: ComponentProps<'div'>) => {
  return (
    <div className={twMerge('w-90 rounded-lg bg-white shadow-lg ', className)} {...props}>
      {children}
    </div>
  )
}
