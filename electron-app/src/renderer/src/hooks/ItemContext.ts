import { createContext, useContext } from 'react'
import { CartItemModel, ItemModel } from 'src/shared/model'

export interface ItemContextType {
  items: ItemModel[] | []
  cart: CartItemModel[]
  isLoading: boolean
  totalPrice: number
  addToCart: (item: ItemModel) => void
  removeFromCart: (item: CartItemModel) => void
  clearCart: () => void
  tagsFilter: (tags: string) => ItemModel[]
  addItem: (item: ItemModel) => Promise<void>
  deleteItem: (item: ItemModel) => Promise<void>
}

export const ItemContext = createContext<ItemContextType>({} as ItemContextType)

export const useItemContext = () => {
  const context = useContext(ItemContext)
  if (!context) {
    throw new Error('useItemContext must be used within an ItemProvider')
  }
  return context
}
