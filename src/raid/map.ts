import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { RaidContext } from './RaidContext'
import * as log from './log'
import { KeyCodes, Keyboard } from 'engine/input/Keyboard'

import * as spriteUtil from './spriteUtil'

const isActive = true

interface ITile {
  sprite: PIXI.Sprite
}
let tiles: ITile[] = []

var tilesData = [spriteUtil.frame16(4, 4, 2, 2)]

export function create(ctx: RaidContext) {
  log.x('create map')

  let baseTex = ctx.sge.getTexture('player1')

  var texs = _.map(tilesData, (c) => new PIXI.Texture(baseTex.baseTexture, c))
  var tex0 = texs[0]

  for (let j = 0; j < 10; j++) {
    for (let i = 0; i < 10; i++) {
      let item: ITile = {
        sprite: null,
      }
      let sprite = new PIXI.Sprite(tex0)
      sprite.anchor.set(0, 0)
      sprite.x = i * 32 * 4
      sprite.y = j * 32 * 4
      sprite.scale.set(4)
      ctx.layerMap.addChild(sprite)
      item.sprite = sprite
      tiles.push(item)
    }
  }
}

export function updateAll(ctx: RaidContext) {}
