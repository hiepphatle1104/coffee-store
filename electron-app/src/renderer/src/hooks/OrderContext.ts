import { createContext, useContext } from 'react'
import { OrderModel } from 'src/shared/model'

export interface OrderContextType {
  orders: OrderModel[]
  isLoading: boolean
}

export const OrderContext = createContext<OrderContextType>({} as OrderContextType)

export const useOrderContext = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrderContext must be used within an OrderProvider')
  }
  return context
}
