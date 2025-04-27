import { ComponentProps } from 'react'
import { Card } from './Card'

export const Content = ({ children, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className="overflow-y-auto grid grid-cols-[repeat(auto-fill,minmax(224px,1fr))] gap-2 auto-rows-auto"
      {...props}
    >
      {children}
    </div>
  )
}
