import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from 'engine/log'

import * as shipParts from './shipParts'
import * as anim from 'engine/anim/anim'
import * as spriteUtil from 'engine/anim/spriteUtil'

import * as rockets from './rockets'
import * as cameras from 'engine/camera/cameras'

interface ICoreSpawner {
  x: number
  y: number
  elapsedSec: number
  anim: anim.IAnim
  hasPayload: boolean
}
let item: ICoreSpawner = null

var animDefault: anim.IAnimData = {
  frames: [spriteUtil.frame32(5, 1, 2, 2), spriteUtil.frame32(5, 3, 2, 2)],
  frameTime: 10 / 60,
  loop: true,
}

export function create() {
  let ctx = getContext()

  log.x('create core ship part spawner')
  item = {
    x: -250,
    y: 200,
    elapsedSec: 0,
    anim: anim.create(),
    hasPayload: false,
  }

  let sprite = ctx.createSprite('ship-001', animDefault.frames[0], 0.5, 0.5, 1)
  item.anim.sprite = sprite
  ctx.layerAbove.addChild(sprite)

  anim.playAnim(item.anim, animDefault)

  //items.push(item)
  return item
}

export function launch() {
  if (!item.hasPayload) {
    let ctx = getContext()
    let cv = ctx.getCameraView()
    item.y = cv.cameraHeight / 2
    item.x = -250
    item.hasPayload = true

    // A bunch of lasers
    for (let i = 0; i < 10; i++) {
      let r = rockets.create('laser')

      r.isFriendlyGoatFire = true
      r.vx = 250 + 150
      r.anim.sprite.x = item.x
      r.anim.sprite.y = item.y

      r.anim.sprite.y += _.random(-75, 75)
      r.anim.sprite.x += _.random(-100, 150)
    }
  }
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()
  let kb = ctx.sge.keyboard
  let cv = ctx.getCameraView()

  //_.forEach(items, (c) => {
  let c = item
  c.elapsedSec += elapsedTimeSec

  c.x += 250 * elapsedTimeSec
  c.anim.sprite.x = c.x + 20
  c.anim.sprite.y = c.y

  let coreX = 32 * 3 + 10

  anim.update(item.anim, elapsedTimeSec)

  if (c.hasPayload && c.x > coreX - 16) {
    // drop core

    let sp = shipParts.create()
    sp.isFree = false
    sp.isCore = true // Most important piece!
    sp.anim.sprite.x = coreX
    sp.anim.sprite.y = cv.cameraHeight / 2
    shipParts.setShipGridCenter(sp)

    c.hasPayload = false
  }

  // if (c.elapsedSec > 1) {
  //   c.elapsedSec = 0

  //   let nextPart = _.sample(shipParts.spawnableDatas)

  //   let shipPart = shipParts.create(nextPart)
  //   shipPart.anim.sprite.x = c.x
  //   shipPart.anim.sprite.y = c.y + _.random(-5, 5, true)
  // }
  //})
}
