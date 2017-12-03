import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare40/util/spriteCreator'
import { KeyCodes, Keyboard } from 'engine/input/Keyboard';

const turn = Math.PI * 2

import { hats } from './hats'
import { HatStack } from 'ludumDare40/entities/HatStack';
import { LudumDare40Context } from 'ludumDare40/LudumDare40Context';
import { Bounds } from 'ludumDare40/entities/Bounds';

const subPix = 32


export class PlayerController {
  
    update(kb: Keyboard, bounds: Bounds) {
  
      if (kb.isPressed(KeyCodes.arrowRight) || kb.isPressed(KeyCodes.d)) {
        bounds.movingFrames++
        bounds.isMovingRight = true
        bounds.isMovingLeft = false
        bounds.facingRight = true
      } else if (kb.isPressed(KeyCodes.arrowLeft) || kb.isPressed(KeyCodes.a)) {
        bounds.movingFrames++
        bounds.isMovingLeft = true
        bounds.isMovingRight = false
        bounds.facingRight = false
      } else {
        bounds.movingFrames = 0
        bounds.isMovingLeft = false
        bounds.isMovingRight = false
      }
  
      if (bounds.isMovingLeft || bounds.isMovingRight) {
  
        let dir = bounds.isMovingLeft ? -1 : 1
  
        if (bounds.vx * dir < 0) {
          bounds.accelX = 8 * dir
        } else if (bounds.vx * dir < 16) {
          bounds.accelX = 4 * dir
        } else if (bounds.vx * dir < 32) {
          bounds.accelX = 2 * dir
        } else if (bounds.vx * dir < bounds.maxVx) {
          bounds.accelX = 1 * dir
        }
  
      } else {
  
        let xDrag = 1
        let speed = bounds.vx > 0 ? bounds.vx : -bounds.vx
        if (speed > 16) {
          xDrag = 4
        } else if (speed > 8) {
          xDrag = 2
        } else {
          xDrag = 1
        }
        if (!bounds.onGround) {
          xDrag = xDrag / 2
          if (xDrag < 1) {
            xDrag = 1
          }
        }
  
        if (bounds.vx > 0) {
          bounds.accelX = -xDrag
          if (bounds.accelX < -bounds.vx) {
            bounds.accelX = -bounds.vx
          }
        } else if (bounds.vx < 0) {
          bounds.accelX = xDrag
          if (bounds.accelX > -bounds.vx) {
            bounds.accelX = -bounds.vx
          }
        } else {
          bounds.accelX = 0
        }
  
      }
  
      if (bounds.onGround) {
        if (kb.justPressed(KeyCodes.w) || kb.justPressed(KeyCodes.arrowUp)) {
          bounds.isJumping = true
          bounds.onGround = false
          //this.vy = -8
          bounds.accelY = -8
          bounds.jumpFrames = 0
        }
      }
      else if (bounds.isJumping) {
        bounds.jumpFrames++
  
        if (kb.justReleased(KeyCodes.w) || kb.justReleased(KeyCodes.arrowUp)) {
  
          bounds.setStateFalling()
  
          //this.accelY = 8
          //this.vy = 8
        } else {
          if (bounds.jumpFrames < 4) {
            bounds.accelY = -32
          } else if (bounds.jumpFrames < 8) {
            bounds.accelY = -16
          } else if (bounds.jumpFrames < 10) {
            bounds.accelY = -2
          } else if (bounds.jumpFrames < 28) {
            bounds.accelY = -1
          } else {
            bounds.setStateFalling()
          }
        }
      } else if (bounds.isFalling) {
  
        if (kb.isUp(KeyCodes.space)) {
          bounds.isFastFalling = true
        }
      }
  
    }
  }