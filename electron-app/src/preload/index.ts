import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { UpdaterModel } from '@/shared/model'

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('context', {
      getItems: () => ipcRenderer.invoke('get:items'),
      getOrders: () => ipcRenderer.invoke('get:orders'),
      autoUpdater: (callback: (arg0: UpdaterModel) => void) =>
        ipcRenderer.on('auto-update', (_event, data: UpdaterModel) => callback(data))
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
