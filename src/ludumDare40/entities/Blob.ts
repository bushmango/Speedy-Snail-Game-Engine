import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare40/util/spriteCreator'
import { KeyCodes } from 'engine/input/Keyboard';

const turn = Math.PI * 2

import { hats } from './hats'
import { HatStack } from 'ludumDare40/entities/HatStack'
import { LudumDare40Context } from 'ludumDare40/LudumDare40Context';
import { BoundsDrawer } from 'ludumDare40/entities/BoundsDrawer';

const blobFrames = spriteCreator.create16_frameHRun(4, 1, 2)

export class BlobManager {

  context: LudumDare40Context

  items: Blob[] = []

  init(context: LudumDare40Context) {
    this.context = context
  }

  createAt(x, y) {
    let item = new Blob()
    item.init(this.context)
    item.moveTo(x, y)
    this.items.push(item)
    this.context.layerObjects.addChild(item.container)
    return item
  }

  update() {
    _.forEach(this.items, (c) => {
      c.update()
    })
    this.destroyMarked()
  }

  destroyMarked() {
    let removed = _.remove(this.items, (c) => (c.isReadyToBeDestroyed))
  
    if (removed.length > 0) {

      _.forEach(removed, (c) => {
        this.context.layerObjects.removeChild(c.container)
      })

      console.log(`cleaning up ${removed.length} items - ${this.items.length} left`)
    }
  }

  drawBounds(boundsDrawer: BoundsDrawer) {
    _.forEach(this.items, (c) => {
      boundsDrawer.draw(c)
    })
  }

}

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

  isReadyToBeDestroyed = false

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

  destroy() {
    if (this.isReadyToBeDestroyed) { return }
    this.context.particles.emitBlobParts(this.body.texture.frame, (this.boundsX1 + this.boundsX2)/2, (this.boundsY1 + this.boundsY2)/2)
    this.context.particles.emitBlobParts(this.body.texture.frame, (this.boundsX1 + this.boundsX2)/2, (this.boundsY1 + this.boundsY2)/2)
    this.context.particles.emitBlobParts(this.body.texture.frame, (this.boundsX1 + this.boundsX2)/2, (this.boundsY1 + this.boundsY2)/2)
    this.isReadyToBeDestroyed = true
  }

  setBounds(x1, y1, x2, y2) {
    this.boundsX1 = x1
    this.boundsX2 = x2
    this.boundsY1 = y1
    this.boundsY2 = y2
  }

  update() {

    if (this.isReadyToBeDestroyed) { return }

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
