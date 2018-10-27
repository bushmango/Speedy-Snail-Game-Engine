import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare41/util/spriteCreator'
import { KeyCodes } from 'engine/input/Keyboard'
import { LudumDare41Context } from 'ludumDare41/LudumDare41Context'

import { ICard, nullCard } from './../server/CardInfo'

import { lerpBounded } from '../util/tween'

const cardBackFrames = [
  spriteCreator.create_cardBack_frame(0),
  spriteCreator.create_cardBack_frame(1),
  spriteCreator.create_cardBack_frame(2),
]

export class CardManager {

  discardHand(): any {
    _.forEach(this.items, (c, cIdx) => {
      c.discardCard()
    })
  }
  lockHand(): any {
    _.forEach(this.items, (c, cIdx) => {
      c.lockCard()
    })
  }
  setHand(cards: ICard[]) {
    for (let i = 0; i < cards.length; i++) {
      let ci = cards[i]
      let c = this.items[i]
      c.setCard(ci)
    }
  }
  clearHand() {
    _.forEach(this.items, (c, cIdx) => {
      c.clearCard()
    })
  }

  context: LudumDare41Context

  items: Card[] = []

  init(context: LudumDare41Context) {
    this.context = context
  }

  createAt(x, y) {
    let item = new Card()
    item.init(this.context, this.items.length)
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

  init(cx: LudumDare41Context, idx) {
    this.context = cx
    this.cardIdx = idx

    this.body = spriteCreator.create_loose_sprite(this.context.sge, 'ase-512-8', 8 * 6, 8 * 1, 8 * 3, 8 * 3)
    this.body.anchor.set(0.5, 0.5)

    this.card = spriteCreator.create_loose_sprite2(this.context.sge, 'ase-512-8', spriteCreator.create_card_frame(0))
    this.card.anchor.set(0.5, 0.5)

    let alphaHidden = 0.1
    let alphaShown = 1
    this.rotLeft = spriteCreator.create8_sprite(this.context.sge, 'ase-512-8', 6, 4)
    this.rotLeft.anchor.set(0.5, 0.5)
    this.rotLeft.position.set(-8 + 1 + (idx * (8 * 3 + 2)), -8 * 2 + 1 - 2)
    this.rotLeft.alpha = alphaHidden

    this.rotRight = spriteCreator.create8_sprite(this.context.sge, 'ase-512-8', 6, 5)
    this.rotRight.anchor.set(0.5, 0.5)
    this.rotRight.position.set(8 - 1 + (idx * (8 * 3 + 2)), -8 * 2 + 1 - 2)
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

  setCard(cardInfo: ICard) {
    this.cardInfo = cardInfo
    this.slideIn()
    this.flipToFront()
  }
  clearCard() {
    // this.setCard(idx, null)
  }

  lockCard() {
    if (!this.isSelected) {
      // this.body.texture.frame = cardBackFrames[2]
      this.flipToBack()
    }
  }
  discardCard() {
    // this.body.texture.frame = cardBackFrames[2]
    this.flipToBack()
    this.slideOut()
  }

  cardIdx = 0
  animModeflip = ''
  animModeSlide = ''
  flipScale = 1
  flipFrame = 0
  slideFrame = 0
  backSideUp = true

  flipToBack() {
    if (this.animModeflip !== 'flip-to-back') {
      this.animModeflip = 'flip-to-back'
      this.flipFrame = 0
      this.updateAnim()
    }
  }
  flipToFront() {
    if (this.animModeflip !== 'flip-to-front') {
      this.animModeflip = 'flip-to-front'
      this.flipFrame = 0
      this.updateAnim()
    }
  }
  slideIn() {
    if (this.animModeSlide !== 'slide-in') {
      this.animModeSlide = 'slide-in'
      this.slideFrame = 0
      this.updateAnim()
    }
  }
  slideOut() {
    if (this.animModeSlide !== 'slide-out') {
      this.animModeSlide = 'slide-out'
      this.slideFrame = 0
      this.updateAnim()
    }
  }

  slideX = 0
  slideY = 0

  updateAnim() {

    let len = 20 + this.cardIdx * 2
    let halfLen = len / 2
    let finalPos = (8 * 3 + 2) * this.cardIdx
    if (this.animModeSlide === 'slide-in') {
      let frame = this.slideFrame
      this.slideX = lerpBounded(0, finalPos, frame / len)
    } else if (this.animModeSlide === 'slide-out') {
      let frame = this.slideFrame
      this.slideX = lerpBounded(finalPos, 0, frame / len)
    }

    if (this.animModeflip === 'flip-to-back') {
      let frame = this.flipFrame
      if (frame < halfLen) {
        this.flipScale = lerpBounded(1, 0, frame / halfLen)
        this.backSideUp = false
      } else {
        frame -= halfLen
        this.flipScale = lerpBounded(0, 1, frame / halfLen)
        this.backSideUp = true
      }
    } else if (this.animModeflip === 'flip-to-front') {
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
    } else {
      this.flipScale = 1
    }

    this.flipFrame++
    this.slideFrame++

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
    this.flipContainer.position.set(this.slideX, this.flipContainer.position.y)
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
