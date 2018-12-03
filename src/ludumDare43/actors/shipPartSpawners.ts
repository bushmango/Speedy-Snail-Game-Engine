import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from 'engine/log'

import * as shipParts from './shipParts'
import * as anim from 'engine/anim/anim'
import * as spriteUtil from 'engine/anim/spriteUtil'

import * as goats from './goats'
import * as zones from './zones'
import * as smoothMoves from 'engine/anim/smoothMover'

interface IShipPartSpawner {
  x: number
  y: number
  elapsedSec: number
  anim: anim.IAnim
  position: string
  smoothMover: smoothMoves.ISmoothMover
}
let items: IShipPartSpawner[] = []

var animDefault: anim.IAnimData = {
  frames: [spriteUtil.frame32(5, 1, 2, 2), spriteUtil.frame32(5, 3, 2, 2)],
  frameTime: 10 / 60,
  loop: true,
}

export function create() {
  let ctx = getContext()

  log.x('create ship part spawner')
  let item: IShipPartSpawner = {
    x: 0,
    y: 0,
    elapsedSec: 0,
    anim: anim.create(),
    position: 'top',
    smoothMover: smoothMoves.create(600, 200),
  }

  let sprite = ctx.createSprite('ship-001', animDefault.frames[0], 0.5, 0.5, 1)
  item.anim.sprite = sprite

  anim.playAnim(item.anim, animDefault)

  ctx.layerAbove.addChild(sprite)

  items.push(item)
  return item
}

let debrisSpawnTimer = 0
export function updateAll(elapsedTimeSec) {
  let ctx = getContext()
  let kb = ctx.sge.keyboard
  let cv = ctx.getCameraView()

  let goat = goats.getItem()

  let curZone = zones.getCurrentZone()

  // Debris spawns
  if (curZone.debrisPartsList) {
    debrisSpawnTimer += elapsedTimeSec
    if (debrisSpawnTimer > curZone.debrisSpawnRate) {
      debrisSpawnTimer = 0

      let nextPart = _.sample(curZone.debrisPartsListCalc)
      let shipPart = shipParts.create(nextPart)
      shipPart.anim.sprite.x = cv.cameraWidth

      let margin = 50
      shipPart.anim.sprite.y = _.random(margin, cv.cameraHeight - margin)
    }
  }

  _.forEach(items, (c) => {
    c.elapsedSec += elapsedTimeSec

    if (c.position === 'top') {
      if (curZone.topSupply) {
        smoothMoves.moveTo(c.smoothMover, cv.cameraWidth - 75, 75)
      } else {
        smoothMoves.moveTo(c.smoothMover, cv.cameraWidth / 2, -50)
      }
    }
    if (c.position === 'bottom') {
      if (curZone.bottomSupply) {
        smoothMoves.moveTo(
          c.smoothMover,
          cv.cameraWidth - 75,
          cv.cameraHeight - 50
        )
      } else {
        smoothMoves.moveTo(
          c.smoothMover,
          cv.cameraWidth / 2,
          cv.cameraHeight + 50
        )
      }
    }

    smoothMoves.update(c.smoothMover, c, elapsedTimeSec)

    c.anim.sprite.x = c.x + 20
    c.anim.sprite.y = c.y

    anim.update(c.anim, elapsedTimeSec)

    if (c.elapsedSec > curZone.supplySpawnRate) {
      c.elapsedSec = 0

      // if (!goat.isFree) {
      let nextPart = _.sample(curZone.supplyPartsListCalc)

      let shipPart = shipParts.create(nextPart)
      shipPart.anim.sprite.x = c.x + 16
      shipPart.anim.sprite.y = c.y + _.random(-5, 5, true)
      //  }
    }
  })
}
