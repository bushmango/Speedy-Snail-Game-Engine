import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare40/util/spriteCreator'
import { KeyCodes } from 'engine/input/Keyboard';

const turn = Math.PI * 2

import { hats } from './hats'

export class HatStack {

  sge: SimpleGameEngine
  container = new PIXI.Container()

  hats: PIXI.Sprite[] = []

  frame: 0

  facingRight = true
  x = 0
  y = 0

  init(_sge: SimpleGameEngine) {
    this.sge = _sge

    //dfor (let i = 0; i < 3; i++) {
    //this.addHat()
    //}

  }
  update() {

    let { x, y } = this

    this.container.position.set(x, y)

    this.restackHats()

  }
  restackHats() {
    _.forEach(this.hats, (c, cIdx) => {
      c.position.set(0 + (this.facingRight ? 1 : -1), 0 - 3 * cIdx)
      c.scale.set(this.facingRight ? 1 : -1, 1)
    })
  }

  addHat(frame = null) {
    let hatTilts = [turn / 64, turn / 32, turn / 16, 0, 0, 0, -turn / 16, -turn / 32, -turn / 64]
    let hatData = _.sample(hats)
    let hat = spriteCreator.create16_sprite(this.sge, 'ase-512-16', hatData.y, hatData.x)
    if (frame) {
      hat.texture.frame = frame
    }
    hat.anchor.set(0.5, 11 / 16)
    hat.rotation = _.sample(hatTilts)

    if (this.hats.length === 0) {
      hat.rotation = 0
    }

    this.hats.push(hat)
    this.container.addChild(hat)

    this.restackHats()
  }

  removeBottomHat() {
    let hat = this.hats.shift()
    this.container.removeChild(hat)
    return hat
  }

}
