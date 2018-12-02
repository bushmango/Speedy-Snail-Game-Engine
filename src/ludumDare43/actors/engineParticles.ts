import { _ } from 'engine/importsEngine'

import { ParticleEmitter } from 'engine/particles/ParticleEmitter'
import { getContext } from '../GameContext'

import * as spriteUtil from 'engine/anim/spriteUtil'
import * as shipParts from './shipParts'
import * as log from 'engine/log'

let particleEmitter1: ParticleEmitter = null
let smokeTimeLeft = 0
let checkDestroyTimeLeft = 0

export function create() {
  let ctx = getContext()
  let particles1 = spriteUtil.frame32runH(14, 1, 3)

  particleEmitter1 = new ParticleEmitter()
  particleEmitter1.init2(ctx.sge, 'ship-001', particles1)
  ctx.layerSmoke.addChild(particleEmitter1.container)
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()

  // if (_.random(true) < 0.1) {
  //   // particleEmitter1.emit(150, 150)
  //   emit(250, 50)
  // }

  smokeTimeLeft -= elapsedTimeSec
  checkDestroyTimeLeft -= elapsedTimeSec

  if (smokeTimeLeft < 0) {
    _.forEach(shipParts.getAll(), (c: shipParts.IShipPart) => {
      if (c.isDead) {
        return
      }
      if ((c.isAttached || c.isJettisoned) && c.data.enginePower > 0) {
        if (c.data.enginePower > 1) {
          emit(c.anim.sprite.x - 10, c.anim.sprite.y - 8)
          emit(c.anim.sprite.x - 10, c.anim.sprite.y + 8)
        } else {
          emit(c.anim.sprite.x - 10, c.anim.sprite.y)
        }
      } else if (c.isJettisoned) {
        emit(c.anim.sprite.x - 10, c.anim.sprite.y)
      }
    })
    smokeTimeLeft = _.random(0.01, 0.3)
  }

  if (checkDestroyTimeLeft < 0) {
    checkDestroyTimeLeft = 1
    _.forEach(shipParts.getAll(), (c: shipParts.IShipPart) => {
      if (!c.isDead && !c.isFree && c.data.enginePower > 0) {
        // Get space behind
        let sg = shipParts.safeGetShipGrid(c.bx - 1, c.by)
        if (sg) {
          // Heh, bad idea
          shipParts.destroyFixedPiece(sg)
        }
      }
    })
  }

  particleEmitter1.update(elapsedTimeSec)

  //
}

export function emit(x, y) {
  particleEmitter1.emit(x, y, null, (p) => {
    p.vx = -1
    p.vy = _.random(-0.2, 0.2)
    p.ax = 0
    p.scale1 = 0.25
    p.scale2 = 1.5

    // log.x('setup p', p)
  })
}
