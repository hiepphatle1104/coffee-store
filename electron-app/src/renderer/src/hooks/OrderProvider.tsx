import { useEffect, useState } from 'react'
import { OrderContext } from './OrderContext'
import { OrderModel, UpdaterModel } from 'src/shared/model'

export const OrderProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<OrderModel[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Function to fetch orders from the backend
  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const response = await window.context.getOrders()
      setOrders(response)
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    window.context.autoUpdater((data: UpdaterModel) => {
      if (data.event === 'update' && data.category === 'orders') fetchOrders()
    })

    return () => {}
  }, [])

  const contextValue = {
    orders,
    isLoading
  }

  return <OrderContext.Provider value={contextValue}>{children}</OrderContext.Provider>
}
