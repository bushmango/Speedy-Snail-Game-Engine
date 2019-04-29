import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'
import * as cameras from 'engine/camera/cameras'
import { actors } from './actors'

const meta = {
  name: 'smashedShipPart',
}

interface ISmashedPart {
  sprite: PIXI.Sprite
  vx: number
  vy: number
  vr: number
  elapsedSec: number
  isDead: boolean
}
let items: ISmashedPart[] = []
let deadItems: ISmashedPart[] = []

function create(sourceSprite: PIXI.Sprite) {
  // log.x('create', meta.name)
  let ctx = getContext()
  let num = 4
  let startX = sourceSprite.texture.frame.x
  let startY = sourceSprite.texture.frame.y
  let sizeX = sourceSprite.texture.frame.width / num
  let sizeY = sourceSprite.texture.frame.width / num
  for (let j = 0; j < num; j++) {
    for (let i = 0; i < num; i++) {
      let newFrame = new PIXI.Rectangle(
        startX + sizeX * i,
        startY + sizeY * j,
        sizeX,
        sizeY
      )

      let item: ISmashedPart = null
      if (deadItems.length > 0) {
        item = deadItems.pop()
        item.sprite.texture.frame = newFrame
      } else {
        item = {
          sprite: null,
          vx: 0,
          vy: 0,
          vr: 0,
          elapsedSec: 0,
          isDead: false,
        }
        item.sprite = ctx.createSprite('ship-001', newFrame, 0.5, 0.5, 1)
      }
      item.sprite.tint = sourceSprite.tint || 0xffffff
      item.sprite.visible = true
      item.vx = _.random(-50, 2)
      item.vy = _.random(-50, 50)
      item.vr = _.random(-Math.PI, Math.PI)
      item.elapsedSec = 0
      item.isDead = false

      let rot = sourceSprite.rotation

      let x = -(sizeX * num) / 2 + sizeX * i + sizeX / 2
      let y = -(sizeY * num) / 2 + sizeY * j + sizeY / 2

      let xp = x * Math.cos(rot) - y * Math.sin(rot)
      let yp = y * Math.cos(rot) + x * Math.sin(rot)

      item.sprite.x = sourceSprite.x + xp
      item.sprite.y = sourceSprite.y + yp

      item.sprite.rotation = sourceSprite.rotation
      ctx.layerParticles.addChild(item.sprite)

      items.push(item)
    }
  }

  return
}

function updateAll(elapsedTimeSec) {
  let ctx = getContext()

  _.forEach(items, (c) => {
    c.elapsedSec += elapsedTimeSec
    if (c.elapsedSec > 2) {
      c.isDead = true
    } else {
      c.sprite.x += elapsedTimeSec * c.vx
      c.sprite.y += elapsedTimeSec * c.vy
      c.sprite.rotation += elapsedTimeSec * c.vr
      c.sprite.scale.set(1 - c.elapsedSec / 2)
    }
  })

  removeDead()
}

function removeDead() {
  actors.removeDead(meta, items, (c) => {
    c.sprite.visible = false
    deadItems.push(c)
  })
}

export const smashedShipParts = {
  meta,
  create,
  updateAll,
}
