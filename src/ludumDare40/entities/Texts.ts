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

export class TextsManager {
  context: LudumDare40Context

  items: TextObj[] = []

  init(context: LudumDare40Context) {
    this.context = context
  }

  createAt(x, y) {
    let item = new TextObj()
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
}

export class TextObj {
  context: LudumDare40Context
  container = new PIXI.Container()

  text: PIXI.extras.BitmapText

  isReadyToBeDestroyed = false

  init(cx: LudumDare40Context) {
    this.context = cx

    this.text = new PIXI.extras.BitmapText(`this is some text`, {
      font: '8px defaultfont',
      align: 'left',
    })
    this.text.anchor = new PIXI.Point(0, 0)
    this.container.addChild(this.text)
    this.text.position.set(-2.25, 0)
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
  }

  moveTo(x, y) {
    this.container.x = x
    this.container.y = y
  }
}
