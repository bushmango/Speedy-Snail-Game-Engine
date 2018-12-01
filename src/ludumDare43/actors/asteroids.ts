import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'
import * as cameras from 'engine/camera/cameras'
import * as smashedParts from './smashedParts'

interface IAsteroid {
  anim: anim.IAnim
  isDead: boolean
  data: IAsteroidData
}
let items: IAsteroid[] = []

export function getAll() {
  return items
}

interface IAsteroidData {
  frame: PIXI.Rectangle
  size: number
}

let datas: IAsteroidData[] = []
let d: IAsteroidData = {
  frame: spriteUtil.frame32(7, 1),
  size: 1,
}
datas.push(d)
d = {
  frame: spriteUtil.frame32(7, 2),
  size: 1,
}
datas.push(d)
d = {
  frame: spriteUtil.frame32(7, 3),
  size: 1,
}
datas.push(d)
d = {
  frame: spriteUtil.frame32(8, 1, 2, 2),
  size: 2,
}
datas.push(d)

export { datas }

export function create(data: IAsteroidData = datas[0]) {
  let ctx = getContext()

  log.x('create asteroid')
  let item: IAsteroid = {
    anim: anim.create(),
    isDead: false,
    data: data,
  }

  let sprite = ctx.createSprite('ship-001', data.frame, 0.5, 0.5, 1)
  item.anim.sprite = sprite

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

  ctx.layerPlayer.addChild(sprite)

  // anim.playAnim(item.anim, animRun)
  items.push(item)
  return item
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()
  let kb = ctx.sge.keyboard
  let mouse = ctx.sge.getMouse()

  updateSpawner(elapsedTimeSec)

  _.forEach(items, (c) => {
    anim.update(c.anim, elapsedTimeSec)
    c.anim.sprite.rotation += Math.PI * 2 * elapsedTimeSec * 0.25
    c.anim.sprite.x -= 50 * elapsedTimeSec

    if (c.anim.sprite.x < 0) {
      c.isDead = true
    }
  })

  // Testing
  const testMode = false
  if (testMode) {
    _.forEach(items, (c) => {
      smash(c)
    })
  }

  removeDead()
}

export function smash(c: IAsteroid) {
  if (!c.isDead) {
    smashedParts.create(c.anim.sprite)
    c.isDead = true
  }
}

let spawnTimer = 1
export function updateSpawner(elapsedTimeSec) {
  let ctx = getContext()
  let view = ctx.sge.getViewSize()

  spawnTimer += elapsedTimeSec
  if (spawnTimer > 1) {
    let asteroid = create(_.sample(datas))
    asteroid.anim.sprite.x = view.width / 2
    asteroid.anim.sprite.y = _.random(0, view.height / 2)
    spawnTimer = 0
  }
}

// todo genericize
export function removeDead() {
  let ctx = getContext()
  for (let i = 0; i < items.length; i++) {
    let c = items[i]
    if (c.isDead) {
      log.x('kill asteroid part', c)
      ctx.layerPlayer.removeChild(c.anim.sprite)
      items.splice(i, 1)
      i--
    }
  }
}
