
let startMousePosition, startWindowLocation;
let isMoving = false;
const electron = require('electron');
const bus = require('./bus');
const mouseDown = window => {
    log.warn('mouseDown');
    startMousePosition = electron.screen.getCursorScreenPoint();
    startWindowLocation = window.getBounds();
};

const mouseUp = window => {
    const bounds = window.getBounds();
    log.warn('mouseUp', bounds);
    isMoving = false;
    bus.sendEvent('bounds-changed', bounds);
};

const setBounds = (window, event, newBounds) => {
    log.warn('setBounds', newBounds);
    window.setBounds(newBounds);
};

const moveEvent = (window, event, data) => {
    event ? event.preventDefault() : null;
    isMoving = true;
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
    const bounds = { x, y, width, height };
    log.warn('moveEvent', bounds);
    /** skip roundtrip block, fix bug */
    // setBounds(window, null, bounds);
    /** end skip roundtrip block */
    // respond on the provided channel
    bus.sendEvent('bounds-changing', bounds);
};
module.exports = {
    mouseDown,
    mouseUp,
    setBounds,
    moveEvent,
}