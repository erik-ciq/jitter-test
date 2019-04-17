
let startMousePosition, startWindowLocation, lastTimestamp, lastBounds, lastMousePosition, mx, my;
let isMoving = false;
let counter = 0;
const electron = require('electron');
const bus = require('./bus');

const mouseDown = window => {
    startMousePosition = electron.screen.getCursorScreenPoint();
    startWindowLocation = window.getBounds();
    mx = startMousePosition.x - startWindowLocation.x;
    my = startMousePosition.y - startWindowLocation.y;
    const { height, width, x, y } = startWindowLocation;
    console.log('\n\n');
    log.warn('mouseDown', { counter, height, width, x, y });
};

const mouseUp = window => {
    // paper over the issue, fix the jitter by setting bounds most recently used on mouse up
    window.setBounds(lastBounds);
    const { height, width, x, y } = window.getBounds();
    const bounds = { counter, height, width, x, y };
    log.warn('mouseUppp', bounds);
    isMoving = false;
    bus.sendEvent('bounds-changed', lastBounds);
};

const setBounds = (window, event, newBounds) => {
    // unnecessary
    // if (newBounds.timestamp < lastTimestamp) {
    //     log.debug('setBounds out of order, dropping');
    //     return;
    // }

    log.warn('setBounds', newBounds);
    window.setBounds(newBounds);
    window.setBounds(newBounds);
    const { height, width, x, y } = window.getBounds();
    log.warn('getBounds', { counter, height, width, x, y }, '\n');
    isMoving = false;
};

const moveEvent = (window, event, data) => {
    // event ? event.preventDefault() : null;
    // if (isMoving) {
    //     return;
    // }
    // isMoving = true;
    counter++;
    const timestamp = lastTimestamp = new Date().getTime();
    // get current mouse x and y position
    const currentMousePosition = lastMousePosition = electron.screen.getCursorScreenPoint();
    const currentWindowLocation = window.getBounds();
    
    const cmx = currentMousePosition.x -currentWindowLocation.x;
    const cmy = currentMousePosition.y -currentWindowLocation.y;
     // provide width and height using startWindowLocation - otherwise the window grows while holding mouse down (probably a bug with electron?)
    const { width, height } = startWindowLocation;
    let x, y;
    
    if (cmx !== mx || cmy !== my) {
        x = currentMousePosition.x - mx;
        y = currentMousePosition.y - my;
    } else {
        // get the difference between start and end mouse position
        const deltaX = currentMousePosition.x - startMousePosition.x;
        const deltaY = currentMousePosition.y - startMousePosition.y;
        // sum deltaX and the windows original location to get our new x and y
        x = startWindowLocation.x + deltaX;
        y = startWindowLocation.y + deltaY;
    }
   
    // const bounds = lastBounds = { counter, height, width, x, y, timestamp }; // timestamp not necessary, messes with output
    const bounds = lastBounds = { counter, height, width, x, y };
    log.warn('moveEvent', bounds);
    
    // case 1 - send bounds across bus - jitter will occur when it comes back across bus
    bus.sendEvent('bounds-changing', bounds); // case 1
    // case 2 - do not send bounds across bus - no jitter will occur
    // case 3 - send bounds across bus AND also set them immediately - no jitter will occur
    // bus.sendEvent('bounds-changing', bounds); // case 3
    // setBounds(window, null, bounds); // case 3


};
module.exports = {
    mouseDown,
    mouseUp,
    setBounds,
    moveEvent,
}