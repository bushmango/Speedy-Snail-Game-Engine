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

export class BulletManager extends GenericManager<Bullet> {
  createAt(x, y, dir, idx) {
    let item = this._createAt(Bullet, x, y)
    item.moveTo(x, y)
    item.dir = dir
    item.idx = idx
    return item
  }
}

export class Bullet {
  context: LudumDare41Context
  container = new PIXI.Container()

  id = -1
  body: PIXI.Sprite
  frame = 0
  dir = 0
  rotation = 0
  idx = 0

  bx: number = 0
  by: number = 0
  isReadyToBeDestroyed: boolean

  init(cx: LudumDare41Context) {
    this.context = cx
    this.body = spriteCreator.create8_sprite(
      this.context.sge,
      'ase-512-8',
      1,
      8
    )
    this.body.anchor.set(0.5, 0.5)
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

    let fx = Math.floor(this.frame / 10)

    if (this.idx === 0 || this.idx === 1) {
      if (fx % 2 === 0) {
        this.rotation = Math.PI / 4
      } else {
        this.rotation = 0
      }
    } else {
      this.rotation = (this.dir / 4) * Math.PI * 2 + Math.PI / 2
    }
    let scale = 1
    if (this.idx === 3) {
      if (fx % 2 === 0) {
        scale = -1
      } else {
      }
    }

    this.body.rotation = this.rotation
    this.body.scale.set(1, scale)
    if (this.idx) {
      this.body.texture.frame = bulletFrames[this.idx][0]
    }

    // this.frame++
    // if (this.frame > 10) {
    //   this.body.texture.frame = effectFrames[0][1]
    // }
    // if (this.frame > 20) {
    //   this.isReadyToBeDestroyed = true
    // }
  }

  moveTo(x, y) {
    this.bx = x
    this.by = y
    this.body.position.set(8 * x + 8 / 2, 8 * y + 8 / 2)
  }
}
