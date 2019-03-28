// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron')
const { mouseDown, mouseUp, moveEvent, setBounds } = require('./events')
const { rateLimit } = require('./helpers')
const throttle = require('lodash.throttle');
const debounce = require('lodash.debounce');
global.log = require('electron-log');
const throttledMove = throttle((event, newBounds) => moveEvent(mainWindow, event, newBounds), 50);
const debouncedMove = debounce((event, newBounds) => moveEvent(mainWindow, event, newBounds), 10, { trailing: false });
const rateLimitedMove = rateLimit((event, newBounds) => moveEvent(mainWindow, event, newBounds), 1);
log.transports.console.level = 'warn';
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
const WINAPI = { // https://wiki.winehq.org/List_Of_Windows_Messages
  WM_ENTERSIZEMOVE: 561,
  WM_EXITSIZEMOVE: 562,
  WM_WINDOWPOSCHANGED: 71,
  WM_WINDOWPOSCHANGING: 70,
}

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })
  /** boilerplate */
  mainWindow.loadFile('index.html')
  mainWindow.on('closed', function () {
    mainWindow = null
  });
  /** end boilerplate */

  /** finsemble electron adapter */
  mainWindow.on('will-move', (event, newBounds) => {
    event.preventDefault();
    // take your pick between throttled, rate limited, debounced, or vanilla
    // throttledMove(event, newBounds);
    // rateLimitedMove(event, newBounds);
    // debouncedMove(event, newBounds);
    moveEvent(mainWindow, event, newBounds);
  });
  mainWindow.hookWindowMessage(WINAPI.WM_ENTERSIZEMOVE, () => mouseDown(mainWindow));
  mainWindow.hookWindowMessage(WINAPI.WM_EXITSIZEMOVE, () => mouseUp(mainWindow));
  // mainWindow.hookWindowMessage(WINAPI.WM_WINDOWPOSCHANGING, () => log.debug('winposc')); // unnecessary
  // mainWindow.hookWindowMessage(WINAPI.WM_WINDOWPOSCHANGED, () => log.debug('winposd')); // unnecessary
  // mainWindow.on('move', e => log.debug('move')); // unnecessary
  ipcMain.on('setBounds', (event, data) => setBounds(mainWindow, event, data));

  
  
  /** end finsemble electron adapter */
}
app.on('ready', createWindow)