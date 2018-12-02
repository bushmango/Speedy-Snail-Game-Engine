import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'

enum EItemType {
  Star,
}

interface IItem {
  anim: anim.IAnim
  distance: number
  type: EItemType
}

const distances = new Map()

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
  // TODO: Create additional factories that build things like nebulae
  // TODO: Call a random factory, weighted heavily toward stars
  return createStar(options)
}

function createStar(options) {
  const ctx = getContext(),
    distance = _.random(1, 64)

  const item: IItem = {
    anim: anim.create(),
    distance,
    type: EItemType.Star,
  }

  const scale = 1 / Math.max(1, distance / 8),
    spriteNumber = _.random(1, 4)

  const frame = spriteUtil.frame32(1, spriteNumber),
    sprite = ctx.createSprite('starfield-001', frame, 0.5, 0.5, scale)

  item.anim.sprite = sprite

  // XXX: Placeholder
  // TODO: Improve
  sprite.tint = Math.random() * 0xffffff
  sprite.rotation = Math.random() * 2 * Math.PI

  return _create(item, options)
}

function _create(item, options) {
  const ctx = getContext(),
    sprite = item.anim.sprite

  sprite.x = options.x
  sprite.y = options.y

  distances.set(sprite, item.distance)

  ctx.layerBelow.addChild(sprite)

  items.push(item)

  return item
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

function spawnAnywhere() {
  const ctx = getContext(),
    view = ctx.sge.getViewSize(),
    x = _.random(0, view.width),
    y = _.random(0, view.height)

  return spawn(x, y)
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext(),
    stats = ctx.stats.getCurrentStats(),
    velocity = stats.speed

  // make everything faster
  velocity *= 4

  updateSpawner(elapsedTimeSec, velocity)
  updateItems(elapsedTimeSec, velocity)

  cleanup()
}

function updateItems(elapsedTimeSec, velocity) {
  _.forEach(items, (c) => {
    c.anim.sprite.x -= velocity / c.distance

    // TODO: Switch on c.type and perform type-specific animations, e.g. twinkle the stars
  })
}

function updateSpawner(elapsedTimeSec, velocity) {
  spawnTimer += elapsedTimeSec

  if (velocity == 0) {
    return
  }

  // XXX: Linear relationship, works best if velocity is small, e.g. 0-5
  // TODO: Smarter maths
  const targetTime = 1 / velocity

  if (elapsedTimeSec >= targetTime) {
    const item = spawnAhead()
    sortLayerChildren()
    spawnTimer = 0
  }
}
