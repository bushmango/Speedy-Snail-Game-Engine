import { SimpleGameEngine } from 'engine/SimpleGameEngine';
import { _ } from 'engine/importsEngine'

export class ButtonState {

  isPressed = false
  justPressed = false
  justReleased = false

}

export class DPadState {
  n = new ButtonState()
  e = new ButtonState()
  s = new ButtonState()
  w = new ButtonState()
}

export function setButtonState(btn: ButtonState, gamepad, buttonKey) {

  btn.justReleased = false
  btn.justPressed = false

  if (gamepad) {
    let gamepadButton = gamepad.buttons[buttonKey]
    if (gamepadButton) {

      if (gamepadButton.released) {
        if (btn.isPressed) {
          btn.isPressed = false
          btn.justReleased = false
        }
      } else if (gamepadButton.pressed || gamepadButton.held) {
        if (!btn.isPressed) {
          btn.justPressed = true
        }
        btn.isPressed = true
        btn.justReleased = false
      } else {
        btn.isPressed = false
      }
    }

  }

}

export function setKeyState(sge: SimpleGameEngine, btn: ButtonState, keys: number[]) {

  btn.justReleased = false
  btn.justPressed = false
  btn.isPressed = false

  _.forEach(keys, (c) => {
    let key = sge.keyboard.getKey(c)
    if (key.isPressed) {
      btn.isPressed = true
    }
    if (key.justPressed) {
      btn.justPressed = true
    }
    if (key.justReleased) {
      btn.justReleased = true
    }
  })

}

export function setCombinedState(btn: ButtonState, buttons: ButtonState[]) {
  btn.justReleased = false
  btn.justPressed = false
  btn.isPressed = false

  _.forEach(buttons, (c) => {
    if (c.isPressed) {
      btn.isPressed = true
    }
    if (c.justPressed) {
      btn.justPressed = true
    }
    if (c.justReleased) {
      btn.justReleased = true
    }
  })
}


export function setDPadState(dpadState: DPadState, gamepad) {
  setButtonState(dpadState.n, gamepad, 'dPadUp')
  setButtonState(dpadState.e, gamepad, 'dPadRight')
  setButtonState(dpadState.s, gamepad, 'dPadDown')
  setButtonState(dpadState.w, gamepad, 'dPadLeft')
}

export function getDpadDir(dpadState: DPadState) {
  let dir = -1

  if (dpadState.n.isPressed) {
    dir = 0
  }
  if (dpadState.e.isPressed) {
    dir = 1
  }
  if (dpadState.s.isPressed) {
    dir = 2
  }
  if (dpadState.w.isPressed) {
    dir = 3
  }

  return dir
}

export function getStickDir(gamepad, stickName, threshhold) {
  let dir = -1
  if (gamepad) {
    let stick = gamepad[stickName]
    if (stick) {

      if (stick.x > threshhold) {
        dir = 1
      } else if (stick.x < -threshhold) {
        dir = 3
      }

      if (stick.y > threshhold) {
        dir = 2
      } else if (stick.y < -threshhold) {
        dir = 0
      }
    }
  }
  return dir
}

export function getGamepadDir(gamepad, dpadState: DPadState, threshhold: number) {

  let dir = -1
  if (gamepad) {

    let leftStickDir = getStickDir(gamepad, 'leftStick', threshhold)
    if (leftStickDir !== -1) { dir = leftStickDir }

    let rightStickDir = getStickDir(gamepad, 'rightStick', threshhold)
    if (rightStickDir !== -1) { dir = rightStickDir }

    let dpadDir = getDpadDir(dpadState)
    if (dpadDir !== -1) { dir = dpadDir }

  }
  return dir
}