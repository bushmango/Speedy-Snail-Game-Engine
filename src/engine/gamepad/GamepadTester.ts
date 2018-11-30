import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { numeral } from 'engine/importsEngine'

import { GamepadMicro, gp, getGamepads } from './gamepadLib'

export class GamepadTester {
  group: PIXI.Container

  messages: any = {}

  cx = 20
  cy = 80

  init(sge: SimpleGameEngine) {
    let group = (this.group = new PIXI.Container())
    sge.addGroup(group)
  }

  addMessage(key) {
    if (this.messages[key]) {
      return this.messages[key]
    }
    let message = new PIXI.Text('Hello Controller!', {
      fontFamily: 'Arial',
      fontSize: 20,
      fill: 'white',
    })
    message.x = this.cx
    message.y = this.cy
    this.cy += 24
    this.messages[key] = message
    this.group.addChild(message)
    return message
  }

  tryAddStick(gamepad, key) {
    if (gamepad[key]) {
      let m = this.addMessage(key)
      m.text =
        '' +
        key +
        ':' +
        numeral(gamepad[key].x).format('0.00') +
        ' ' +
        numeral(gamepad[key].y).format('0.00')
    }
  }

  update() {
    //var gamepad = gamepads[0]
    let gamepads = getGamepads()
    // console.log('gamepads', gamepads)
    if (gp && gamepads) {
      //console.log('GP', gamepad)
      // console.log(gamepads, gp)

      let gamepad = gamepads[0]

      this.tryAddStick(gamepad, 'leftStick')
      this.tryAddStick(gamepad, 'rightStick')
      this.tryAddStick(gamepad, 'dPad')

      gp.buttonKeys.map((key) => {
        var button = gamepad.buttons[key]
        let id = 'button_' + key
        let m = this.addMessage(id)
        if (button) {
          m.text =
            '' +
            id +
            ':' +
            (button.released ? 'released' : '') +
            (button.pressed ? 'pressed' : '') +
            (button.held ? 'held' : '')
        } else {
          m.text = '' + id + ':'
        }
      })
    }
  }
}
