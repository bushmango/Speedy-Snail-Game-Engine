import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'

enum EItemType {
  Star,
}

interface IItem {
  anim: anim.IAnim,
  distance: number,
  type: EItemType,
}

const items: IItem[] = []

function createRandom(options) {
  // TODO: Create additional factories that build things like nebulae
  // TODO: Call a random factory, weighted heavily toward stars
  return createStar(options)
}

function createStar(options) {
  const ctx = getContext(),
        distance = _.random(0, 1)

  const item : IItem = {
    anim: anim.create(),
    distance,
    type: EItemType.Star,
  }

  // TODO: Create sprite and attach it to ctx.layerBelow
  // TODO: Set sprite position via options.x and options.y

  return item
}

export function initialize() {
  const count = _.random(0, 25)

  for (let i = 0; i < count; i++) {
    spawnAnywhere()
  }
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

export function updateAll(elapsedTimeSec, velocity) {
  updateSpawner(elapsedTimeSec, velocity)
  updateItems(elapsedTimeSec, velocity)
}

function updateItems(elapsedTimeSec, velocity) {
  _.forEach(items, (c) => {
    // TODO: Animate c.anim.sprite based on velocity / c.distance
    // TODO: Switch on c.type and perform type-specific animations
  })
}

let spawnTimer = 0
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
    items.push(item)
    spawnTimer = 0
  }
}