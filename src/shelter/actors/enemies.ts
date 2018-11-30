import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'
import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'

import * as stats from 'pacrpg/stats'

const isActive = true

interface IEnemyData {
  animDefault: anim.IAnimData
  animCollect: anim.IAnimData
  level: number
  exp: number
}

interface IEnemy {
  anim: anim.IAnim
  data: IEnemyData

  bx: number
  by: number
  x: number
  y: number

  isCollected: boolean
  isDead: boolean
}
let items: IEnemy[] = []

export function getAll() {
  return items
}

var data_cactus: IEnemyData = {
  level: 0,
  exp: 2,
  animDefault: {
    frames: spriteUtil.frame32runH(4, 1, 2),
    frameTime: 10 / 60,
    loop: true,
  },
  animCollect: {
    frames: spriteUtil.frame32runH(4, 3, 1),
    frameTime: 10 / 60,
  },
}
var data_bat: IEnemyData = {
  level: 1,
  exp: 4,
  animDefault: {
    frames: spriteUtil.frame32runH(6, 1, 2),
    frameTime: 10 / 60,
    loop: true,
  },
  animCollect: {
    frames: spriteUtil.frame32runH(6, 3, 1),
    frameTime: 10 / 60,
  },
}

var data_rat: IEnemyData = {
  level: 2,
  exp: 6,
  animDefault: {
    frames: spriteUtil.frame32runH(5, 1, 2),
    frameTime: 10 / 60,
    loop: true,
  },
  animCollect: {
    frames: spriteUtil.frame32runH(5, 3, 1),
    frameTime: 10 / 60,
  },
}

var data_goblin: IEnemyData = {
  level: 3,
  exp: 8,
  animDefault: {
    frames: spriteUtil.frame32runH(7, 1, 2),
    frameTime: 10 / 60,
    loop: true,
  },
  animCollect: {
    frames: spriteUtil.frame32runH(7, 3, 1),
    frameTime: 10 / 60,
  },
}

export function create(type: string) {
  let ctx = getContext()

  log.x('create enemy', type)

  let data = data_cactus
  switch (type) {
    case 'rat':
      data = data_rat
      break
    case 'bat':
      data = data_bat
      break
    case 'goblin':
      data = data_goblin
      break
  }

  let item: IEnemy = {
    anim: anim.create(),
    bx: 14,
    by: 18,
    x: 0,
    y: 0,
    isCollected: false,
    isDead: false,
    data,
  }

  let baseTex = ctx.sge.getTexture('player1')
  let tex = new PIXI.Texture(baseTex.baseTexture, data.animDefault.frames[0])

  let sprite = new PIXI.Sprite(tex)
  sprite.anchor.set(0.5, 0.5)
  sprite.y = 400
  sprite.x = 250
  sprite.scale.set(1)
  ctx.layerPlayer.addChild(sprite)
  item.anim.sprite = sprite
  items.push(item)

  moveToB(item, 14, 18)

  anim.playAnim(item.anim, data.animDefault)

  return item
}

export function moveToB(item: IEnemy, bx, by) {
  item.bx = bx
  item.by = by
  item.x = item.bx * 32 + 16
  item.y = item.by * 32 + 16
  item.anim.sprite.x = item.x
  item.anim.sprite.y = item.y
}

export function updateAll() {
  let ctx = getContext()
  let kb = ctx.sge.keyboard

  let elapsedTime = 1.0 / 60.0

  _.forEach(items, (c) => {
    if (c.isDead) {
      return
    }
    anim.update(c.anim, elapsedTime)
    if (c.isCollected) {
      if (c.anim.done) {
        // c.isDead = true // Kill after animation finished
      }
    }
  })
  removeDead()
}

export function removeDead() {
  let ctx = getContext()
  for (let i = 0; i < items.length; i++) {
    let c = items[i]
    //log.x('check', i)
    if (c.isDead) {
      // kill it!
      log.x('kill enemy', c)
      ctx.layerPlayer.removeChild(c.anim.sprite)
      items.splice(i, 1)
      i--
    }
  }
}

export function drawDebug(gfx: PIXI.Graphics) {
  _.forEach(items, (c) => {
    //gfx.beginFill(0x9966ff)
    gfx.lineStyle(1, 0xff3300, 0.5)
    gfx.drawCircle(c.x, c.y, 16)
    //gfx.endFill()
    //gfx.x = c.x
    //gfx.y = c.y
  })
}

export function doCollect(c: IEnemy) {
  if (c.isDead) {
    return
  }
  if (c.isCollected) {
    return
  }

  if (c.data.level < stats.getCurrentStats().level) {
    c.isCollected = true
    anim.playAnim(c.anim, c.data.animCollect)
    stats.addExp(5)
  } else {
    // die?
  }
}
