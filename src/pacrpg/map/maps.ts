import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'
import { KeyCodes, Keyboard } from 'engine/input/Keyboard'

import * as spriteUtil from '../../engine/anim/spriteUtil'

const isActive = true

export interface IMap {
  width: number
  height: number
  tiles: ITile[]
  layer: PIXI.Container
}
export interface ITile {
  sprite: PIXI.Sprite
}
let maps: IMap[] = []

var tilesData = [
  spriteUtil.frame32(1, 1),
  spriteUtil.frame32(1, 2),
  spriteUtil.frame32(1, 3),
]

export function create(layerMap: PIXI.Container) {
  log.x('create map')

  let ctx = getContext()
  let map = {
    width: 0,
    height: 0,
    tiles: [],
    layer: layerMap,
  }

  maps.push(map)

  // resize(map, 5, 5)

  return map
}

export function resize(map: IMap, width, height) {
  let ctx = getContext()
  let baseTex = ctx.sge.getTexture('tiles')

  // TODO: destroy existing

  map.width = width
  map.height = height
  map.tiles = []
  // Remove all children?
  map.layer.removeChildren()

  // TODO better tiles management
  var texs = _.map(tilesData, (c) => new PIXI.Texture(baseTex.baseTexture, c))
  var tex0 = texs[0]

  for (let j = 0; j < map.height; j++) {
    for (let i = 0; i < map.width; i++) {
      let item: ITile = {
        sprite: null,
      }
      let sprite = new PIXI.Sprite(tex0)
      sprite.anchor.set(0, 0)
      sprite.x = i * 32
      sprite.y = j * 32
      // sprite.scale.set(4)
      map.layer.addChild(sprite)
      item.sprite = sprite
      map.tiles.push(item)
    }
  }
}

export function setTile(map: IMap, x, y, tileData) {
  if (!tileData.tex) {
    let ctx = getContext()
    let baseTex = ctx.sge.getTexture('tiles')
    tileData.tex = new PIXI.Texture(baseTex.baseTexture, tileData.rect)
  }

  let tile = map.tiles[y * map.width + x]
  tile.sprite.texture = tileData.tex
}

export function updateAll() {
  _.forEach(maps, (c) => {})
}
