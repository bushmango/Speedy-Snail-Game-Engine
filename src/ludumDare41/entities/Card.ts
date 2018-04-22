import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare41/util/spriteCreator'
import { KeyCodes } from 'engine/input/Keyboard'
import { LudumDare41Context } from 'ludumDare41/LudumDare41Context'

import { ICard, nullCard } from './../server/CardInfo'

const cardBackFrames = [
  spriteCreator.create_cardBack_frame(0),
  spriteCreator.create_cardBack_frame(1),
  spriteCreator.create_cardBack_frame(2),
]

function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t
}

function lerpBounded(v0, v1, t) {
  if (t < 0) { t = 0 }
  if (t > 1) { t = 1 }
  return v0 * (1 - t) + v1 * t
}

export class CardManager {

  discardHand(): any {
    _.forEach(this.items, (c, cIdx) => {
      c.discardCard(cIdx)
    })
  }
  lockHand(): any {
    _.forEach(this.items, (c, cIdx) => {
      c.lockCard(cIdx)
    })
  }
  setHand(cards: ICard[]) {
    for (let i = 0; i < cards.length; i++) {
      let ci = cards[i]
      let c = this.items[i]
      c.setCard(i, ci)
    }
  }
  clearHand() {
    _.forEach(this.items, (c, cIdx) => {
      c.clearCard(cIdx)
    })
  }

  context: LudumDare41Context

  items: Card[] = []

  init(context: LudumDare41Context) {
    this.context = context
  }

  createAt(x, y) {
    let item = new Card()
    item.init(this.context)
    item.moveTo(x, y)
    this.items.push(item)
    this.context.layerCards.addChild(item.container)
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
        this.context.layerCards.removeChild(c.container)
      })
      console.log(`cleaning up ${removed.length} items - ${this.items.length} left`)
    }
  }

  clear() {
    _.forEach(this.items, (c) => {
      c.isReadyToBeDestroyed = true
      this.context.layerCards.removeChild(c.container)
    })
    this.items = []
  }
}

export class Card {

  context: LudumDare41Context
  container = new PIXI.Container()
  flipContainer = new PIXI.Container()

  textName: PIXI.extras.BitmapText
  textSpeed: PIXI.extras.BitmapText

  body: PIXI.Sprite
  card: PIXI.Sprite
  cardInfo: ICard
  isSelected: boolean

  rotLeft: PIXI.Sprite
  rotRight: PIXI.Sprite

  isReadyToBeDestroyed = false
  rotation = 0
  dir = 0

  init(cx: LudumDare41Context) {
    this.context = cx

    this.body = spriteCreator.create_loose_sprite(this.context.sge, 'ase-512-8', 8 * 6, 8 * 1, 8 * 3, 8 * 3)
    this.body.anchor.set(0.5, 0.5)

    this.card = spriteCreator.create_loose_sprite2(this.context.sge, 'ase-512-8', spriteCreator.create_card_frame(0))
    this.card.anchor.set(0.5, 0.5)

    let alphaHidden = 0.1
    let alphaShown = 1
    this.rotLeft = spriteCreator.create8_sprite(this.context.sge, 'ase-512-8', 6, 4)
    this.rotLeft.anchor.set(0.5, 0.5)
    this.rotLeft.position.set(-8 + 1, -8 * 2 + 1 - 2)
    this.rotLeft.alpha = alphaHidden

    this.rotRight = spriteCreator.create8_sprite(this.context.sge, 'ase-512-8', 6, 5)
    this.rotRight.anchor.set(0.5, 0.5)
    this.rotRight.position.set(8 - 1, -8 * 2 + 1 - 2)
    this.rotRight.alpha = alphaHidden

    this.container.interactive = true
    this.container.on('mouseover', () => {
      // this.rotLeft.alpha = alphaShown
      // this.rotRight.alpha = alphaShown
    })
    this.container.on('mouseout', () => {
      // this.rotLeft.alpha = alphaHidden
      // this.rotRight.alpha = alphaHidden
    })

    this.body.interactive = true
    this.body.buttonMode = true
    this.body.on('mousedown', () => {
      this.onClick()
    })

    this.rotRight.buttonMode = true
    this.rotRight.interactive = true
    this.rotRight.on('mouseover', () => {
      this.rotRight.rotation = Math.PI / 16
      // this.rotLeft.alpha = alphaShown
      this.rotRight.alpha = alphaShown
    })
    this.rotRight.on('mouseout', () => {
      this.rotRight.rotation = 0
      this.rotRight.alpha = alphaHidden
    })
    this.rotRight.on('mousedown', () => {
      this.rotRight.rotation = Math.PI / 8
    })
    this.rotRight.on('mouseup', () => {
      this.rotRight.rotation = Math.PI / 16
      this.setDir(this.dir + 1)
    })

    this.rotLeft.buttonMode = true
    this.rotLeft.interactive = true
    this.rotLeft.on('mouseover', () => {
      this.rotLeft.rotation = -Math.PI / 16
      this.rotLeft.alpha = alphaShown
      // this.rotRight.alpha = alphaShown
    })
    this.rotLeft.on('mouseout', () => {
      this.rotLeft.rotation = 0
      this.rotLeft.alpha = alphaHidden
    })
    this.rotLeft.on('mousedown', () => {
      this.rotLeft.rotation = -Math.PI / 8
    })
    this.rotLeft.on('mouseup', () => {
      this.rotLeft.rotation = -Math.PI / 16

      this.setDir(this.dir - 1)
    })

    this.container.addChild(this.flipContainer)
    this.flipContainer.addChild(this.body)
    this.flipContainer.addChild(this.card)
    this.container.addChild(this.rotLeft)
    this.container.addChild(this.rotRight)

    this.setDir(_.random(0, 4, false))

    this.textName = new PIXI.extras.BitmapText(`Null`, { font: '8px defaultfont', align: 'left' })
    this.textName.anchor = new PIXI.Point(0, 0)
    this.body.addChild(this.textName)
    this.textName.position.set(-11, 6)
    this.textName.scale.set(0.66)

    this.textSpeed = new PIXI.extras.BitmapText(`Fast`, { font: '8px defaultfont', align: 'left' })
    this.textSpeed.anchor = new PIXI.Point(0, 0)
    this.body.addChild(this.textSpeed)
    this.textSpeed.position.set(-8, -11)
    this.textSpeed.scale.set(0.50)

  }

