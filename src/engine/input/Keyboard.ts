
import { _ } from 'engine/importsEngine'

export interface IKey {
  keyCode: any,
  isPressed: boolean,
  _delay_isPressed: boolean,
  justPressed: boolean,
  justReleased: boolean,
  _delay_justPressed: boolean,
  _delay_justReleased: boolean,
}

// see: http://keycode.info/
export enum KeyCodes {
  escape = 27,
  w = 87,
  a = 65,
  s = 83,
  d = 68,
  space = 32,
  enter = 13,
  arrowUp = 38,
  arrowDown = 40,
  arrowLeft = 37,
  arrowRight = 39,
}

export class Keyboard {

  init() {
    window.addEventListener(
      "keydown", this.onKeyDown.bind(this), true
    )
    window.addEventListener(
      "keyup", this.onKeyUp.bind(this), true
    )
  }

  onKeyDown(ev) {

    let key = this.keys[ev.keyCode]
    if (!key) { return }

    console.log('key down', ev.keyCode)

    key._delay_justPressed = true
    key._delay_isPressed = true
    event.preventDefault()
  }
  onKeyUp(ev) {

    let key = this.keys[ev.keyCode]
    if (!key) { return }

    console.log('key up', ev.keyCode)

    key._delay_justReleased = true
    key._delay_isPressed = false
    event.preventDefault()
  }
  onUpdate() {
    _.forEach(this.keys, (c) => {
      c.isPressed = c._delay_isPressed
      c.justPressed = c._delay_justPressed
      c.justReleased = c._delay_justReleased
      c._delay_justPressed = false
      c._delay_justReleased = false
    })
  }

  getKey(keyCode):IKey {
    let key = this.keys[keyCode]
    if (!key) {
      key = this.listenFor(keyCode)
    }
    return key
  }

  isPressed(keyCode) {
    return this.getKey(keyCode).isPressed
  }
  isUp(keyCode) {
    return !this.getKey(keyCode).isPressed
  }
  justPressed(keyCode) {
    return this.getKey(keyCode).justPressed
  }
  justReleased(keyCode) {
    return this.getKey(keyCode).justReleased
  }

  listenFor(keyCode) {
    let key = this.keys[keyCode]
    if (key) {
      // Already listening to this
      console.warn('already listening to key ' + keyCode)
      return key
    }
    console.log('listening to key ' + keyCode)

    key = {
      keyCode: keyCode,
      isPressed: false,
      _delay_isPressed: false,
      justPressed: false,
      justReleased: false,
      _delay_justPressed: false,
      _delay_justReleased: false,
    }
    this.keys[keyCode] = key
    return key
  }

  keys: any = {}

}
