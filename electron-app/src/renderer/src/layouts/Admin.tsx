import { Navbar } from '@/components'
import { ItemProvider } from '@/hooks/ItemProvider'
import { OrderProvider } from '@/hooks/OrderProvider'
import { Outlet } from 'react-router'

export const Admin = () => {
  const navbarLinks = [
    { title: 'Orders', path: '/admin/orders' },
    { title: 'Items', path: '/admin/items' },
    { title: 'Payments', path: '/admin/payments' }
  ]

  return (
    <OrderProvider>
      <ItemProvider>
        <div className="bg-neutral-200/50 h-screen p-4 gap-4 flex flex-col">
          <Navbar navItems={navbarLinks} />

          <Outlet />
        </div>
      </ItemProvider>
    </OrderProvider>
  )
}
