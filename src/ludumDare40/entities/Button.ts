import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare40/util/spriteCreator'
import { KeyCodes } from 'engine/input/Keyboard'

const turn = Math.PI * 2

import { hats } from './hats'
import { HatStack } from 'ludumDare40/entities/HatStack'
import { LudumDare40Context } from 'ludumDare40/LudumDare40Context'
import { BoundsDrawer } from 'ludumDare40/entities/BoundsDrawer'
import { Bounds } from './Bounds'

const buttonFramesRed = spriteCreator.create16_frameHRun(5, 6, 2)
const buttonFramesGreen = spriteCreator.create16_frameHRun(5, 8, 2)
const buttonFramesBlue = spriteCreator.create16_frameHRun(5, 10, 2)

export const ButtonWin = 0
export const ButtonMid = 2
export const ButtonBoss = 1

export class ButtonManager {
  context: LudumDare40Context

  items: ButtonObj[] = []

  init(context: LudumDare40Context) {
    this.context = context
  }

  createAt(x, y) {
    let item = new ButtonObj()
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
    let removed = _.remove(this.items, (c) => c.isReadyToBeDestroyed)

    if (removed.length > 0) {
      _.forEach(removed, (c) => {
        this.context.layerObjects.removeChild(c.container)
      })

      console.log(
        `cleaning up ${removed.length} items - ${this.items.length} left`
      )
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

export class ButtonObj {
  context: LudumDare40Context
  container = new PIXI.Container()

  body: PIXI.Sprite

  isPressed = false

  framesSincePressed = 0

  bounds = new Bounds()

  buttonType = 0

  isReadyToBeDestroyed = false

  init(cx: LudumDare40Context) {
    this.context = cx

    this.body = spriteCreator.create16_sprite(
      this.context.sge,
      'ase-512-16',
      4,
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

    this.context.sounds.playSmash()
  }
  update() {
    if (this.isReadyToBeDestroyed) {
      return
    }

    if (this.isPressed) {
      this.framesSincePressed++
      if (this.framesSincePressed > 180) {
        this.isPressed = false
        this.framesSincePressed = 0
      }
    }

    if (this.buttonType === ButtonBoss) {
      this.body.texture.frame = buttonFramesRed[this.isPressed ? 1 : 0]
    } else if (this.buttonType === ButtonWin) {
      this.body.texture.frame = buttonFramesGreen[this.isPressed ? 1 : 0]
    } else if (this.buttonType === ButtonMid) {
      this.body.texture.frame = buttonFramesBlue[this.isPressed ? 1 : 0]
    }

    this.bounds.update(this.context)

    this.container.position.set(this.bounds.x, this.bounds.y)
  }

  moveTo(x, y) {
    this.bounds.moveTo(x, y)
  }
}
