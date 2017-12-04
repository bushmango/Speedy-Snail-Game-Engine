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

const decorFrames = [
  spriteCreator.create16_frameHRun(2, 13, 3),
  spriteCreator.create16_frameHRun(3, 13, 3),
  spriteCreator.create16_frameHRun(4, 13, 1),
]

export class DecorManager {

  context: LudumDare40Context

  items: Decor[] = []

  init(context: LudumDare40Context) {
    this.context = context
  }

  createAt(x, y) {
    let item = new Decor()
    item.init(this.context)
    item.moveTo(x, y)
    this.items.push(item)
    this.context.layerDecor.addChild(item.container)
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
        this.context.layerDecor.removeChild(c.container)
      })

      console.log(`cleaning up ${removed.length} items - ${this.items.length} left`)
    }
  }

  clear() {
    _.forEach(this.items, (c) => {
      c.isReadyToBeDestroyed = true
      this.context.layerDecor.removeChild(c.container)
    })
    this.items = []
  }

  drawBounds(boundsDrawer: BoundsDrawer) {
    _.forEach(this.items, (c) => {
      boundsDrawer.draw(c.bounds)
    })
  }

}

export class Decor {

  context: LudumDare40Context
  container = new PIXI.Container()

  body: PIXI.Sprite

  frame = 0
  frameIdx = 0

  objIndex = 0

  bounds = new Bounds()

  isReadyToBeDestroyed = false

  init(cx: LudumDare40Context) {
    this.context = cx

    this.body = spriteCreator.create16_sprite(this.context.sge, 'ase-512-16', 4, 1)
    this.body.anchor.set(0.5, 1)

    this.frameIdx = _.random(0, 999, false)

    this.container.addChild(this.body)

  }

  destroy() {
    if (this.isReadyToBeDestroyed) { return }
    this.isReadyToBeDestroyed = true

    this.context.particles.emitDecorParts(this.body.texture.frame, this.bounds.x, this.bounds.y - 4)

    this.context.sounds.playSmash()


  }

  update() {

    if (this.isReadyToBeDestroyed) { return }

    this.frame++

    if (this.frame % 16 === 0) {
      this.frameIdx++

      let frames = decorFrames[this.objIndex]

      this.frameIdx = this.frameIdx % frames.length
      this.body.texture.frame = frames[this.frameIdx]
    }

    this.bounds.update(this.context)

    this.container.position.set(this.bounds.x, this.bounds.y)

    this.body.scale.set(this.bounds.facingRight ? 1 : -1, 1)

    // this.context.particles.emitBlobParts(this.body.texture.frame, x, y)
  }

  moveTo(x, y) {
    this.bounds.moveTo(x, y)
  }

}
