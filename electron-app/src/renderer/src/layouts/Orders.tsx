import { useOrderContext } from '@/hooks/OrderContext'
import { OrderModel } from 'src/shared/model'
import { Text } from '@/components/ui'
import { useState } from 'react'
import { LuX } from 'react-icons/lu'

interface OrderProps {
  order: OrderModel
  setOrder: (order: OrderModel | null) => void
}

const OrderDetails = ({ order, setOrder }: OrderProps) => {
  if (!order) return null

  if (!order.items || order.items.length === 0) return null

  return (
    <div className="w-96 h-full bg-white border border-neutral-300 shadow-md absolute right-0 top-0 z-11 p-4">
      <button className="cursor-pointer" onClick={() => setOrder(null)}>
        <LuX size={'24'} />
      </button>
      <div className="flex flex-col gap-2">
        <Text className="text-center" size="lg">
          Order Details
        </Text>
        <Text>ID: {order.id}</Text>
        <Text>Created At: {new Date(order.created_at).toLocaleDateString()}</Text>
        <Text>Total: {order.total}</Text>
        <Text>Status: {order.status}</Text>
        <Text>Items:</Text>
        <div className="flex-1 overflow-y-auto">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 border p-2 rounded border-neutral-300 shadow-sm"
            >
              <Text>Name: {item.name}</Text>
              <Text>Quantity: {item.quantity}</Text>
              <Text>Total: {item.price * item.quantity}</Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export const OrdersItem = ({ order, setOrder }: OrderProps) => {
  const date = new Date(order.created_at)

  const handleSelectOrder = (order: OrderModel) => {
    setOrder(order)
  }

  return (
    <tr className="*:text-gray-900 *:first:font-medium">
      <td className="px-3 py-2 whitespace-nowrap">{order.id}</td>
      <td className="px-3 py-2 whitespace-nowrap">{date.toISOString()}</td>
      <td className="px-3 py-2 whitespace-nowrap">{order.total}</td>
      <td className="px-3 py-2 whitespace-nowrap">{order.status}</td>
      <td>
        <button
          className="bg-neutral-800 text-white px-2 py-1 rounded cursor-pointer hover:bg-neutral-700"
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            handleSelectOrder(order)
          }}
        >
          Views
        </button>
      </td>
    </tr>
  )
}

export const Orders = () => {
  const { orders } = useOrderContext()

  const [orderSelected, setOrderSelected] = useState<OrderModel | null>(null)

  return (
    <>
      <div className="max-h-full overflow-x-auto flex">
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
              orders.map((order: OrderModel) => (
                <OrdersItem key={order.id} order={order} setOrder={setOrderSelected} />
              ))}
          </tbody>
        </table>
      </div>
      {orderSelected && <OrderDetails order={orderSelected} setOrder={setOrderSelected} />}
    </>
  )
}
