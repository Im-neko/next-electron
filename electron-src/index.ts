// Native
import { join } from 'path'

// Packages
import { BrowserWindow, app, ipcMain, IpcMainEvent } from 'electron'
import prepareNext from 'electron-next'
import { nextStart } from 'next/dist/cli/next-start'

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer')

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: join(__dirname, 'preload.js'),
    },
  })

  // next appのあるディレクトリ
  nextStart(['../next-typescript'])

  // デフォルトのnextの起動ポート
  const url = 'http://localhost:3000/'

  mainWindow.loadURL(url)
})

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit)

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  console.log(message)
  setTimeout(() => event.sender.send('message', 'hi from electron'), 500)
})
