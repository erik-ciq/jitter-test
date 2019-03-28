
let startMousePosition, startWindowLocation, lastTimestamp, lastBounds;
let isMoving = false;
let counter = 0;
const electron = require('electron');
const bus = require('./bus');
const mouseDown = window => {
    startMousePosition = electron.screen.getCursorScreenPoint();
    startWindowLocation = window.getBounds();
    console.log('\n\n');
    log.warn('mouseDown', startWindowLocation, '\n');
};

const mouseUp = window => {
    const { height, width, x, y } = window.getBounds();
    const bounds = { counter, height, width, x, y };
    log.warn('mouseUppp', bounds);
    isMoving = false;
    bus.sendEvent('bounds-changed', bounds);
};

const setBounds = (window, event, newBounds) => {
    // unnecessary
    // if (newBounds.timestamp < lastTimestamp) {
    //     log.debug('setBounds out of order, dropping');
    //     return;
    // }

    log.warn('setBounds', newBounds);
    window.setBounds(newBounds);
    const { height, width, x, y } = window.getBounds();
    log.warn('getBounds', { counter, height, width, x, y }, '\n');
};

const moveEvent = (window, event, data) => {
    event ? event.preventDefault() : null;
    isMoving = true;
    counter++;
    const timestamp = lastTimestamp = new Date().getTime();
    // get current mouse x and y position
    const currentMousePosition = electron.screen.getCursorScreenPoint();
    // get the difference between start and end mouse position
    const deltaX = currentMousePosition.x - startMousePosition.x;
    const deltaY = currentMousePosition.y - startMousePosition.y;
    // sum deltaX and the windows original location to get our new x and y
    const x = startWindowLocation.x + deltaX;
    const y = startWindowLocation.y + deltaY;
    // provide width and height using startWindowLocation - otherwise the window grows while holding mouse down (probably a bug with electron?)
    const { width, height} = startWindowLocation;
    // set our x, y, width, and height on the browser window
    // const bounds = lastBounds = { counter, height, width, x, y, timestamp }; // timestamp not necessary, messes with output
    const bounds = lastBounds = { counter, height, width, x, y };
    log.warn('moveEvent', bounds);
    // respond on the provided channel
    bus.sendEvent('bounds-changing', bounds);
    /** always set bounds here to fix bug */
    window.setBounds(bounds);
    /** end skip roundtrip block */


};
module.exports = {
    mouseDown,
    mouseUp,
    setBounds,
    moveEvent,
}