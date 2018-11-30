import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare41/util/spriteCreator'
import { KeyCodes } from 'engine/input/Keyboard'
import { LudumDare41Context } from 'ludumDare41/LudumDare41Context'
import { GenericManager } from 'ludumDare41/entities/GenericManager'

const effectFrames = [spriteCreator.create8_frameHRun(4, 6, 2)]

export class EffectManager extends GenericManager<Effect> {
  createAt(x, y) {
    let item = this._createAt(Effect, x, y)
    item.moveTo(x, y)
  }
}

export class Effect {
  context: LudumDare41Context
  container = new PIXI.Container()

  body: PIXI.Sprite
  frame = 0

  bx: number = 0
  by: number = 0
  isReadyToBeDestroyed: boolean

  init(cx: LudumDare41Context) {
    this.context = cx
    this.body = spriteCreator.create8_sprite(
      this.context.sge,
      'ase-512-8',
      4,
      6
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
    if (this.frame > 10) {
      this.body.texture.frame = effectFrames[0][1]
    }
    if (this.frame > 20) {
      this.isReadyToBeDestroyed = true
    }
  }

  moveTo(x, y) {
    this.bx = x
    this.by = y
    this.body.position.set(8 * x + 8 / 2, 8 * y + 8)
  }
}
