import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare41/util/spriteCreator'
import { KeyCodes } from 'engine/input/Keyboard'
import { LudumDare41Context } from 'ludumDare41/LudumDare41Context'

const ninjaFrames = [
  spriteCreator.create8_frameHRun(3, 1, 1),
  spriteCreator.create8_frameHRun(3, 2, 1),
]

export class CardManager {

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

  body: PIXI.Sprite

  rotLeft: PIXI.Sprite
  rotRight: PIXI.Sprite

  isReadyToBeDestroyed = false
  rotation = 0

  init(cx: LudumDare41Context) {
    this.context = cx

    this.body = spriteCreator.create_loose_sprite(this.context.sge, 'ase-512-8', 8 * 6, 8 * 1, 8 * 3, 8 * 3)
    this.body.anchor.set(0.5, 0.5)

    
    let alphaHidden = 0.1
    let alphaShown = 1
    this.rotLeft = spriteCreator.create8_sprite(this.context.sge, 'ase-512-8', 6, 4)
    this.rotLeft.anchor.set(0.5, 0.5)
    this.rotLeft.position.set(-8 + 1, -8 + 1)
    this.rotLeft.alpha = alphaHidden

    this.rotRight = spriteCreator.create8_sprite(this.context.sge, 'ase-512-8', 6, 5)
    this.rotRight.anchor.set(0.5, 0.5)
    this.rotRight.position.set(8 - 1, -8 + 1)
    this.rotRight.alpha = alphaHidden

    this.container.interactive = true
    this.container.buttonMode = true
    this.container.on('mouseover', () => {
      this.rotLeft.alpha = alphaShown      
      this.rotRight.alpha = alphaShown      
    })
    this.container.on('mouseout', () => {
      this.rotLeft.alpha = alphaHidden    
      this.rotRight.alpha = alphaHidden        
    })

    this.rotRight.buttonMode = true
    this.rotRight.interactive = true
    this.rotRight.on('mouseover', () => {
      this.rotRight.rotation = Math.PI/16      
      this.rotLeft.alpha = alphaShown    
      this.rotRight.alpha = alphaShown
    })
    this.rotRight.on('mouseout', () => {
      this.rotRight.rotation = 0
    })
    this.rotRight.on('mousedown', () => {
      this.rotRight.rotation = Math.PI/8      
    })
    this.rotRight.on('mouseup', () => {
      this.rotRight.rotation = Math.PI/16      
      this.rotation += Math.PI/2
    })

    this.rotLeft.buttonMode = true
    this.rotLeft.interactive = true
    this.rotLeft.on('mouseover', () => {
      this.rotLeft.rotation = -Math.PI/16  
      this.rotLeft.alpha = alphaShown    
      this.rotRight.alpha = alphaShown
    })
    this.rotLeft.on('mouseout', () => {
      this.rotLeft.rotation = 0
    })
    this.rotLeft.on('mousedown', () => {
      this.rotLeft.rotation = -Math.PI/8      
    })
    this.rotLeft.on('mouseup', () => {
      this.rotLeft.rotation = -Math.PI/16      
      this.rotation += -Math.PI/2
    })


    this.container.addChild(this.body)
    this.container.addChild(this.rotLeft)
    this.container.addChild(this.rotRight)
  }

  destroy() {
    if (this.isReadyToBeDestroyed) { return }
    this.isReadyToBeDestroyed = true

    // this.context.particles.emitNinjaParts(this.bounds.x, this.bounds.y - 4)
    // this.context.sounds.playNinjaDie()

  }

  update() {

    if (this.isReadyToBeDestroyed) { return }

    this.body.rotation =  this.rotation

  }

  moveTo(x, y) {
    this.container.position.set(x, y)
  }

}
