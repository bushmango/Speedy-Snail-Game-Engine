import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare41/util/spriteCreator'
import { KeyCodes } from 'engine/input/Keyboard'
import { LudumDare41Context } from 'ludumDare41/LudumDare41Context'

const ninjaFrames = [
  spriteCreator.create8_frameHRun(3, 1, 1),
  spriteCreator.create8_frameHRun(3, 2, 1),
  spriteCreator.create8_frameHRun(3, 3, 1),
]
const ninjaFramesDead = [
  spriteCreator.create8_frameHRun(3, 3 + 1, 1),
  spriteCreator.create8_frameHRun(3, 3 + 2, 1),
  spriteCreator.create8_frameHRun(3, 3 + 3, 1),
]
export class NinjaManager {

  context: LudumDare41Context

  items: Ninja[] = []

  init(context: LudumDare41Context) {
    this.context = context
  }

  createAt(x, y) {
    let item = new Ninja()
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
}

export class Ninja {

  context: LudumDare41Context
  container = new PIXI.Container()

  id: number = -1

  body: PIXI.Sprite
  frame = 0
  frameIdx = 0
  animationIndex = 0
  facingRight = false
  isBot = false
  isAlive = true
  isReadyToBeDestroyed = false
  bx: number = 0
  by: number = 0

  init(cx: LudumDare41Context) {
    this.context = cx

    this.body = spriteCreator.create8_sprite(this.context.sge, 'ase-512-8', 3, 1)
    this.body.anchor.set(0.5, 1)
    this.frameIdx = 0
    this.animationIndex = _.random(0, 1, false)
    this.facingRight = _.random(0, 1, false) === 0
    this.container.addChild(this.body)
  }

  destroy() {
    if (this.isReadyToBeDestroyed) { return }
    this.isReadyToBeDestroyed = true

    // this.context.particles.emitNinjaParts(this.bounds.x, this.bounds.y - 4)
    // this.context.sounds.playNinjaDie()

  }

  update() {

    if (this.isReadyToBeDestroyed) { return }

    this.frameIdx++
    let frameSource = ninjaFrames
    if (this.isAlive) {
      //console.log('ninja is alive', this.id, this.isAlive)
      frameSource = ninjaFrames
    } else {
      // console.log('ninja is dead', this.id, this.isAlive)
      frameSource = ninjaFramesDead
    }
    this.frameIdx = this.frameIdx % frameSource[this.animationIndex].length
    this.body.texture.frame = frameSource[this.animationIndex][this.frameIdx]

    let scale = 1
    this.body.scale.set(this.facingRight ? -scale : scale, scale)
  }

  moveTo(x, y) {

    if (x > this.bx) {
      this.facingRight = true
    } else if (x < this.bx) {
      this.facingRight = false
    }
    this.bx = x
    this.by = y
    this.body.position.set(8 * x + 8 / 2, 8 * y + 8)
  }

}
