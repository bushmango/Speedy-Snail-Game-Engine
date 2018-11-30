declare var require
const GamepadMicro = require('gamepad-micro')
const gp = new GamepadMicro()

let gamepads = null
gp.onUpdate((_gamepads) => {
  if (gp.gamepadConnected) {
    // Parse gamepads
    gamepads = _gamepads
  } else {
    // Gamepad disconnected
    gamepads = null
  }
})

function getGamepads() {
  return gamepads
}

export { GamepadMicro, gp, getGamepads }
