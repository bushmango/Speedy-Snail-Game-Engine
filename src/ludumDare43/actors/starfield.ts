import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'

enum EItemType {
  Dust,
  Star,
}

interface IObject {
  [key: string]: any
}

interface IItem {
  anim: anim.IAnim,
  data?: IObject,
  distance: number,
  type: EItemType,
}

const distances = new Map();

const items: IItem[] = []

let spawnTimer = 0

function cleanup() {
  const ctx = getContext()

  for (let i = 0, length = items.length; i < length; i++) {
    const sprite = items[i].anim.sprite

    if (sprite.x <= -sprite.width) {
      ctx.layerBelow.removeChild(sprite)
      distances.delete(sprite)
      items.splice(i, 1)

      i--
      length--
    }
  }
}

function createRandom(options) {
  const diceroll = Math.random();

  if (diceroll > 0.5) {
    return createStar(options)
  }

  return createDust(options)
}

function createDust(options) {
  const ctx = getContext()

  const rotationSpeed = _.random(-Math.PI, Math.PI) * 0.5

  const item : IItem = {
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

  sprite.filters = [
    // XXX: new PIXI.filters.MotionBlurFilter(),
  ];

  const layer = Math.random() > 0.5 ? ctx.layerAbove : ctx.layerBelow

  return _create(item, options, layer)
}

function createStar(options) {
  const ctx = getContext(),
        distance = _.random(1, 64)

  const item : IItem = {
    anim: anim.create(),
    distance,
    type: EItemType.Star,
  }

  const scale = 1 / Math.max(1, distance / 4)

  const frame = spriteUtil.frame32(1, 1),
        sprite = ctx.createSprite('starfield-001', frame, 0.5, 0.5, scale)

  item.anim.sprite = sprite

  const tint = generateStarTint()

  sprite.rotation = Math.random() * 2 * Math.PI
  sprite.tint = tint

  sprite.filters = [
    // XXX: new PIXI.filters.GlowFilter(10, 4, 1, tint),
    new PIXI.filters.BlurFilter(1, 1),
  ];

  ctx.layerBelow.addChild(sprite)

  return _create(item, options, ctx.layerBelow)
}

function _create(item, options, layer) {
  const ctx = getContext(),
        sprite = item.anim.sprite

  sprite.x = options.x
  sprite.y = options.y

  distances.set(sprite, item.distance);

  layer.addChild(sprite)

  items.push(item)

  return item
}

function generateStarTint() {
  // XXX: Placeholder
  // TODO: Generate more realistic colors
  return Math.random() * 0xFFFFFF
}

export function initialize() {
  const count = _.random(100, 200)

  for (let i = 0; i < count; i++) {
    spawnAnywhere()
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

function spawn(x, y) {
  const options = {
    x,
    y,
  }

  return createRandom(options)
}

function spawnAhead() {
  const ctx = getContext(),
        view = ctx.sge.getViewSize(),
        x = view.width + 1,
        y = _.random(0, view.height)

  return spawn(x, y)
}

function spawnBehind() {
  const ctx = getContext(),
        view = ctx.sge.getViewSize(),
        x = -1,
        y = _.random(0, view.height)

  return spawn(x, y)
}

function spawnAnywhere() {
  const ctx = getContext(),
        view = ctx.sge.getViewSize(),
        x = _.random(0, view.width),
        y = _.random(0, view.height)

  return spawn(x, y)
}

export function updateAll(elapsedTimeSec) {
  const ctx = getContext(),
        stats = ctx.stats.getCurrentStats(),
        velocity = stats.speed

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
  spawnTimer += elapsedTimeSec

  if (velocity == 0) {
    return
  }

  const factory = velocity > 0 ? spawnAhead : spawnBehind

  // XXX: Linear relationship, works best if velocity is small, e.g. 0-5
  // TODO: Smarter maths
  const targetTime = 0.5 / velocity

  if (elapsedTimeSec >= targetTime) {
    const item = factory()
    sortLayerChildren()
    spawnTimer = 0
  }
}
