import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare40/util/spriteCreator'
import { KeyCodes } from 'engine/input/Keyboard';

const turn = Math.PI * 2

import { hats } from './hats'
import { HatStack } from 'ludumDare40/entities/HatStack'

const blobFrames = spriteCreator.create16_frameHRun(4, 1, 2)

export class Blob {

  sge: SimpleGameEngine
  container = new PIXI.Container()

  body: PIXI.Sprite
  hats = new HatStack()

  frame = 0
  frameIdx = 0

  subX = 0 * 16
  subY = 0 * 16

  facingRight = true

  init(_sge: SimpleGameEngine) {
    this.sge = _sge

    this.body = spriteCreator.create16_sprite(this.sge, 'ase-512-16', 4, 1)
    this.body.anchor.set(0.5, 0)

    this.hats.init(_sge)

    this.frameIdx = _.random(0, 1, false)

    this.container.addChild(this.body)
    this.container.addChild(this.hats.container)

  }
  update() {

    this.frame++

    if (this.frame % 16 === 0) {
      this.frameIdx++
      this.frameIdx = this.frameIdx % blobFrames.length
      this.body.texture.frame = blobFrames[this.frameIdx]
    }

    let subPix = 32
    let x = Math.floor(this.subX / subPix)
    let y = Math.floor(this.subY / subPix)

    this.container.position.set(x, y)
    this.body.scale.set(this.facingRight ? 1 : -1, 1)

    this.hats.y = this.frameIdx === 0 ? 2 : 2.5
    this.hats.facingRight = this.facingRight
    this.hats.update()

  }

  moveTo(x, y) {
    this.subX = x * 32
    this.subY = y * 32
  }

}
