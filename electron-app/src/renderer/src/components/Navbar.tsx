import { ComponentProps } from 'react'
import { LuHouse } from 'react-icons/lu'
import { twMerge } from 'tailwind-merge'
import { Link, useLocation } from 'react-router'
import clsx from 'clsx'
import { useItemContext } from '@/hooks/ItemContext'

export const NavbarItem = ({ children, className, ...props }: ComponentProps<'div'>) => {
  return (
    <div className={twMerge('navbar-item font-medium group', className)} {...props}>
      {children}
    </div>
  )
}

export interface LinkItem {
  title: string
  count?: number
  path: string
}

export interface NavbarProps extends ComponentProps<'div'> {
  navItems: LinkItem[]
}

export const Navbar = ({ navItems }: NavbarProps) => {
  const location = useLocation()
  const { items } = useItemContext()

  return (
    <div className="flex flex-row items-center gap-2 h-fit">
      {/* Logo */}
      <Link to={'/'}>
        <NavbarItem className="py-2!">
          <LuHouse />
        </NavbarItem>
      </Link>

      {/* Separator */}
      <div className="h-4 border border-neutral-300" />

      {/* Items */}
      <section className="flex gap-2 min-w-fit">
        {navItems.map((link) => {
          const count =
            link.title === 'All'
              ? items.length
              : items.filter((item) => item.tags?.includes(link.title.toLowerCase())).length

          return (
            <Link key={link.title} to={link.path} className="flex flex-row items-center gap-2">
              <NavbarItem className={clsx(location.pathname === link.path && 'navbar-item-active')}>
                {link.title} {count !== 0 && <span>{count}</span>}
              </NavbarItem>
            </Link>
          )
        })}
      </section>
    </div>
  )
}
