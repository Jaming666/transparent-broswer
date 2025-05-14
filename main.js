// Issues with node package? Rebuild
// .\node_modules\.bin\electron-rebuild.cmd

const electron = require('electron')
const remoteMain = require('@electron/remote/main')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const globalShortcut = electron.globalShortcut
remoteMain.initialize()

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// 监听快捷键来显示/最小化窗口
function setupGlobalShortcut(win) {
    globalShortcut.register('Alt+\\', () => {
      if (win.isVisible()) {
        win.hide();
      } else {
        win.show();
      }
    });
  }

function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      titleBarStyle: 'hidden',
      frame: false,
      width: 900,
      height: 600,
      transparent: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webviewTag: true,
        webSecurity: false
      }
    });

    remoteMain.enable(mainWindow.webContents)

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.setAlwaysOnTop(true);
    // mainWindow.setIgnoreMouseEvents(true);



    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null
    })


    mainWindow.on('minimize',function(event){
        // console.log("Clickthrough disabled");
        // mainWindow.setIgnoreMouseEvents(false);
    });
    setupGlobalShortcut(mainWindow)
  }

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


// 自定义的事件处理函数
function handleKeyboardShortcut() {
    console.log('键盘快捷键被触发');
  }


   
// 清理和注销快捷键
app.on('will-quit', () => {
    globalShortcut.unregister('CommandOrControl+Alt+\\');
    globalShortcut.unregisterAll();
});