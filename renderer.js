// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer } = require('electron');
let responseChannel = 0;

/**
 * send mouseDown ipc message to main process
 */
async function onMouseDown() {
    responseChannel++;
    ipcRenderer.send('mouseDown', { responseChannel });
    await new Promise(resolve => { ipcRenderer.on(responseChannel, resolve) });
    $(document).mousemove(onMouseMove);
};

/**
 * send mouseMove ipc message to main process
 */
async function onMouseMove() {
    responseChannel++;
    ipcRenderer.send('mouseMove', { responseChannel });
    await new Promise(resolve => { ipcRenderer.on(responseChannel, resolve) });
};

/**
 * remove mouse move listener on mouse up
 */
async function onMouseUp() {
    $(document).off('mousemove');
}

$(document).ready(function () {
    $(document).mousedown(onMouseDown);
    $(document).mouseup(onMouseUp);
});

