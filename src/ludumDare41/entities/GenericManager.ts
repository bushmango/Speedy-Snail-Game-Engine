import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare41/util/spriteCreator'
import { KeyCodes } from 'engine/input/Keyboard'
import { LudumDare41Context } from 'ludumDare41/LudumDare41Context'

export interface IEntity {
  init: (context: LudumDare41Context) => void
  update: () => void
  container: any
  isReadyToBeDestroyed: boolean
}

export class GenericManager<T extends IEntity> {
  context: LudumDare41Context
  layer: PIXI.Container

  items: T[] = []

  init(context: LudumDare41Context, layer: PIXI.Container) {
    this.context = context
    this.layer = layer
  }

  _createAt(c: new () => T, x, y) {
    let item = new c()
    item.init(this.context)
    // item.moveTo(x, y)
    this.items.push(item)
    this.layer.addChild(item.container)
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
        this.layer.removeChild(c.container)
      })
      console.log(
        `cleaning up ${removed.length} items - ${this.items.length} left`
      )
    }
  }

  clear() {
    _.forEach(this.items, (c) => {
      c.isReadyToBeDestroyed = true
      this.layer.removeChild(c.container)
    })
    this.items = []
  }
}
