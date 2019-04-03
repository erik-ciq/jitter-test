// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer } = require('electron');
const log = require('electron-log');
let responseChannel = 0;

const onBoundsChanging = newBounds => {
    log.warn('onBoundsC', newBounds);
    ipcRenderer.send('setBounds', newBounds);
}

const onBoundsChanged = newBounds => {
    log.warn('onBoundsC', newBounds);
    ipcRenderer.send('setBounds', newBounds);
}

const handleResponse = (event, payload) => {
    const { topic, data } = payload;
    switch(topic) {
        case 'bounds-changing':
            onBoundsChanging(data);
            break;
        case 'bounds-changed':
            onBoundsChanged(data);
            break;
    }
}
ipcRenderer.send('addListener', 'bounds-changing');
// ipcRenderer.send('addListener', 'bounds-changed');
ipcRenderer.on('systemResponse', handleResponse)