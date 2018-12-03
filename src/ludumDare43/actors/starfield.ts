import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'

import { GlowFilter } from 'pixi-filters'
import * as utils from './utils'

enum EItemType {
  Dust,
  Planet,
  Star,
}

interface IObject {
  [key: string]: any
}

interface IItem {
  anim: anim.IAnim
  data?: IObject
  distance: number
  layer: number
  type: EItemType
}

const items: IItem[] = [],
  layers = new Map()

let dustSpawnTimer = 0,
  planetSpawnTimer = 0,
  starSpawnTimer = 0

function cleanup() {
  const cv = getContext().getCameraView()

  for (let i = 0, length = items.length; i < length; i++) {
    const sprite = items[i].anim.sprite

    const isAhead = sprite.x > sprite.width + cv.cameraWidth,
      isBehind = sprite.x <= -sprite.width

    // XXX: Deliberately not utils.isOffScreen
    if (isAhead || isBehind) {
      sprite.parent.removeChild(sprite)
      layers.delete(sprite)
      items.splice(i, 1)

      i--
      length--
    }
  }
}

function createDust(options) {
  const ctx = getContext()

  const rotationSpeed = _.random(-Math.PI, Math.PI) * 0.5

  const item: IItem = {
    anim: anim.create(),
    data: {
      rotationSpeed,
    },
    distance: 1,
    layer: 1,
    type: EItemType.Dust,
  }

  const frame = spriteUtil.frame32(1, 2),
    scale = _.random(0.5, 1.5, true),
    sprite = ctx.createSprite('starfield-001', frame, 0.5, 0.5, scale)

  item.anim.sprite = sprite

  sprite.alpha = 0.5 + Math.random() * 0.5
  sprite.rotation = Math.random() * 2 * Math.PI

  const layer = Math.random() > 0.5 ? ctx.layerAbove : ctx.layerBelow

  return _create(item, options, layer)
}

function createPlanet(options) {
  const ctx = getContext()

  const dimension = _.random(0, 5),
    distance = 34 + (dimension * 5),
    layer = 2 + dimension

  const frame = spriteUtil.frame32(1, 1, 14, 14),
    sheet = _.sample(['planet-001','planet-002','planet-003']),
    sprite = ctx.createSprite(sheet, frame, 0.5, 0.5, 1)

  const item: IItem = {
    anim: anim.create(),
    distance,
    layer,
    type: EItemType.Planet,
  }

  item.anim.sprite = sprite

  const tint = generatePlanetTint()

  sprite.rotation = Math.random() * 2 * Math.PI
  sprite.tint = tint

  ctx.layerBelow.addChild(sprite)

  return _create(item, options, ctx.layerBelow)
}

function createStar(options) {
  const ctx = getContext(),
    dimension = _.random(0, 49),
    distance = 8 + dimension,
    layer = distance

  const item: IItem = {
    anim: anim.create(),
    distance,
    layer,
    type: EItemType.Star,
  }

  const scale = 0.5 / Math.max(1, dimension / 15)

  const frame = spriteUtil.frame32(1, 1),
    sprite = ctx.createSprite('starfield-001', frame, 0.5, 0.5, scale)

  item.anim.sprite = sprite

  const tint = generateStarTint()

  sprite.rotation = Math.random() * 2 * Math.PI
  sprite.tint = tint

  let graphicsMode = 'normal' as 'extreme' | 'normal'

  if (graphicsMode === 'extreme') {
    sprite.filters = [
      new PIXI.filters.BlurFilter(1, 1),
      new GlowFilter(scale * 32, 8, 1, tint),
    ]
  }

  ctx.layerBelow.addChild(sprite)

  return _create(item, options, ctx.layerBelow)
}

function _create(item, options, layer) {
  const sprite = item.anim.sprite

  sprite.x = options.x
  sprite.y = options.y

  layer.addChild(sprite)
  layers.set(sprite, item.layer)
  items.push(item)

  return item
}

function generatePlanetTint() {
  return 0xdddddd + Math.random() * 0x11111
}

function generateStarTint() {
  return 0xdddddd + Math.random() * 0x2222
}

function getPlanetCount() {
  return _.filter(items, (c) => c.type == EItemType.Planet).length
}

export function initialize() {
  const planetCount = 1,
    starCount = _.random(10, 20)

  for (let i = 0; i < planetCount; i++) {
    spawnAnywhere(createPlanet)
  }
  for (let i = 0; i < starCount; i++) {
    spawnAnywhere(createStar)
  }

  sortLayerChildren()
}

function sortLayerChildren() {
  const ctx = getContext()

  ctx.layerBelow.children.sort((a, b) => layers.get(b) - layers.get(a))
}

function spawnAhead(factory, offset: number = 0) {
  const ctx = getContext(),
    cv = ctx.getCameraView(),
    x = cv.cameraWidth + offset,
    y = _.random(0, cv.cameraHeight)

  return _spawn(x, y, factory)
}

function spawnBehind(factory, offset: number = 0) {
  const ctx = getContext(),
    cv = ctx.getCameraView(),
    x = -offset,
    y = _.random(0, cv.cameraHeight)

  return _spawn(x, y, factory)
}

function spawnAnywhere(factory) {
  const ctx = getContext(),
    cv = ctx.getCameraView(),
    x = _.random(0, cv.cameraWidth),
    y = _.random(0, cv.cameraHeight)

  return _spawn(x, y, factory)
}

function _spawn(x, y, factory) {
  const options = {
    x,
    y,
  }

  return factory(options)
}

export function updateAll(elapsedTimeSec) {
  const ctx = getContext(),
    stats = ctx.stats.getCurrentStats(),
    velocity = stats.speed * 20

  updateSpawner(elapsedTimeSec, velocity)
  updateItems(elapsedTimeSec, velocity)

  if (velocity) {
    cleanup()
  }
}

function updateItems(elapsedTimeSec, velocity) {
  _.forEach(items, (c) => {
    const sprite = c.anim.sprite

    sprite.x -= velocity / c.distance

    if (c.type == EItemType.Dust) {
      sprite.rotation += c.data.rotationSpeed * elapsedTimeSec
    }
  })
}

function updateSpawner(elapsedTimeSec, velocity) {
  if (velocity == 0) {
    return
  }

  dustSpawnTimer += elapsedTimeSec
  planetSpawnTimer += elapsedTimeSec
  starSpawnTimer += elapsedTimeSec

  const factory = velocity > 0 ? spawnAhead : spawnBehind
  let itemsCreated = false

  if (dustSpawnTimer > 0.25) {
    factory(createDust)
    itemsCreated = true
    dustSpawnTimer -= Math.random() * 0.25
  }

  if (planetSpawnTimer > 10) {
    if (getPlanetCount() < 2) {
      factory(createPlanet, 224)
    }
    planetSpawnTimer = 0
  }

  if (starSpawnTimer > 0.5) {
    factory(createStar)
    itemsCreated = true
    starSpawnTimer -= Math.random()
  }

  if (itemsCreated) {
    sortLayerChildren()
  }
}
