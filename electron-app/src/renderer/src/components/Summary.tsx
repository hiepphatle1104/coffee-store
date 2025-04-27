import { Button, Select, Sidebar, Text } from '@/components/ui'
import { useItemContext } from '@/hooks/ItemContext'
import { useState } from 'react'
import { LuTrash2 } from 'react-icons/lu'
import { CartItemModel } from 'src/shared/model'
import { Modal } from './Modal'

export const CartItem = ({ item }: { item: CartItemModel }) => {
  const { removeFromCart } = useItemContext()

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    removeFromCart(item)
  }
  return (
    <div className="w-full flex h-24 bg-white shadow-sm border border-neutral-100 p-2 rounded gap-3">
      <img
        src={item.image || 'https://placehold.co/600x400?text=Invalid+Image'}
        alt="Item"
        className="h-full w-24 object-cover rounded-md"
      />

      <div className="flex-1 h-full flex flex-col justify-between">
        <section className="flex gap-1 items-center">
          <Text isBold>{item.name}</Text>
          <Text variant="subtitle" size="sm">
            ({item.quantity})
          </Text>
        </section>

        <div className="w-full flex items-center justify-between">
          <Text>{(item.price * item.quantity).toLocaleString('vi-VN')} VND</Text>
          <button className="cursor-pointer" onClick={handleDelete}>
            <LuTrash2 />
          </button>
        </div>
      </div>
    </div>
  )
}

export const Summary = () => {
  // TODO: Implement payment here
  // TODO: Implement table information here

  const { cart, totalPrice, clearCart } = useItemContext()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const remainingTable = [
    {
      id: 'a-01',
      name: 'A-01'
    },
    {
      id: 'a-02',
      name: 'A-02'
    },
    {
      id: 'a-03',
      name: 'A-03'
    },
    {
      id: 'a-04',
      name: 'A-04'
    },
    {
      id: 'a-05',
      name: 'A-05'
    }
  ]

  const [table, setTable] = useState<string>(remainingTable[0].id)

  const handleClearCart = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    clearCart()
  }
  const handlePayment = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    openModal()

    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Uncomment and use the actual API call if needed
      // const response = await fetch('http://localhost:8080/v1/payment')
      // Handle response here if necessary

      setIsModalOpen(false)
      alert('Payment successful!')
    } catch (error) {
      console.error('Payment failed:', error)
      setIsModalOpen(false)
      alert('Payment failed. Please try again.')
    }
  }

  return (
    <>
      <Sidebar className="flex flex-col justify-between h-full">
        {/* Header */}
        <div className="flex justify-between items-center px-3 py-2">
          <Text isBold>Order Summary</Text>

          <button className="cursor-pointer" onClick={handleClearCart}>
            <LuTrash2 />
          </button>
        </div>

        {/* Separate */}
        <div className="border border-neutral-200/50 mb-3" />

        {/* Cart items */}
        <div className="flex flex-col gap-2 flex-1 px-3 overflow-y-auto">
          {cart.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Payment */}
        <section className="space-y-3 px-3 py-3">
          <div className="bg-white px-3 py-1.5 rounded-lg space-y-1 border-neutral-200/50 border shadow-sm">
            {/* Table */}
            <section className="flex w-full justify-between h-8 items-center">
              <label htmlFor="table-select" className="font-medium">
                Select Table
              </label>
              <Select
                id="table-select"
                name="table-select"
                onChange={(e) => setTable(e.target.value)}
                value={table}
              >
                {remainingTable.map((table) => (
                  <option key={table.id} value={table.id}>
                    {table.name}
                  </option>
                ))}
              </Select>
            </section>

            {/* Separate */}
            <div className="border border-neutral-300/50" />

            {/* Total */}
            <div className="flex justify-between items-center h-8">
              <Text className="font-medium">Total Payment</Text>
              <Text>{totalPrice.toLocaleString('vi-VN')} VND</Text>
            </div>
          </div>

          {/* Confirm button */}
          <Button type="submit" className="w-full" onClick={handlePayment}>
            Confirm
          </Button>
        </section>
      </Sidebar>
      <Modal isOpen={isModalOpen} />
    </>
  )
}
