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

export class AchievementsManager {

  context: LudumDare40Context

  items: Achievement[] = []

  init(context: LudumDare40Context) {
    this.context = context
  }

  createAt(x, y) {
    let item = new Achievement()
    item.init(this.context)
    item.moveTo(x, y)
    this.items.push(item)
    this.context.layerObjects.addChild(item.container)
    return item
  }

  addAchievement(key) {
    if (!this.keys[key]) {
      let { x, y } = this.context.player.bounds

      let encourage = ['Good job!', 'Go you!', 'You are the best!', 'Wow!',  'Have a free hat!']

      x += _.random(-20, 20)
      y += _.random(-20, 20)
      let a = this.createAt(x, y)
      a.text.text = 'Achievement! ' + key + ' ' + _.sample(encourage)
      this.keys[key] = key
      let hat = this.context.hats.createAt(x, y - 48)
      hat.bounds.vx = _.random(-64, 64)
      //this.context.player.addFollower()
    }
  }
  keys: any = {}

  update(context: LudumDare40Context) {

    // Check for achievements
    let { x, y } = context.player.bounds
    let kb = context.sge.keyboard
    if (kb.justPressed(KeyCodes.d) || kb.justPressed(KeyCodes.arrowRight)) {
      this.addAchievement('Moved!')
    }
    if (kb.justPressed(KeyCodes.w) || kb.justPressed(KeyCodes.arrowUp)) {
      this.addAchievement('You can jump!')
    }
    if (kb.justPressed(KeyCodes.a) || kb.justPressed(KeyCodes.arrowLeft)) {
      this.addAchievement('Moved the wrong way!')
    }
    if (kb.justPressed(KeyCodes.s) || kb.justPressed(KeyCodes.arrowDown)) {
      this.addAchievement('Tried to duck, but could not!')
    }

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
    this.keys = {}
    _.forEach(this.items, (c) => {
      c.isReadyToBeDestroyed = true
      this.context.layerObjects.removeChild(c.container)
    })
    this.items = []
  }

}

export class Achievement {

  context: LudumDare40Context
  container = new PIXI.Container()

  text: PIXI.extras.BitmapText

  isReadyToBeDestroyed = false

  init(cx: LudumDare40Context) {
    this.context = cx

    this.text = new PIXI.extras.BitmapText(`this is some text`, { font: '8px defaultfont', align: 'left' })
    this.text.anchor = new PIXI.Point(0, 0)
    this.container.addChild(this.text)
    this.text.position.set(-2.25, 0)

  }

  destroy() {
    if (this.isReadyToBeDestroyed) { return }
    this.isReadyToBeDestroyed = true
  }
  update() {

    if (this.isReadyToBeDestroyed) { return }



  }

  moveTo(x, y) {
    this.container.x = x
    this.container.y = y
  }

}
