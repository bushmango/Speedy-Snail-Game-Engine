// Based on electron-quick-start

// Modules to control application life and create native browser window

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

const { app, BrowserWindow } = require('electron')
const electron = require('electron')
const path = require('path')
const process = require('process')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

var isWin = process.platform === 'win32'

// see: https://github.com/hokein/electron-sample-apps/blob/b721a920e641f6937c8d8277660a15d00c42509f/webgl/main.js#L8
// see: http://www.html5gamedevs.com/topic/33785-should-pixijs-webgl-work-in-electron/
// Chrome by default black lists certain GPUs because of bugs.
// if your are not able to view webgl try enabling --ignore-gpu-blacklist option
// But, this will make electron/chromium less stable.
app.commandLine.appendSwitch('--ignore-gpu-blacklist')

function intercept() {
  electron.protocol.interceptFileProtocol(PROTOCOL, (request, callback) => {
    let url = ''
    try {
      //console.log('intercept', PROTOCOL)

      // // Strip protocol
      //console.log('url', request.url)
      url = request.url.substr(PROTOCOL.length + 1)
      url = url.replace('C:/', '')
      //console.log('1', url)

      // Build complete path for node require function
      url = path.join(__dirname, WEB_FOLDER, url)

      //console.log('2', url)

      // Replace backslashes by forward slashes (windows)
      if (isWin) {
        url = url.replace(/\\/g, '/')
      }
      //console.log('3', url)
      url = path.normalize(url)

      //console.log('4', url)

      // Remove cachebuster, etc.
      if (url.indexOf('?') !== -1) {
        url = url.substring(0, url.indexOf('?'))
      }

      // console.log('5', url)

      console.log('Redirect', request.url, ' -> ', url)

      //console.log(url)
    } catch (err) {
      console.error('err', err)
    }
    callback({ path: url })
  })
}

function createWindow() {
  // See:
  // https://github.com/electron/electron/issues/2242
  const WEB_FOLDER = 'web'
  const PROTOCOL = 'file'

  //intercept()

  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1400, height: 900 })

  if (isWin) {
    //mainWindow.setMenu(null)
  }

  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')
  //mainWindow.loadFile('/ludum-dare-43.html')
  mainWindow.loadFile('web/ludum-dare-43.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
