import { getContext } from 'pacrpg/GameContext'

import * as log from '../../engine/log'
import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'
import * as stats from 'pacrpg/stats'

let item = {
  spriteBackground: null as PIXI.Sprite,
  spriteForground: null as PIXI.Sprite,

  spriteLevel: null as PIXI.Sprite,
  spriteLevelNum: null as PIXI.Sprite,
}

export function create() {
  let ctx = getContext()

  let baseTex = ctx.sge.getTexture('rpg-gui')
  let tex = new PIXI.Texture(
    baseTex.baseTexture,
    spriteUtil.frame16(6, 1, 5, 1)
  )

  let sprite = new PIXI.Sprite(tex)
  sprite.anchor.set(0, 0)
  sprite.scale.set(2)
  ctx.layerUi.addChild(sprite)
  item.spriteBackground = sprite

  tex = new PIXI.Texture(baseTex.baseTexture, spriteUtil.frame16(5, 1, 5, 1))
  sprite = new PIXI.Sprite(tex)
  sprite.anchor.set(0, 0)
  sprite.scale.set(2)
  ctx.layerUi.addChild(sprite)
  item.spriteForground = sprite

  tex = new PIXI.Texture(baseTex.baseTexture, spriteUtil.frame16(3, 1, 5, 1))
  sprite = new PIXI.Sprite(tex)
  sprite.anchor.set(0, 0)
  sprite.scale.set(2)
  ctx.layerUi.addChild(sprite)
  item.spriteLevel = sprite

  tex = new PIXI.Texture(baseTex.baseTexture, spriteUtil.frame16(4, 1, 1, 1))
  sprite = new PIXI.Sprite(tex)
  sprite.anchor.set(0, 0)
  sprite.scale.set(2)
  ctx.layerUi.addChild(sprite)
  item.spriteLevelNum = sprite

  //item.spriteForground.crop

  //item.anim.sprite = sprite
  //items.push(item)
}
export function update() {
  let ctx = getContext()
  let curStats = stats.getCurrentStats()
  let { width, height } = ctx.sge.getViewSize()

  item.spriteBackground.x = 50
  item.spriteBackground.y = height - 50

  item.spriteForground.x = 50
  item.spriteForground.y = height - 50

  item.spriteLevel.x = 220
  item.spriteLevel.y = height - 50

  item.spriteLevelNum.x = 390
  item.spriteLevelNum.y = height - 50

  let nextExp = stats.getNextExp()
  let percent = curStats.exp / nextExp
  if (percent < 0) {
    percent = 0
  }
  if (percent > 100) {
    percent = 100
  }

  item.spriteForground.texture.frame = spriteUtil.frame16(5, 1, 5 * percent, 1)

  let levelOffset = curStats.level - 1
  if (levelOffset > 9) {
    levelOffset = 9
  }
  item.spriteLevelNum.texture.frame = spriteUtil.frame16(
    4,
    1 + levelOffset,
    1,
    1
  )
}
