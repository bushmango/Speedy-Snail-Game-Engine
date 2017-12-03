import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare40/util/spriteCreator'
import { KeyCodes, Keyboard } from 'engine/input/Keyboard';

const turn = Math.PI * 2

import { hats } from './hats'
import { HatStack } from 'ludumDare40/entities/HatStack';
import { LudumDare40Context } from 'ludumDare40/LudumDare40Context';

const subPix = 32


export class Bounds {

  // State
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
  subX = 0 * subPix
  subY = 0 * subPix
  x = 0
  y = 0
  accelX = 0
  accelY = 0
  width = 8
  height = 8

  groundDrag = 0.97
  airDrag = 0.99

  maxVx = 64
  maxVy = 64

  boundsX1 = 0
  boundsX2 = 0
  boundsY1 = 0
  boundsY2 = 0

  facingRight = true

  moveTo(x, y) {
    this.subX = x * subPix
    this.subY = y * subPix
    this.recalcBounds()
  }

  recalcBounds() {
    this.x = Math.floor(this.subX / subPix)
    this.y = Math.floor(this.subY / subPix)
    this._setBounds(this.x - this.width / 2, this.y - this.height, this.x + this.width / 2, this.y)
  }

  _setBounds(x1, y1, x2, y2) {
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

  update(context: LudumDare40Context) {

    if (this.isFalling) {
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
    if (this.vy > this.maxVy) {
      this.vy = this.maxVy
    }
    if (this.vy < -this.maxVy) {
      this.vy = -this.maxVy
    }

    this.subY += this.vy
    this.subX += this.vx

    if(this.onGround) {
      if(this.groundDrag) {
        this.vx = this.vx * this.groundDrag
      }
    } else {
      if(this.airDrag) {
        this.vx = this.vx * this.airDrag
      }
    }

    // Check for contacts

    this.recalcBounds()


    let tm = context.tileMap

    let rs1 = tm.safeGetTileAtWorld(this.boundsX2, this.boundsY2 - 1)
    let rightContact1 = false
    let rightX = 0
    if (rs1) {
      if (!rs1.canMove) {
        rightContact1 = true
        rightX = rs1.bx * 16 * subPix - subPix * 4 - 1
        this.vx = 0
        this.subX = rightX
      }
    }
    let rs2 = tm.safeGetTileAtWorld(this.boundsX2, this.boundsY1 + 1)
    let rightContact2 = false
    rightX = 0
    if (rs2) {
      if (!rs2.canMove) {
        rightContact2 = true
        rightX = rs2.bx * 16 * subPix - subPix * 4 - 1
        this.vx = 0
        this.subX = rightX
      }
    }

    let ls1 = tm.safeGetTileAtWorld(this.boundsX1, this.boundsY2 - 1)
    let leftContact1 = false
    let leftX = 0
    if (ls1) {
      if (!ls1.canMove) {
        leftContact1 = true
        leftX = (ls1.bx + 1) * 16 * subPix + subPix * 4 + 1
        this.vx = 0
        this.subX = leftX
      }
    }

    let ls2 = tm.safeGetTileAtWorld(this.boundsX1, this.boundsY1 + 1)
    let leftContact2 = false
    leftX = 0
    if (ls2) {
      if (!ls2.canMove) {
        leftContact2 = true
        leftX = (ls2.bx + 1) * 16 * subPix + subPix * 4 + 1
        this.vx = 0
        this.subX = leftX
      }
    }

    if (rightContact1 || rightContact2 || leftContact1 || leftContact2) {
      this.recalcBounds()
    }


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

    let cs1 = tm.safeGetTileAtWorld(this.boundsX1, this.boundsY1 - 1)
    let ceilingContact1 = false
    let cielingY = 0
    if (cs1) {
      if (!cs1.canMove) {
        ceilingContact1 = true
        cielingY = cs1.by * 16
      }
    }
    let cs2 = tm.safeGetTileAtWorld(this.boundsX2, this.boundsY1 - 1)
    let ceilingContact2 = false
    if (cs2) {
      if (!cs2.canMove) {
        ceilingContact2 = true
        cielingY = cs2.by * 16
      }
    }

    if (this.isFalling) {
      if (groundContact1 || groundContact2) {
        this.subY = groundY * subPix
        this.setStateOnGround()
      }
    }
    if (this.isJumping) {
      if (ceilingContact1 || ceilingContact2) {
        //this.subY = groundY * 32
        this.setStateFalling()
        if (this.vy < 0) { this.vy = 0 }
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

    this.recalcBounds()

  }

}
