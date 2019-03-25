
let startMousePosition, startWindowLocation;
const electron = require('electron');

module.exports = {
    mouseDown: (window, event, data) => {
        // console.log('la')
        // startMousePosition = electron.screen.getCursorScreenPoint();
        // startWindowLocation = window.getBounds();
        event.sender.send(`${data.responseChannel}`, 'done');
    },

    mouseMove: (window, event, data) => {
        console.log('wooooo');
        if (!startMousePosition) {
            startWindowLocation = window.getBounds();
            return startMousePosition = electron.screen.getCursorScreenPoint();
        }
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
        window.setBounds(bounds);
        // respond on the provided channel
        event.sender.send(`${data.responseChannel}`, 'done');
    },
}