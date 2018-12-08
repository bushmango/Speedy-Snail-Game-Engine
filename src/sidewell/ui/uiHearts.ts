import { getContext } from '../GameContext'
import { _ } from 'engine/importsEngine'

import * as log from '../../engine/log'
import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'
import * as stats from '../misc/stats'
import { cursorTo } from 'readline'

interface IHeartContainer {
  state: number
  sprite: PIXI.Sprite
  index: number
}

let item = {
  container: null as PIXI.Container,
  heartContainers: [] as IHeartContainer[],
  spritePulse: null as PIXI.Sprite,
  elapsedTimeSec: 0 as number,
}

let frameFull = spriteUtil.frame32(4, 4)
let frameHalf = spriteUtil.frame32(4, 5)
let frameEmpty = spriteUtil.frame32(4, 6)

export function create() {
  let ctx = getContext()
  item.container = new PIXI.Container()
  ctx.layerUi.addChild(item.container)

  let baseTex = ctx.sge.getTexture('player1')

  // Pulse sprite
  {
    let tex = new PIXI.Texture(baseTex.baseTexture, frameEmpty)
    item.spritePulse = new PIXI.Sprite(tex)
    item.spritePulse.anchor.set(0.5, 0.5)
    item.spritePulse.scale.set(2)
    ctx.layerUi.addChild(item.spritePulse)
  }

  for (let i = 0; i < 10; i++) {
    let tex = new PIXI.Texture(baseTex.baseTexture, frameEmpty)
    let sprite = new PIXI.Sprite(tex)
    sprite.anchor.set(0.5, 0.5)
    sprite.scale.set(2)
    ctx.layerUi.addChild(sprite)
    let heartContainer: IHeartContainer = {
      state: 0,
      sprite: sprite,
      index: i,
    }
    item.heartContainers.push(heartContainer)
  }

  // tex = new PIXI.Texture(baseTex.baseTexture, spriteUtil.frame16(5, 1, 5, 1))
  // sprite = new PIXI.Sprite(tex)
  // sprite.anchor.set(0, 0)
  // sprite.scale.set(2)
  // ctx.layerUi.addChild(sprite)
  // item.spriteForground = sprite

  // tex = new PIXI.Texture(baseTex.baseTexture, spriteUtil.frame16(3, 1, 5, 1))
  // sprite = new PIXI.Sprite(tex)
  // sprite.anchor.set(0, 0)
  // sprite.scale.set(2)
  // ctx.layerUi.addChild(sprite)
  // item.spriteLevel = sprite

  // tex = new PIXI.Texture(baseTex.baseTexture, spriteUtil.frame16(4, 1, 1, 1))
  // sprite = new PIXI.Sprite(tex)
  // sprite.anchor.set(0, 0)
  // sprite.scale.set(2)
  // ctx.layerUi.addChild(sprite)
  // item.spriteLevelNum = sprite

  //item.spriteForground.crop

  //item.anim.sprite = sprite
  //items.push(item)
}
export function update(elapsedTimeSec) {
  let ctx = getContext()
  let curStats = stats.getCurrentStats()

  let { width, height } = ctx.sge.getViewSize()

  let y = height - 30
  let x = 50

  let curIndex = -1

  item.elapsedTimeSec += elapsedTimeSec
  let pulseTime = 1.5

  // 0-1 always
  let adjustedElapsed =
    item.elapsedTimeSec -
    Math.floor(item.elapsedTimeSec / pulseTime) * pulseTime
  let pulse = adjustedElapsed / pulseTime

  let rot = Math.sin(item.elapsedTimeSec * 4) * Math.PI * 2 * 0.04

  item.spritePulse.visible = false
  _.forEach(item.heartContainers, (c) => {
    let frame = frameEmpty
    if ((c.index + 1) * 2 <= curStats.health) {
      frame = frameFull
      curIndex = c.index
      c.sprite.rotation = rot
    } else if ((c.index + 1) * 2 <= curStats.health + 1) {
      frame = frameHalf
      curIndex = c.index
      c.sprite.rotation = rot
    } else {
      c.sprite.rotation = 0
    }

    c.sprite.texture.frame = frame
    c.sprite.position.set(x + c.index * 50, y)

    if (curIndex === c.index) {
      item.spritePulse.visible = true
      item.spritePulse.texture.frame = c.sprite.texture.frame
      item.spritePulse.x = c.sprite.position.x
      item.spritePulse.y = c.sprite.position.y
    }
  })

  item.spritePulse.scale.set(pulse * 4)
  item.spritePulse.alpha = 1 - pulse

  // item.spriteBackground.x = 50
  // item.spriteBackground.y = height - 50

  // item.spriteForground.x = 50
  // item.spriteForground.y = height - 50

  // item.spriteLevel.x = 220
  // item.spriteLevel.y = height - 50

  // item.spriteLevelNum.x = 390
  // item.spriteLevelNum.y = height - 50

  // let nextExp = stats.getNextExp()
  // let percent = curStats.exp / nextExp
  // if (percent < 0) {
  //   percent = 0
  // }
  // if (percent > 100) {
  //   percent = 100
  // }

  // item.spriteForground.texture.frame = spriteUtil.frame16(5, 1, 5 * percent, 1)

  // let levelOffset = curStats.level - 1
  // if (levelOffset > 9) {
  //   levelOffset = 9
  // }
  // item.spriteLevelNum.texture.frame = spriteUtil.frame16(
  //   4,
  //   1 + levelOffset,
  //   1,
  //   1
  // )
}
