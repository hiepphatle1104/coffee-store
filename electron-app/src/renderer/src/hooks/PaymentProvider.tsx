import { baseUrl, CartItemModel, UpdaterModel } from '@/shared/model'
import { IData, PaymentContext, PaymentContextType, PaymentModel } from './PaymentContext'
import { useEffect, useState } from 'react'

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}

export const PaymentProvider = ({ children }: { children: React.ReactNode }) => {
  const [payments, setPayments] = useState<PaymentModel[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const processPayment = async (paymentData: IData) => {
    let orderID = ''
    setIsProcessing(true)

    try {
      // Create order
      const orderData = {
        items: paymentData.data
      }
      const orderResponse = await fetch(`${baseUrl}/orders`, {
        ...options,
        body: JSON.stringify(orderData)
      })

      const order = await orderResponse.json()
      if (!order.ok) throw new Error('Failed to create order')
      orderID = order.data.id

      // Create transaction
      const transactionData = {
        order_id: order.data.id,
        method: paymentData.method
      }

      const transactionResponse = await fetch(`${baseUrl}/payments`, {
        ...options,
        body: JSON.stringify(transactionData)
      })

      const transaction = await transactionResponse.json()
      if (!transaction.ok) throw new Error('Failed to create transaction')

      // Update order status
      const updateOrderData = {
        status: 'paid'
      }

      const updateOrderResponse = await fetch(
        `${baseUrl}/orders/${transaction.data.order_id}/update`,
        {
          ...options,
          method: 'PUT',
          body: JSON.stringify(updateOrderData)
        }
      )

      if (!updateOrderResponse.ok) throw new Error('Failed to update order status')
    } catch (error) {
      await deleteOrder(orderID)
      throw new Error('Payment failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const deleteOrder = async (orderID: string) => {
    try {
      const response = await fetch(`${baseUrl}/orders/${orderID}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete order')
    } catch (error) {
      console.error('Error deleting order:', error)
    }
  }

  const fetchPayments = async () => {
    try {
      const response = await fetch(`${baseUrl}/payments`)
      if (!response.ok) throw new Error('Failed to fetch payments')

      const res = await response.json()
      setPayments(res.data)
    } catch (error) {
      console.error('Error fetching payments:', error)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  useEffect(() => {
    window.context.autoUpdater((data: UpdaterModel) => {
      if (data.event === 'update' && data.category === 'transactions') fetchPayments()
    })

    return () => {}
  }, [])

  const contextValue: PaymentContextType = {
    processPayment,
    payments,
    isProcessing
  }
  return <PaymentContext.Provider value={contextValue}>{children}</PaymentContext.Provider>
}
