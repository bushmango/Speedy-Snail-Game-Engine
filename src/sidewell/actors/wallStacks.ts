import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'
import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'

import * as wallPieces from './wallPieces'
import * as utils from './utils'

export interface IWallStack {
  bx: number
  items: wallPieces.IWallPiece[]
  isDead: boolean
}
let items: IWallStack[] = []
export function getAll() {
  return items
}

export function create(bx) {
  let ctx = getContext()

  let item: IWallStack = {
    bx,
    items: [],
    isDead: false,
  }
  items.push(item)
  return item
}

export function remove(item: IWallStack) {
  item.isDead = true
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()
  _.forEach(items, (c) => {})

  utils.removeDead(items, 'wall-stack', (c) => {
    _.forEach(c.items, (c) => {
      c.isDead = true
    })
  })
}
