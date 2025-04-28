import { PaymentModel, usePaymentContext } from '@/hooks/PaymentContext'
import { PaymentProvider } from '@/hooks/PaymentProvider'

export const PaymentItem = ({ payment }: { payment: PaymentModel }) => {
  return (
    <tr className="*:text-gray-900 *:first:font-medium">
      <td className="px-3 py-2 whitespace-nowrap">{payment.id}</td>
      <td className="px-3 py-2 whitespace-nowrap">{payment.order_id}</td>
      <td className="px-3 py-2 whitespace-nowrap">{payment.method}</td>
    </tr>
  )
}

const Data = () => {
  const { payments } = usePaymentContext()
  return (
    <tbody className="divide-y divide-gray-200">
      {payments &&
        payments.map((payment: PaymentModel) => <PaymentItem key={payment.id} payment={payment} />)}
    </tbody>
  )
}

export const Payments = () => {
  return (
    <PaymentProvider>
      <div className="max-h-full overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200">
          <thead className="sticky top-0 bg-neutral-50/50 backdrop-blur-lg ltr:text-left rtl:text-right">
            <tr className="*:font-medium *:text-gray-900">
              <th className="px-3 py-2 whitespace-nowrap">ID</th>
              <th className="px-3 py-2 whitespace-nowrap">OrderID</th>
              <th className="px-3 py-2 whitespace-nowrap">Method</th>
            </tr>
          </thead>
          <Data />
        </table>
      </div>
    </PaymentProvider>
  )
}
