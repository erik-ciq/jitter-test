const { ipcMain } = require('electron');
const listeners = [];

const addListener = (event, topic) => {
    if (!listeners[topic]) {
        listeners[topic] = {};
    }
    listeners[topic][event.sender.id] = { sender: event.sender };
}

const removeListener = (event, topic) => {
    if (!this.listeners[eventTopic]) {
        return;
    }

    if (!this.listeners[eventTopic][event.sender.id]) {
        return;
    }

    delete this.listeners[eventTopic][event.sender.id];
}

module.exports = {
    sendEvent(topic, data) {
        if (!listeners[topic]) {
            return;
        }
        const sendList = Object.keys(listeners[topic]);
        const payload = { topic, data };
        sendList.forEach(key => listeners[topic][key].sender.send('systemResponse', payload));
    }
}

ipcMain.on('addListener', addListener);
ipcMain.on('removeListener', removeListener);