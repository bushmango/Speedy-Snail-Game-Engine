import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { _ } from 'engine/importsEngine'
import { GamepadMicro, gp, getGamepads } from 'engine/gamepad/gamepadLib'

import { ButtonState, DPadState, getGamepadDir, setButtonState, setDPadState, setKeyState, setCombinedState } from './InputGeneric'
import { KeyCodes } from 'engine/input/Keyboard';

export class MenuInput {
  dir = -1
  lastDir = -1

  dpad = new DPadState()
  buttonOk = new ButtonState()

  keyUp = new ButtonState()
  keyDown = new ButtonState()
  keyOk = new ButtonState()

  combinedOk = new ButtonState()
}

function updateMenuGamepadInput(menuInput: MenuInput, gamepad) {

  let threshhold = 0.67

  setDPadState(menuInput.dpad, gamepad)

  setButtonState(menuInput.buttonOk, gamepad, 'actionSouth')

  menuInput.lastDir = menuInput.dir
  menuInput.dir = getGamepadDir(gamepad, menuInput.dpad, threshhold)
}

function updateMenuKeyboardInput(sge, menuInput: MenuInput) {

  // Check keys

  setKeyState(sge, menuInput.keyUp, [KeyCodes.w, KeyCodes.arrowUp])
  setKeyState(sge, menuInput.keyDown, [KeyCodes.s, KeyCodes.arrowDown])

  setKeyState(sge, menuInput.keyOk, [KeyCodes.space, KeyCodes.enter])

}

export class MenuInputControl {

  sge: SimpleGameEngine

  input = new MenuInput()

  init(_sge) {
    this.sge = _sge
  }

  update() {

    let gamepads = getGamepads()
    if (gp && gamepads && gamepads.length > 0) {
      updateMenuGamepadInput(this.input, gamepads[0])
    }
    updateMenuKeyboardInput(this.sge, this.input)

    setCombinedState(this.input.combinedOk, [this.input.keyOk, this.input.buttonOk])

  }
}

