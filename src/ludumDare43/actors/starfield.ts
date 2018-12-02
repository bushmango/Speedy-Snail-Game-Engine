import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'

import { GlowFilter } from 'pixi-filters'
import * as utils from './utils'

enum EItemType {
  Dust,
  Star,
}

interface IObject {
  [key: string]: any
}

interface IItem {
  anim: anim.IAnim
  data?: IObject
  distance: number
  type: EItemType
}

const distances = new Map()

const items: IItem[] = []

let dustSpawnTimer = 0,
  starSpawnTimer = 0

function cleanup() {
  const ctx = getContext()
  let cv = ctx.getCameraView()

  for (let i = 0, length = items.length; i < length; i++) {
    const sprite = items[i].anim.sprite

    if (utils.isOffScreen(cv, sprite)) {
      sprite.parent.removeChild(sprite)
      distances.delete(sprite)
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
    type: EItemType.Dust,
  }

  const frame = spriteUtil.frame32(1, 2),
    sprite = ctx.createSprite('starfield-001', frame, 0.5, 0.5, 1)

  item.anim.sprite = sprite

  sprite.alpha = 0.5 + Math.random() * 0.5
  sprite.rotation = Math.random() * 2 * Math.PI

  const layer = Math.random() > 0.5 ? ctx.layerAbove : ctx.layerBelow

  return _create(item, options, layer)
}

function createStar(options) {
  const ctx = getContext(),
    distance = _.random(2, 64)

  const item: IItem = {
    anim: anim.create(),
    distance,
    type: EItemType.Star,
  }

  const scale = 1 / Math.max(1, distance / 16)

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
  const ctx = getContext(),
    sprite = item.anim.sprite

  sprite.x = options.x
  sprite.y = options.y

  distances.set(sprite, item.distance)

  layer.addChild(sprite)

  items.push(item)

  return item
}

function generateStarTint() {
  // XXX: Placeholder
  // TODO: Generate more realistic colors
  return 0xdddddd + Math.random() * 0x2222
}

export function initialize() {
  const count = _.random(10, 20)

  for (let i = 0; i < count; i++) {
    spawnAnywhere(createStar)
  }

  sortLayerChildren()
}

/**
 * In lieu of creating multiple layers, we can sort children by their distances when needed.
 */
function sortLayerChildren() {
  const ctx = getContext()

  ctx.layerBelow.children.sort((a, b) => distances.get(a) - distances.get(b))
}

function spawnAhead(factory) {
  const ctx = getContext(),
    cv = ctx.getCameraView(),
    x = cv.cameraWidth,
    y = _.random(0, cv.cameraHeight)

  return _spawn(x, y, factory)
}

function spawnBehind(factory) {
  const ctx = getContext(),
    cv = ctx.getCameraView(),
    x = 0,
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

  cleanup()
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
  starSpawnTimer += elapsedTimeSec

  const factory = velocity > 0 ? spawnAhead : spawnBehind
  let itemsCreated = false

  if (dustSpawnTimer > 0.25) {
    factory(createDust)
    itemsCreated = true
    dustSpawnTimer -= Math.random() * 0.25
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
