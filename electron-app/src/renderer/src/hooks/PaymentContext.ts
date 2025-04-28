import { CartItemModel } from '@/shared/model'
import { createContext, useContext } from 'react'

export interface IData {
  method: string
  data: CartItemModel[]
}
export interface PaymentModel {
  id: string
  order_id: string
  method: string
}

export interface PaymentContextType {
  processPayment: (data: IData) => Promise<void>
  payments: PaymentModel[]
  isProcessing: boolean
}

export const PaymentContext = createContext<PaymentContextType>({} as PaymentContextType)

export const usePaymentContext = () => {
  const context = useContext(PaymentContext)
  if (!context) {
    throw new Error('usePaymentContext must be used within a PaymentProvider')
  }
  return context
}
