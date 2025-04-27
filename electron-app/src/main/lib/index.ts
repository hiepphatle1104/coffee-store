import { baseUrl, wsUrl } from '@/shared/model'
import { BrowserWindow } from 'electron'

export const getItems = async () => {
  try {
    const response = await fetch(`${baseUrl}/items`)
    const res = await response.json()

    return res.data
  } catch (error) {
    return []
  }
}

export const getOrders = async () => {
  try {
    const response = await fetch(`${baseUrl}/orders`)
    const res = await response.json()

    return res.data
  } catch (error) {
    return []
  }
}

let ws: WebSocket

export const connectWebSocket = (mainWindow: BrowserWindow) => {
  ws = new WebSocket(`${wsUrl}`)

  ws.onmessage = function (event) {
    // Xử lý dữ liệu nhận được từ WebSocket
    const data = JSON.parse(event.data)

    // console.log('Dữ liệu nhận được từ WebSocket:', data)

    // Gửi dữ liệu đến renderer process
    mainWindow.webContents.send('auto-update', data)
  }

  ws.onclose = function () {
    console.log('Kết nối đã đóng')
    // Tạo lại kết nối sau 5 giây
    setTimeout(() => {
      reconnectWebSocket()
    }, 5000)
  }

  ws.onerror = function (error) {
    console.error('Lỗi WebSocket:', error)
  }
}

const reconnectWebSocket = () => {
  console.log('Đang kết nối lại...')
  const newWs = new WebSocket(`${wsUrl}`)
  newWs.onopen = function () {
    console.log('Kết nối lại thành công')
    ws = newWs
  }

  newWs.onerror = function () {
    console.error('Lỗi khi kết nối lại')
    setTimeout(reconnectWebSocket, 5000)
  }
}
