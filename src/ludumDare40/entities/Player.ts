import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare40/util/spriteCreator'
import { KeyCodes } from 'engine/input/Keyboard';

let hats = [
  {
    y: 2,
    x: 1,
  },
  {
    y: 2,
    x: 2,
  },
  {
    y: 2,
    x: 3,
  },
  {
    y: 2,
    x: 4,
  },
  {
    y: 2,
    x: 5,
  },
]

export class Player {

  sge: SimpleGameEngine
  container = new PIXI.Container

  body: PIXI.Sprite
  head: PIXI.Sprite

  hats: PIXI.Sprite[] = []


  onGround = true
  isJumping = false
  jumpFrames = 0

  isMovingRight = false
  isMovingLeft = false
  movingFrames = 0

  vx = 0
  vy = 0
  ySubPix = 0
  xSubPix = 0
  subX = 0 * 16
  subY = 0 * 16

  init(_sge: SimpleGameEngine) {
    this.sge = _sge

    this.body = spriteCreator.createSprite16(this.sge, 'ase-512-16', 1, 1)
    this.body.anchor.set(0.5, 0)
    this.head = spriteCreator.createSprite16(this.sge, 'ase-512-16', 1, 2)
    this.head.anchor.set(0.5, 0)

    this.container.addChild(this.body)
    this.container.addChild(this.head)

    this.container.position.set(100, 100)

    for (let i = 0; i < 10; i++) {
      this.addHat()
    }

  }
  update() {

    // controls
    let kb = this.sge.keyboard

    if (kb.isPressed(KeyCodes.arrowRight) || kb.isPressed(KeyCodes.d)) {
      this.movingFrames++
      this.isMovingRight = true
      this.isMovingLeft = false
      this.vx = 8
    } else if (kb.isPressed(KeyCodes.arrowLeft) || kb.isPressed(KeyCodes.a)) {
      this.movingFrames++
      this.isMovingLeft = true
      this.isMovingRight = false
      this.vx = -8
    } else {
      this.movingFrames = 0
      this.isMovingLeft = false
      this.isMovingRight = false
      this.vx = 0
    }

    if (this.onGround) {
      if (kb.justPressed(KeyCodes.space)) {
        this.isJumping = true
        this.onGround = false
        this.vy = -8
        this.jumpFrames = 0
      }
    }
    else if (this.isJumping) {
      this.jumpFrames++

      if (kb.justReleased(KeyCodes.space)) {
        this.isJumping = false
        this.vy = 8
      }
    }

    this.subY += this.vy
    this.subX += this.vx

    if (this.subY >= 0) {
      this.subY = 0
      this.onGround = true
      this.vy = 0
    }


    let x = Math.floor(this.subX / 16)
    let y = Math.floor(this.subY / 16)

    this.body.position.set(x, y)
    this.head.position.set(x, y - 16)
    _.forEach(this.hats, (c, cIdx) => {
      c.position.set(x + 1, y - 16 - 8 + 1 + 12 - 3 * cIdx)
    })
  }

  addHat() {

    let hatData = _.sample(hats)

    let hat = spriteCreator.createSprite16(this.sge, 'ase-512-16', hatData.y, hatData.x)
    hat.anchor.set(0.5, 0.5)
    this.hats.push(hat)
    this.container.addChild(hat)
  }

}
