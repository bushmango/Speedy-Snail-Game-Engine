import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from 'engine/log'
import * as spriteUtil from 'engine/anim/spriteUtil'
import * as anim from 'engine/anim/anim'

interface IDebris {
  anim: anim.IAnim
  vx: number
  vy: number
  lifeLeft: number
  isDead: boolean
  elapsedEjectTime: number
}
let items: IDebris[] = []
export function getAll() {
  return items
}
var animSnail: anim.IAnimData = {
  frames: [spriteUtil.frame32(12, 3)],
  frameTime: 10 / 60,
}
var animDefault = animSnail

export { animSnail }

export function create() {
  let ctx = getContext()

  log.x('create goal piece')
  let item: IDebris = {
    anim: anim.create(),
    vx: _.random(-150, -50),
    vy: _.random(-50, 50),
    lifeLeft: 15,
    isDead: false,
    elapsedEjectTime: 0,
  }

  item.anim.sprite = ctx.createSprite(
    'ship-001',
    animDefault.frames[0],
    0.5,
    0.5,
    1
  )
  item.anim.sprite.rotation = _.random(0, Math.PI * 2)
  ctx.layerAbove.addChild(item.anim.sprite)
  anim.playAnim(item.anim, animDefault)
  items.push(item)

  return item
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()
  let kb = ctx.sge.keyboard

  _.forEach(items, (c) => {
    c.lifeLeft -= elapsedTimeSec
    if (c.lifeLeft < 0) {
      c.isDead = true
    }

    let maxEjectTime = 2
    if (c.elapsedEjectTime < maxEjectTime) {
      c.elapsedEjectTime += elapsedTimeSec
      let p = c.elapsedEjectTime / maxEjectTime
      c.anim.sprite.scale.set(Math.sin(p * Math.PI) * 3 + 0.25)
    } else {
      c.anim.sprite.scale.set(0.25)
    }

    anim.update(c.anim, elapsedTimeSec)
    c.anim.sprite.rotation += Math.PI * elapsedTimeSec
    c.anim.sprite.x += c.vx * elapsedTimeSec
    c.anim.sprite.y += c.vy * elapsedTimeSec
  })

  removeDead()
}

// todo genericize
export function removeDead() {
  let ctx = getContext()
  for (let i = 0; i < items.length; i++) {
    let c = items[i]
    if (c.isDead) {
      log.x('kill debris part', c)
      ctx.layerAbove.removeChild(c.anim.sprite)
      items.splice(i, 1)
      i--
    }
  }
}
