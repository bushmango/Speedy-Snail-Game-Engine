import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'
import * as cameras from 'engine/camera/cameras'
import * as smashedParts from './smashedParts'

import * as sounds from './../sounds/sounds'

interface IAsteroid {
  anim: anim.IAnim
  isDead: boolean
  data: IAsteroidData
  vr: number
}
let items: IAsteroid[] = []

export function getAll() {
  return items
}

interface IAsteroidData {
  frame: PIXI.Rectangle
  size: number
  splitInto?: IAsteroidData[]
}

let datas: IAsteroidData[] = []
let d: IAsteroidData = {
  frame: spriteUtil.frame32(7, 1),
  size: 1,
}
datas.push(d)
let splitB = (d = {
  frame: spriteUtil.frame32(7, 2),
  size: 1,
})
datas.push(d)
let splitA = (d = {
  frame: spriteUtil.frame32(7, 3),
  size: 1,
})
datas.push(d)
d = {
  frame: spriteUtil.frame32(8, 1, 2, 2),
  size: 2,
  splitInto: [splitA, splitB],
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
    vr: _.random(-Math.PI, Math.PI),
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

  let stats = ctx.stats.getCurrentStats()
  let asteroidSpeed = 0
  if (stats.speed > 0) {
    asteroidSpeed += stats.speed * 55
  } else {
    asteroidSpeed = 20
  }

  _.forEach(items, (c) => {
    anim.update(c.anim, elapsedTimeSec)
    c.anim.sprite.rotation += c.vr * elapsedTimeSec
    c.anim.sprite.x -= asteroidSpeed * elapsedTimeSec

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

    if (c.data.splitInto) {
      let ctx = getContext()
      let view = ctx.sge.getViewSize()

      _.forEach(c.data.splitInto, (d) => {
        let asteroid = create(d)
        asteroid.anim.sprite.x = c.anim.sprite.x + 32
        asteroid.anim.sprite.y = c.anim.sprite.y + _.random(-32, 32)
      })
    }
  }
}

let spawnTimer = 1
let spawnerEnabled = true
export function updateSpawner(elapsedTimeSec) {
  let ctx = getContext()
  let view = ctx.sge.getViewSize()
  let stats = ctx.stats.getCurrentStats()
  if (spawnerEnabled) {
    spawnTimer += elapsedTimeSec
    if (spawnTimer > 1 && stats.speed > 0) {
      let asteroid = create(_.sample(datas))
      asteroid.anim.sprite.x = view.width / 2
      asteroid.anim.sprite.y = _.random(0, view.height / 2)
      spawnTimer = 0
    }
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
