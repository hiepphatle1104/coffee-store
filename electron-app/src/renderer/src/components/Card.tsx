import { Button, Text } from '@/components/ui'
import { useItemContext } from '@/hooks/ItemContext'
import { ItemModel } from 'src/shared/model'

export const Card = ({ item }: { item: ItemModel }) => {
  const { addToCart, cart } = useItemContext()

  const handleAddItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(item)
  }

  return (
    <div className="w-56 bg-white shadow-lg border border-neutral-300/50 rounded-lg p-2 space-y-2">
      {/* Image */}
      <div>
        <img
          src={item.image || 'https://placehold.co/600x400?text=Invalid+Image'}
          alt="Placeholder"
          className="w-full h-32 object-cover rounded-md"
        />
      </div>

      {/* Information */}
      <section className="flex w-full justify-between items-center">
        <Text isBold>{item.name}</Text>
        <p>{item.price.toLocaleString('vi-VN')} VND</p>
      </section>
      <div className="flex justify-center">
        {cart.some((cartItem) => cartItem.id === item.id) ? (
          <button
            onClick={handleAddItem}
            className="w-full py-2 cursor-pointer inline-block rounded-sm border border-slate-600 px-12 text-sm font-medium text-slate-600 hover:bg-slate-600 hover:text-white focus:ring-0 focus:outline-hidden"
          >
            Added
          </button>
        ) : (
          <Button className="w-full" onClick={handleAddItem}>
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  )
}
