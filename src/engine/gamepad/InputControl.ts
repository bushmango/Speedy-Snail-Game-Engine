import { SimpleGameEngine } from 'engine/SimpleGameEngine'

import { GamepadMicro, gp, getGamepads } from './gamepadLib'

export class InputControl {
  vx = 0
  vy = 0

  update() {
    let gamepads = getGamepads()
    if (gp && gamepads && gamepads.length > 0) {
      let gamepad = gamepads[0]
      if (gamepad) {
        if (gamepad.leftStick) {
          this.vx = gamepad.leftStick.x || 0
          this.vy = gamepad.leftStick.y || 0
        }
      }
    }
  }
}
