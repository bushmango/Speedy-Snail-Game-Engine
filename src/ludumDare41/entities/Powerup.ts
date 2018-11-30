import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare41/util/spriteCreator'
import { KeyCodes } from 'engine/input/Keyboard'
import { LudumDare41Context } from 'ludumDare41/LudumDare41Context'
import { GenericManager } from 'ludumDare41/entities/GenericManager'

const bulletFrames = [
  [spriteCreator.create8_frame(1, 8)],
  [spriteCreator.create8_frame(1, 9)],
  [spriteCreator.create8_frame(1, 10)],
  [spriteCreator.create8_frame(1, 11)],
]

export class PowerupManager extends GenericManager<Powerup> {
  createAt(x, y) {
    let item = this._createAt(Powerup, x, y)
    item.moveTo(x, y)
    return item
  }
}

export class Powerup {
  context: LudumDare41Context
  container = new PIXI.Container()

  id = -1
  body: PIXI.Sprite
  frame = _.random(0, 100, false)
  rotation = 0

  bx: number = 0
  by: number = 0

  oy = 0

  isReadyToBeDestroyed: boolean

  init(cx: LudumDare41Context) {
    this.context = cx
    this.body = spriteCreator.create8_sprite(
      this.context.sge,
      'ase-512-8',
      5,
      1
    )
    this.body.anchor.set(0.5, 1)
    this.container.addChild(this.body)
  }

  destroy() {
    if (this.isReadyToBeDestroyed) {
      return
    }
    this.isReadyToBeDestroyed = true
  }

  update() {
    if (this.isReadyToBeDestroyed) {
      return
    }

    this.frame++

    let adjFrame = Math.floor(this.frame / 10)

    if (adjFrame % 10 === 0) {
      this.oy = -1
    } else {
      this.oy = 0
    }

    let adjFrame2 = Math.floor(this.frame / 7)
    let rotation = 0
    if (adjFrame2 % 6 === 0) {
      rotation = Math.PI * 0.03
    }
    if (adjFrame2 % 4 === 0) {
      rotation = Math.PI * -0.03
    } else {
      rotation = 0
    }

    this.body.rotation = rotation

    this.moveTo(this.bx, this.by)
  }

  moveTo(x, y) {
    this.bx = x
    this.by = y
    this.body.position.set(8 * x + 8 / 2, 8 * y + 8 + this.oy)
  }
}
