import { ElectronAPI } from '@electron-toolkit/preload'
import { ItemModel, OrderModel, UpdaterModel } from 'src/shared/model'

declare global {
  interface Window {
    electron: ElectronAPI
    context: {
      getItems: () => Promise<ItemModel[]>
      getOrders: () => Promise<OrderModel[]>
      autoUpdater: (callback: (data: UpdaterModel) => void) => void
    }
  }
}
