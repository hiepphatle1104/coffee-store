import { useOrderContext } from '@/hooks/OrderContext'
import { OrderModel } from 'src/shared/model'

export const OrdersItem = ({ order }: { order: OrderModel }) => {
  const date = new Date(order.created_at)

  return (
    <tr className="*:text-gray-900 *:first:font-medium">
      <td className="px-3 py-2 whitespace-nowrap">{order.id}</td>
      <td className="px-3 py-2 whitespace-nowrap">{date.toISOString()}</td>
      <td className="px-3 py-2 whitespace-nowrap">{order.total}</td>
      <td className="px-3 py-2 whitespace-nowrap">{order.status}</td>
    </tr>
  )
}

export const Orders = () => {
  const { orders } = useOrderContext()

  return (
    <>
      <div className="max-h-full overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200">
          <thead className="sticky top-0 bg-neutral-50/50 backdrop-blur-lg ltr:text-left rtl:text-right">
            <tr className="*:font-medium *:text-gray-900">
              <th className="px-3 py-2 whitespace-nowrap">ID</th>
              <th className="px-3 py-2 whitespace-nowrap">Created At</th>
              <th className="px-3 py-2 whitespace-nowrap">Total</th>
              <th className="px-3 py-2 whitespace-nowrap">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {orders &&
              orders.map((order: OrderModel) => <OrdersItem key={order.id} order={order} />)}
          </tbody>
        </table>
      </div>
    </>
  )
}