  setDir(dir) {
    while (dir < 0) { dir += 4 }
    while (dir >= 4) { dir -= 4 }
    this.rotation = Math.PI / 2 * dir
    this.dir = dir
  }

  onClick = () => {
    if (!this.isSelected && this.cardInfo && this.cardInfo !== nullCard) {
      this.context.onChoseCard(this.cardInfo, this.dir)
      _.forEach(this.context.cards.items, c => {
        if (c === this) {
          c.body.texture.frame = cardBackFrames[0]
          c.isSelected = true
        } else {
          c.body.texture.frame = cardBackFrames[1]
          c.isSelected = false
        }
      })
    }
  }

  setCard(idx, cardInfo: ICard) {
    this.cardInfo = cardInfo
    this.flipToFront()
  }
  clearCard(idx) {
    // this.setCard(idx, null)
  }

  lockCard(idx) {
    if (!this.isSelected) {
      // this.body.texture.frame = cardBackFrames[2]
      this.flipToBack()
    }
  }
  discardCard(idx) {
    // this.body.texture.frame = cardBackFrames[2]
    this.flipToBack()
  }

  animMode = ''
  flipScale = 1
  flipFrame = 0
  backSideUp = true

  flipToBack() {
    if (this.animMode !== 'flip-to-back') {
      this.animMode = 'flip-to-back'
      this.flipFrame = 0
      this.updateAnim()
    }
  }
  flipToFront() {
    if (this.animMode !== 'flip-to-front') {
      this.animMode = 'flip-to-front'
      this.flipFrame = 0
      this.updateAnim()
    }
  }

  updateAnim() {

    let len = 30
    let halfLen = len / 2

    if (this.animMode === 'flip-to-back') {

      let frame = this.flipFrame
      if (frame < halfLen) {
        this.flipScale = lerpBounded(1, 0, frame / halfLen)
        this.backSideUp = false
      } else {
        frame -= halfLen
        this.flipScale = lerpBounded(0, 1, frame / halfLen)
        this.backSideUp = true
      }
      this.flipFrame++
    } else if (this.animMode === 'flip-to-front') {

      let frame = this.flipFrame

      if (frame === halfLen) {
        // Perfect time to rotate
        this.setDir(_.random(0, 4, false))
        // Set new info while hidden
        this.textName.text = this.cardInfo ? this.cardInfo.name : '?'
        this.isSelected = false
        this.card.texture.frame = spriteCreator.create_card_frame(this.cardInfo ? this.cardInfo.frame : 0)
        this.card.visible = true
        let speed = '-'
        if (this.cardInfo.type === 'move') {
          // speed = 'Slow'
        }
        speed = this.cardInfo.type
        this.textSpeed.text = speed
      }

      if (frame < halfLen) {
        this.flipScale = lerpBounded(1, 0, frame / halfLen)
        this.backSideUp = true
      } else {
        frame -= halfLen
        this.flipScale = lerpBounded(0, 1, frame / halfLen)
        this.backSideUp = false
      }
      this.flipFrame++
    } else {
      this.flipScale = 1
    }

    if (this.backSideUp) {
      this.body.texture.frame = cardBackFrames[2]
      this.card.visible = false
      this.textName.visible = false
      this.textSpeed.visible = false
    } else {
      this.body.texture.frame = cardBackFrames[this.isSelected ? 0 : 1]
      this.card.visible = true
      this.textName.visible = true
      this.textSpeed.visible = true
    }

    this.flipContainer.scale.set(this.flipScale, 1)
  }


  destroy() {
    if (this.isReadyToBeDestroyed) { return }
    this.isReadyToBeDestroyed = true

    // this.context.particles.emitNinjaParts(this.bounds.x, this.bounds.y - 4)
    // this.context.sounds.playNinjaDie()


  }

  update() {

    if (this.isReadyToBeDestroyed) { return }

    this.updateAnim()




    this.body.rotation = this.rotation
    this.card.rotation = this.rotation

  }

  moveTo(x, y) {
    this.container.position.set(x, y)
  }

}
