import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare41/util/spriteCreator'
import { LudumDare41Context } from 'ludumDare41/LudumDare41Context'

import * as tween from '../util/tween'

export class ModeBar {

  context: LudumDare41Context
  container = new PIXI.Container()
  textName: PIXI.extras.BitmapText
  body: PIXI.Sprite

  init(cx: LudumDare41Context) {
    this.context = cx

    this.body = spriteCreator.create_loose_sprite(this.context.sge, 'ase-512-8', 8 * 18, 8 * 1, 8 * 23, 8 * 2)
    this.body.anchor.set(0, 0)

    this.container.visible = false
    this.container.addChild(this.body)

    this.textName = new PIXI.extras.BitmapText(``, { font: '12px defaultfont', align: 'left' })
    this.textName.anchor = new PIXI.Point(0, 0)
    this.body.addChild(this.textName)
    this.textName.position.set(5, 5)
    this.textName.scale.set(0.66)

    this.container.scale.set(4)

  }

  frame = 0
  mode = ''

  updateAnim() {

    let len = 30
    let finalPos = (8 * 22 * 4 + 10)
    let pos = tween.bound(finalPos + 200, finalPos, this.frame / len, tween.quartInOut)
    this.container.position.set(0, pos)
    // let len = 30 + this.cardIdx * 2
    // let halfLen = len / 2
    // let finalPos = (8 * 3 + 2) * this.cardIdx
    this.frame++
  }

  update() {
    this.updateAnim()
  }

  setMode(mode: any, percent) {
    this.container.visible = true
    console.log('set mode', mode, percent)
    if (mode && mode !== this.mode) {
      this.mode = mode
      this.frame = 0
      this.textName.text = mode
      this.updateAnim()
    } else {
      if (percent) {
        this.textName.text = this.mode + ' ' + (Math.floor(10 - (percent * 10)) + 1) + ''
      }
    }

  }

}
