import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare40/util/spriteCreator'
import { KeyCodes } from 'engine/input/Keyboard';

const turn = Math.PI * 2

import { hats } from './hats'
import { HatStack } from 'ludumDare40/entities/HatStack'
import { LudumDare40Context } from 'ludumDare40/LudumDare40Context';

const blobFrames = spriteCreator.create16_frameHRun(4, 1, 2)

export class Blob {

  context: LudumDare40Context
  container = new PIXI.Container()

  body: PIXI.Sprite
  hats = new HatStack()

  frame = 0
  frameIdx = 0

  subX = 0 * 16
  subY = 0 * 16

  facingRight = true

  boundsX1 = 0
  boundsX2 = 0
  boundsY1 = 0
  boundsY2 = 0

  init(cx: LudumDare40Context) {
    this.context = cx

    this.body = spriteCreator.create16_sprite(this.context.sge, 'ase-512-16', 4, 1)
    this.body.anchor.set(0.5, 1)

    this.hats.init(this.context.sge)

    this.frameIdx = _.random(0, 1, false)

    this.container.addChild(this.body)
    this.container.addChild(this.hats.container)

  }

  setBounds(x1, y1, x2, y2) {
    this.boundsX1 = x1
    this.boundsX2 = x2
    this.boundsY1 = y1
    this.boundsY2 = y2
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

    this.setBounds(x - 3, y - 8, x + 3, y)

    this.container.position.set(x, y)
    this.body.scale.set(this.facingRight ? 1 : -1, 1)

    this.hats.x = 0
    this.hats.y = -9 + (this.frameIdx === 0 ? 0 : 1)
    this.hats.facingRight = this.facingRight
    this.hats.update()

    // this.context.particles.emitBlobParts(this.body.texture.frame, x, y)
  }

  moveTo(x, y) {
    this.subX = x * 32
    this.subY = y * 32
  }

}
