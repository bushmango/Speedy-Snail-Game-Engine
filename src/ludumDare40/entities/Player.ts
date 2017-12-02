import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare40/util/spriteCreator'
import { KeyCodes } from 'engine/input/Keyboard';

const turn = Math.PI * 2

import { hats } from './hats'
import { HatStack } from 'ludumDare40/entities/HatStack';

export class Player {

  sge: SimpleGameEngine
  container = new PIXI.Container()

  body: PIXI.Sprite
  head: PIXI.Sprite

  hats = new HatStack()

  onGround = true
  isJumping = false
  isFalling = false
  isFastFalling = false
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

  facingRight = true

  init(_sge: SimpleGameEngine) {
    this.sge = _sge

    this.body = spriteCreator.create16_sprite(this.sge, 'ase-512-16', 1, 1)
    this.body.anchor.set(0.5, 0)
    this.head = spriteCreator.create16_sprite(this.sge, 'ase-512-16', 1, 2)
    this.head.anchor.set(0.5, 0)

    this.hats.init(_sge)

    this.container.addChild(this.body)
    this.container.addChild(this.head)
    this.container.addChild(this.hats.container)

  }

  moveTo(x, y) {
    this.subX = x * 32
    this.subY = y * 32
  }

  update() {

    // controls
    let kb = this.sge.keyboard

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
        this.isJumping = false
        this.isFalling = true
        this.isFastFalling = true
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
          this.isJumping = false
          this.isFalling = true
        }
      }
    } else if (this.isFalling) {

      if (kb.justReleased(KeyCodes.space)) {
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

    if (this.subY >= 0) {
      this.subY = 0
      this.onGround = true
      this.isFalling = false
      this.isFastFalling = false
      this.isJumping = false
      this.fallFrames = 0
      this.vy = 0
      this.accelY = 0
    }


    let x = Math.floor(this.subX / subPix)
    let y = Math.floor(this.subY / subPix)

    this.container.position.set(x, y)

    this.body.position.set(0, 0)
    this.head.position.set(0, 0 - 16)

    this.head.scale.set(this.facingRight ? 1 : -1, 1)

    this.hats.x = 0
    this.hats.y = -5
    this.hats.facingRight = this.facingRight
    this.hats.update()

  }


}
