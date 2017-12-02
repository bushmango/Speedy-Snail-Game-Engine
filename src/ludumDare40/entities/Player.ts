import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare40/util/spriteCreator'
import { KeyCodes } from 'engine/input/Keyboard';

const turn = Math.PI * 2

import { hats } from './hats'
import { HatStack } from 'ludumDare40/entities/HatStack';
import { LudumDare40Context } from 'ludumDare40/LudumDare40Context';

export class Player {

  context: LudumDare40Context
  container = new PIXI.Container()

  body: PIXI.Sprite
  head: PIXI.Sprite

  hats = new HatStack()

  onGround = false
  isJumping = false
  isFalling = true
  isFastFalling = true
  jumpFrames = 0
  fallFrames = 0

  isMovingRight = false
  isMovingLeft = false
  movingFrames = 0

  vx = 0
  vy = 0
  subX = 0 * 32
  subY = 0 * 32
  accelX = 0
  accelY = 0

  maxVx = 64
  maxVy = 64

  boundsX1 = 0
  boundsX2 = 0
  boundsY1 = 0
  boundsY2 = 0

  facingRight = true

  init(cx: LudumDare40Context) {
    this.context = cx

    this.body = spriteCreator.create16_sprite(this.context.sge, 'ase-512-16', 1, 1)
    this.body.anchor.set(0.5, 1)
    this.head = spriteCreator.create16_sprite(this.context.sge, 'ase-512-16', 1, 2)
    this.head.anchor.set(0.5, 1)

    this.hats.init(this.context.sge)

    this.container.addChild(this.body)
    this.container.addChild(this.head)
    this.container.addChild(this.hats.container)

  }

  moveTo(x, y) {
    this.subX = x * 32
    this.subY = y * 32
  }

  setBounds(x1, y1, x2, y2) {
    this.boundsX1 = x1
    this.boundsX2 = x2
    this.boundsY1 = y1
    this.boundsY2 = y2
  }


  setStateFalling() {
    this.onGround = false
    this.isJumping = false
    this.isFalling = true
    this.isFastFalling = true
  }
  setStateOnGround() {
    this.onGround = true
    this.isFalling = false
    this.isFastFalling = false
    this.isJumping = false
    this.fallFrames = 0
    this.vy = 0
    this.accelY = 0
  }

  update() {

    // controls
    let kb = this.context.sge.keyboard

    let subPix = 32

    if (kb.isPressed(KeyCodes.arrowRight) || kb.isPressed(KeyCodes.d)) {
      this.movingFrames++
      this.isMovingRight = true
      this.isMovingLeft = false
      this.facingRight = true
    } else if (kb.isPressed(KeyCodes.arrowLeft) || kb.isPressed(KeyCodes.a)) {
      this.movingFrames++
      this.isMovingLeft = true
      this.isMovingRight = false
      this.facingRight = false
    } else {
      this.movingFrames = 0
      this.isMovingLeft = false
      this.isMovingRight = false
    }

    if (this.isMovingLeft || this.isMovingRight) {

      let dir = this.isMovingLeft ? -1 : 1

      if (this.vx * dir < 0) {
        this.accelX = 8 * dir
      } else if (this.vx * dir < 16) {
        this.accelX = 4 * dir
      } else if (this.vx * dir < 32) {
        this.accelX = 2 * dir
      } else if (this.vx * dir < this.maxVx) {
        this.accelX = 1 * dir
      }

    } else {

      let xDrag = 1
      let speed = this.vx > 0 ? this.vx : -this.vx
      if (speed > 16) {
        xDrag = 4
      } else if (speed > 8) {
        xDrag = 2
      } else {
        xDrag = 1
      }
      if (!this.onGround) {
        xDrag = xDrag / 2
        if (xDrag < 1) {
          xDrag = 1
        }
      }

      if (this.vx > 0) {
        this.accelX = -xDrag
        if (this.accelX < -this.vx) {
          this.accelX = -this.vx
        }
      } else if (this.vx < 0) {
        this.accelX = xDrag
        if (this.accelX > -this.vx) {
          this.accelX = -this.vx
        }
      } else {
        this.accelX = 0
      }

    }

    if (this.onGround) {
      if (kb.justPressed(KeyCodes.space)) {
        this.isJumping = true
        this.onGround = false
        //this.vy = -8
        this.accelY = -8
        this.jumpFrames = 0
      }
    }
    else if (this.isJumping) {
      this.jumpFrames++

      if (kb.justReleased(KeyCodes.space)) {

        this.setStateFalling()

        //this.accelY = 8
        //this.vy = 8
      } else {
        if (this.jumpFrames < 4) {
          this.accelY = -32
        } else if (this.jumpFrames < 8) {
          this.accelY = -16
        } else if (this.jumpFrames < 10) {
          this.accelY = -2
        } else if (this.jumpFrames < 28) {
          this.accelY = -1
        } else {
          this.setStateFalling()
        }
      }
    } else if (this.isFalling) {

      if (kb.isUp(KeyCodes.space)) {
        this.isFastFalling = true
      }

      this.fallFrames++

      if (this.isFastFalling) {
        if (this.fallFrames < 8) {
          this.accelY = 8
        } else if (this.fallFrames < 16) {
          this.accelY = 14
        } else if (this.fallFrames < 32) {
          this.accelY = 16
        } else {
          this.accelY = 20
        }
      }
      else {
        if (this.fallFrames < 8) {
          this.accelY = 4
        } else if (this.fallFrames < 16) {
          this.accelY = 8
        } else if (this.fallFrames < 32) {
          this.accelY = 12
        } else {
          this.accelY = 16
        }
      }
    }

    this.vy += this.accelY
    this.vx += this.accelX

    if (this.vx > this.maxVx) {
      this.vx = this.maxVx
    }
    if (this.vx < -this.maxVx) {
      this.vx = -this.maxVx
    }
    if (this.vy > this.maxVx) {
      this.vy = this.maxVx
    }
    if (this.vy < -this.maxVy) {
      this.vy = -this.maxVy
    }

    this.subY += this.vy
    this.subX += this.vx

    // Check for contacts
    let tm = this.context.tileMap
    let gs1 = tm.safeGetTileAtWorld(this.boundsX1, this.boundsY2 + 1)
    let groundContact1 = false
    let groundY = 0
    if (gs1) {
      if (!gs1.canMove) {
        groundContact1 = true
        groundY = gs1.by * 16
      }
    }
    let gs2 = tm.safeGetTileAtWorld(this.boundsX2, this.boundsY2 + 1)
    let groundContact2 = false
    if (gs2) {
      if (!gs2.canMove) {
        groundContact2 = true
        groundY = gs1.by * 16
      }
    }

    if (this.isFalling) {
      if (groundContact1 || groundContact2) {
        this.subY = groundY * 32d
        this.setStateOnGround()
      }
    }

    if (this.onGround) {
      if (!groundContact1 && !groundContact2) {
        this.setStateFalling()
      }
    }

    let floor = 64 * 32 * 16  // Maximum lowest point
    if (this.subY >= floor) {
      this.subY = floor
      this.setStateOnGround()
    }


    let x = Math.floor(this.subX / subPix)
    let y = Math.floor(this.subY / subPix)

    this.setBounds(x - 4, y - 16, x + 4, y)

    this.container.position.set(x, y)

    this.body.position.set(0, 0)
    this.head.position.set(0, 0 - 16)

    this.head.scale.set(this.facingRight ? 1 : -1, 1)

    this.hats.x = 0
    this.hats.y = -16 - 8
    this.hats.facingRight = this.facingRight
    this.hats.update()

  }


}
