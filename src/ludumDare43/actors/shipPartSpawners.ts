import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as shipParts from './shipParts'

interface IShipParSpawner {
  x: number
  y: number
  elapsedSec: number
}
let items: IShipParSpawner[] = []

export function create() {
  let ctx = getContext()

  log.x('create ship part spawner')
  let item: IShipParSpawner = {
    x: 600,
    y: 200,
    elapsedSec: 0,
  }

  items.push(item)
  return item
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()
  let kb = ctx.sge.keyboard

  _.forEach(items, (c) => {
    c.elapsedSec += elapsedTimeSec
    if (c.elapsedSec > 1) {
      c.elapsedSec = 0
      let shipPart = shipParts.create()
      shipPart.anim.sprite.x = c.x
      shipPart.anim.sprite.y = c.y
    }
  })
}
