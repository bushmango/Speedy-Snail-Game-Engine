import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare40/util/spriteCreator'
import { KeyCodes } from 'engine/input/Keyboard';

const turn = Math.PI * 2

import { hats } from './hats'
import { HatStack } from 'ludumDare40/entities/HatStack'
import { LudumDare40Context } from 'ludumDare40/LudumDare40Context';
import { BoundsDrawer } from 'ludumDare40/entities/BoundsDrawer';
import { Bounds } from './Bounds';

const blobFrames = [
  spriteCreator.create16_frameHRun(4, 1, 2),
  spriteCreator.create16_frameHRun(4, 16, 2),
  spriteCreator.create16_frameHRun(5, 16, 2),
  spriteCreator.create16_frameHRun(3, 16, 2),
]

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

  clear() {
    _.forEach(this.items, (c) => {
      c.isReadyToBeDestroyed = true
      this.context.layerObjects.removeChild(c.container)
    })
    this.items = []
  }

  drawBounds(boundsDrawer: BoundsDrawer) {
    _.forEach(this.items, (c) => {
      boundsDrawer.draw(c.bounds)
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

  jumpFrameCounter = 0

  bounds = new Bounds()

  isReadyToBeDestroyed = false

  mode = 0


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
    this.isReadyToBeDestroyed = true

    this.context.particles.emitBlobParts(this.bounds.x, this.bounds.y - 4)

    this.context.sounds.playSmash()

    _.forEach(this.hats.hats, (c, cIdx) => {
      this.popHat(c, cIdx)
    })

  }

  popHat(c, cIdx) {
    let hat = this.context.hats.createAt(this.bounds.x, this.bounds.y - 4 - 8 - cIdx * 3)
    hat.body.texture.frame = c.texture.frame
    hat.bounds.vx = _.random(15, 64)
    if (_.random(0, 1) === 1) {
      hat.bounds.vx *= -1
    }
    hat.bounds.vy = _.random(-300, -50)
  }

  update() {

    if (this.isReadyToBeDestroyed) { return }

    let numHats = this.context.getPlayerHatCount()

    this.frame++

    if (this.frame % 16 === 0) {

      this.mode = 0
      if (numHats > 20) {
        this.mode = 3
      }
      if (numHats > 30) {
        this.mode = 1
      }
      if (numHats > 40) {
        this.mode = 2
      }

      this.frameIdx++
      this.frameIdx = this.frameIdx % blobFrames[this.mode].length

      this.body.texture.frame = blobFrames[this.mode][this.frameIdx]

    }

    if (this.bounds.isJumping) {
      this.bounds.jumpFrames++
    }
    if (this.bounds.jumpFrames > 90) {
      this.bounds.setStateFalling()
      this.bounds.jumpFrames = 0
    }

    if (numHats > 20) {
      if (this.bounds.onGround) {
        this.jumpFrameCounter--
        if (this.jumpFrameCounter <= 0) {
          this.jumpFrameCounter = _.random(60, 120)
          this.bounds.jump()
        }
      }
    }

    this.bounds.update(this.context)

    this.container.position.set(this.bounds.x, this.bounds.y)

    this.body.scale.set(this.bounds.facingRight ? 1 : -1, 1)



    this.hats.x = 0
    this.hats.y = -9 + (this.frameIdx === 0 ? 0 : 1)
    this.hats.facingRight = this.bounds.facingRight
    this.hats.update()

    // this.context.particles.emitBlobParts(this.body.texture.frame, x, y)
  }

  moveTo(x, y) {
    this.bounds.moveTo(x, y)
  }

}
