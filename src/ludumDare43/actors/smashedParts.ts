import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'
import * as cameras from 'engine/camera/cameras'

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

export function create(sourceSprite: PIXI.Sprite) {
  let ctx = getContext()

  log.x('create asteroid')

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
      //let x = -(sizeX * num) / 2 + sizeX * i
      //let y = -(sizeY * num) / 2 + sizeY * j

      let x = -(sizeX * num) / 2 + sizeX * i + sizeX / 2
      let y = -(sizeY * num) / 2 + sizeY * j + sizeY / 2

      let xp = x * Math.cos(rot) - y * Math.sin(rot)
      let yp = y * Math.cos(rot) + x * Math.sin(rot)

      item.sprite.x = sourceSprite.x + xp
      item.sprite.y = sourceSprite.y + yp

      //x' = x cos f - y sin f
      //y' = y cos f + x sin f

      item.sprite.rotation = sourceSprite.rotation
      ctx.layerParticles.addChild(item.sprite)

      // anim.playAnim(item.anim, animRun)
      items.push(item)
    }
  }

  // sprite.interactive = true
  // sprite.buttonMode = true
  // sprite.on('mouseover', () => {
  //   if (item.isFree) {
  //     sprite.tint = 0xcccccccc
  //     tractoredPart = item
  //   }
  // })
  // sprite.on('mouseout', () => {
  //   if (item.isFree) {
  //     sprite.tint = 0xffffffff
  //   }
  // })

  return
}

export function updateAll(elapsedTimeSec) {
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

// todo genericize
export function removeDead() {
  let ctx = getContext()
  for (let i = 0; i < items.length; i++) {
    let c = items[i]
    if (c.isDead) {
      log.x('kill smashed part', c)
      //ctx.layerParticles.removeChild(c.sprite)
      c.sprite.visible = false
      deadItems.push(c)
      items.splice(i, 1)
      i--
    }
  }
}
