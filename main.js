const { app, BrowserWindow, screen } = require("electron")
const WebSocket = require("ws")
require('dotenv').config()

app.setLoginItemSettings({
  openAtLogin: true, // Inicia la app al inicio de windows
  path: app.getPath('exe')
})

let windows = {}
let wss
let wsClient

app.whenReady().then(() => {
  const displays = screen.getAllDisplays()
  createWebSocketClient(displays)
})

function createWebSocketClient(displays) {
  wsClient = new WebSocket(process.env.WS_CLIENT)

  wsClient.on("open", () => {
    console.log("Conexión WebSocket abierta")
  })

  wsClient.on("error", (error) => {
    console.error("Error de conexión WebSocket:", error)
  })

  wsClient.on("close", () => {
    console.log("Conexión WebSocket cerrada")
  })

  wsClient.on("message", (message) => {
    try {
      const data = JSON.parse(message)
      console.log("Mensaje recibido en Electron:", data)

      if (data.action === "open") {
        openMultipleWindows(data.urls, wsClient, displays)
      } else if (data.action === "close") {
        closeWindowById(data.windowId)
      }
    } catch (error) {
      console.error("Error al procesar mensaje WebSocket:", error)
    }
  })
}

function openMultipleWindows(urls, ws, displays) {
  let windowIds = []
  if (displays.length > 1) {
    const secondMonitor = displays[1]
    const secondMonitorLeft = secondMonitor.bounds.x // La posición horizontal del segundo monitor
    const secondMonitorTop = secondMonitor.bounds.y  // La posición vertical del segundo monitor
    const secondMonitorWidth = secondMonitor.bounds.width // Ancho del segundo monitor
    const secondMonitorHeight = secondMonitor.bounds.height // Alto del segundo monitor

    JSON.parse(urls).forEach((url, index) => {
      const windowId = `win_${Date.now()}_${index}`
      let win = new BrowserWindow({
        width: secondMonitorWidth,
        height: secondMonitorHeight,
        x: secondMonitorLeft,
        y: secondMonitorTop,
      })
      win.loadURL(url)

      windows[windowId] = win

      win.on("closed", () => {
        delete windows[windowId]
      })

      windowIds.push(windowId)
    })
  } else {
    const primaryMonitor = displays[0]
    const primaryMonitorLeft = primaryMonitor.bounds.x
    const primaryMonitorTop = primaryMonitor.bounds.y
    const primaryMonitorWidth = primaryMonitor.bounds.width
    const primaryMonitorHeight = primaryMonitor.bounds.height

    JSON.parse(urls).forEach((url, index) => {
      const windowId = `win_${Date.now()}_${index}`
      let win = new BrowserWindow({
        width: primaryMonitorWidth,
        height: primaryMonitorHeight,
        x: primaryMonitorLeft,
        y: primaryMonitorTop,
      })

      win.loadURL(url)

      windows[windowId] = win

      win.on("closed", () => {
        delete windows[windowId]
      })

      win.once('ready-to-show', () => {
        setTimeout(() => {
          win.focus()
        }, 200)
      })

      windowIds.push(windowId)
    })
  }

  ws.send(JSON.stringify({ action: "opened", windowIds }))
}

function closeWindowById(windowId) {
  windowId.forEach(id => {
    if(windows[id]) {
      windows[id].close()
      delete windows[id]
    }
  })
}

app.on("window-all-closed", (event) => event.preventDefault())
