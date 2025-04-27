export const baseUrl = 'http://localhost:8080/v1'
export const wsUrl = 'ws://localhost:8080/v1/ws'

export interface ItemModel {
  id?: string
  name: string
  price: number
  image: string
  tags: string[]
}

export interface CartItemModel extends ItemModel {
  quantity: number
}

export interface OrderModel {
  id: string
  items: CartItemModel[]
  created_at: string
  total: number
  status: string
}

export interface UpdaterModel {
  event: string
  category: string
}
