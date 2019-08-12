/*
 * @Author: w
 * @Date: 2019-08-06 17:58:22
 * @LastEditors: w
 * @LastEditTime: 2019-08-10 18:27:02
 */

'use strict'
import {
  app,
  protocol,
  BrowserWindow,
  Menu,
  MenuItem,
  globalShortcut,
  ipcMain   //更新用的
} from 'electron'
import { autoUpdater } from "electron-updater" //更新用的
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let update
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: {
    secure: true,
    standard: true
  }
}])

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1920,
    height: 1080, // eslint-disable-next-line no-undef
    webPreferences: {
      // 跨域
      webSecurity: false,
      nodeIntegration: true
    },
    icon: `${__static}/app.ico`,
    // 先不显示
    show:false
  })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
  
  // ready后show
  win.on('ready-to-show',()=>{
    win.show();
    updateHandle();
  })
  createMenu()
  
}

function updateHandle() {
  let message = {
    error: {
      status: -1,
      msg:'检查更新出错'
    },
    checking: {
      status: -0,
      msg:'正在检查更新……'
    },
    updateAva:{
      status: 1,
      msg:'检测到新版本，正在下载……'
    },
    updateNotAva:{
      status: 2,
      msg:'现在使用的就是最新版本，不用更新'
    },
    updateFinish:{
      status: 3,
      msg:'下载成功'
    }
  };
  const os = require('os');
  let uploadUrl = 'http://172.20.200.84:888/client';
  autoUpdater.setFeedURL(uploadUrl);
  autoUpdater.on('error', function (error) {
    sendUpdateMessage(message.error)
  });
  autoUpdater.on('checking-for-update', function () {
    sendUpdateMessage(message.checking)
  });
  autoUpdater.on('update-available', function (info) {
    sendUpdateMessage(message.updateAva)
  });
  autoUpdater.on('update-not-available', function (info) {
    sendUpdateMessage(message.updateNotAva)
  });

  // 更新下载进度事件
  autoUpdater.on('download-progress', function (progressObj) {
    win.webContents.send('downloadProgress', progressObj)
  })
  autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
    
    ipcMain.on('isUpdateNow', (e, arg) => {
      console.log("开始更新");
      //some code here to handle event
      autoUpdater.quitAndInstall();
    });
    win.webContents.send('isUpdateNow')
  });

  ipcMain.on("checkForUpdate",()=>{
      //执行自动更新检查
      autoUpdater.checkForUpdates();
  })
}

// 通过main进程发送事件给renderer进程，提示更新信息
function sendUpdateMessage(text) {
  win.webContents.send('message', text)
}

// 顶部menu
function createMenu() {
  // darwin表示macOS，针对macOS的设置
  if (process.platform === 'darwin') {
    const template = [{
      label: '',
      submenu: [{
          role: 'about'
        },
        {
          role: 'quit'
        }
      ]
    }]
    let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)
  } else {
    const template = [{
      label: '操作',
      submenu: [
        {
          label: '重新加载',
          accelerator: 'CmdOrCtrl+R',
          click: function (item, focusedWindow) {
              if (focusedWindow) {
                  // on reload, start fresh and close any old
                  // open secondary windows
                  if (focusedWindow.id === 1) {
                      BrowserWindow.getAllWindows().forEach(function (win) {
                          if (win.id > 1) {
                              win.close()
                          }
                      })
                  }
                  focusedWindow.reload()
              }
          }
        }
      ]
    }]
    let menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu);
    // Menu.setApplicationMenu(null);
    // 上下文菜单

  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {

    try {
      await installVueDevtools()
      // await BrowserWindow.addDevToolsExtension('/Users/WIN10/AppData/Local/Google/Chrome/User Data/Profile 1/Extensions/nhdogjmejiglipccpnnnanhbledajbpd/5.1.1_0')
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  // 在开发环境和生产环境均可通过快捷键打开devTools
  globalShortcut.register('CommandOrControl+Shift+i', function () {
    win.webContents.openDevTools()
  })
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
