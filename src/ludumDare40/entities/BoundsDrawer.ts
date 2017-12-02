import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare40/util/spriteCreator'
import { LudumDare40Context } from 'ludumDare40/LudumDare40Context'

export interface IBounds {
  boundsX1: number,
  boundsX2: number,
  boundsY1: number,
  boundsY2: number,
}

export class BoundsDrawer {

  context: LudumDare40Context
  container = new PIXI.Container()


  spriteIdx = 0
  sprites: PIXI.Sprite[] = []

  init(cx: LudumDare40Context) {
    this.context = cx
  }

  clear() {
    this.spriteIdx = 0
    _.forEach(this.sprites, (c) => { c.visible = false })
  }
  draw(entity: IBounds) {
    let s = this.getSprite()
    s.x = entity.boundsX1
    s.y = entity.boundsY1
    s.width = entity.boundsX2 - entity.boundsX1
    s.height = entity.boundsY2 - entity.boundsY1
    s.visible = true
  }

  getSprite() {

    this.spriteIdx++
    if (this.spriteIdx > this.sprites.length) {
      let sprite = spriteCreator.create16_sprite(this.context.sge, 'ase-512-16', 0, 1)
      this.container.addChild(sprite)
      this.sprites.push(sprite)
      return sprite
    }
    return this.sprites[this.spriteIdx - 1]

  }



}
