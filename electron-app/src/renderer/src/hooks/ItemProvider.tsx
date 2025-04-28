import React, { useEffect, useState } from 'react'
import { ItemContext, ItemContextType } from './ItemContext'
import { CartItemModel, ItemModel, UpdaterModel } from 'src/shared/model'
import toast from 'react-hot-toast'

export const ItemProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<ItemModel[]>([])
  const [cart, setCart] = useState<CartItemModel[]>([])
  const [isLoading, setLoading] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)

  // Function to add item to backend
  const addItem = async (item: ItemModel) => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8080/v1/items`, {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        toast.error('Failed to add item')
        return
      }
    } catch (error) {
      toast.error('Failed to add item')
    } finally {
      setLoading(false)
    }
  }

  // Function to add an item to the cart
  const addToCart = (item: ItemModel) => {
    setCart((prev) => {
      const existingItem = prev.find((i) => i.id === item.id)
      if (!existingItem) return [...prev, { ...item, quantity: 1 }]

      return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
    })
  }

  // Function to remove an item from the cart
  const removeFromCart = (item: CartItemModel) => {
    setCart((prev) => {
      const existingItem = prev.find((i) => i.id === item.id)
      if (!existingItem) return prev

      if (existingItem.quantity === 1) return prev.filter((i) => i.id !== item.id)

      return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i))
    })
  }

  // Function to clear the cart
  const clearCart = () => {
    setCart([])
    setTotalPrice(0)
  }

  const fetchItems = async () => {
    setLoading(true)
    try {
      const response = await window.context.getItems()
      setItems(response)
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  // Function to filter items by category
  const tagsFilter = (tags: string) => {
    if (!items) return []

    return items.filter((item) => item.tags.includes(tags))
  }

  // Function to calculate the total price of the cart
  useEffect(() => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    setTotalPrice(total)
  }, [cart])

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    window.context.autoUpdater((data: UpdaterModel) => {
      if (data.event === 'update' && data.category === 'items') fetchItems()
    })

    return () => {}
  }, [])

  const value: ItemContextType = {
    items: items || [],
    cart,
    isLoading,
    totalPrice,
    addToCart,
    removeFromCart,
    clearCart,
    tagsFilter,
    addItem
  }

  return <ItemContext.Provider value={value}>{children}</ItemContext.Provider>
}
