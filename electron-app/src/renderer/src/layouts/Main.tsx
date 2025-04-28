import { Navbar, Summary } from '@/components'
import { useItemContext } from '@/hooks/ItemContext'
import { ItemProvider } from '@/hooks/ItemProvider'
import { OrderProvider } from '@/hooks/OrderProvider'
import { PaymentProvider } from '@/hooks/PaymentProvider'
import { Outlet } from 'react-router'

export const Main = () => {
  const navbarLinks = [
    {
      title: 'All',
      count: 0,
      path: '/home/all'
    },
    {
      title: 'Food',
      count: 0,
      path: '/home/food'
    },
    {
      title: 'Coffee',
      count: 0,
      path: '/home/coffee'
    },
    {
      title: 'Tea',
      count: 0,
      path: '/home/tea'
    }
  ]

  return (
    <OrderProvider>
      <ItemProvider>
        <div className="bg-neutral-200/50 h-screen p-4 flex flex-row w-full justify-between gap-4">
          <div className="flex-1 flex flex-col gap-2 w-full">
            <Navbar navItems={navbarLinks} />
            <Outlet />
          </div>

          <div>
            <PaymentProvider>
              <Summary />
            </PaymentProvider>
          </div>
        </div>
      </ItemProvider>
    </OrderProvider>
  )
}
