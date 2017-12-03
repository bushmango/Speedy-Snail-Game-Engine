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

const hatFrames = spriteCreator.create16_frameHRun(2, 1, 5)

export class HatManager {

  context: LudumDare40Context

  items: Hat[] = []

  init(context: LudumDare40Context) {
    this.context = context
  }

  createAt(x, y) {
    let item = new Hat()
    item.init(this.context)
    item.moveTo(x, y)

    item.body.texture.frame = _.sample(hatFrames)

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
      boundsDrawer.draw(c.bounds)
    })
  }

}

export class Hat {

  context: LudumDare40Context
  container = new PIXI.Container()

  body: PIXI.Sprite

  frame = 0

  bounds = new Bounds()

  isReadyToBeDestroyed = false

  init(cx: LudumDare40Context) {
    this.context = cx

    this.body = spriteCreator.create16_sprite(this.context.sge, 'ase-512-16', 2, 1)
    this.body.anchor.set(0.5, 11/16 )

    this.container.addChild(this.body)

  }

  destroy() {
    if (this.isReadyToBeDestroyed) { return }
    // this.context.particles.emitBlobParts(this.bounds.x, this.bounds.y)
    this.isReadyToBeDestroyed = true
  }



  update() {

    if (this.isReadyToBeDestroyed) { return }

    this.frame++

    this.bounds.update(this.context)

    this.container.position.set(this.bounds.x, this.bounds.y)

    this.body.scale.set(this.bounds.facingRight ? 1 : -1, 1)

  }

  moveTo(x, y) {
    this.bounds.moveTo(x, y)
  }

}
