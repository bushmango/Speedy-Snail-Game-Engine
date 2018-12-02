import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'
import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'

import * as placeSwitcher from 'engine/anim/placeSwitcher'
import * as buttonsGeneric from 'engine/menus2/buttonsGeneric'
import * as chroma from 'chroma-js'

var animDefault: anim.IAnimData = {
  frames: [spriteUtil.frame32(6, 1, 5, 1)],
}
var animHover: anim.IAnimData = {
  frames: [spriteUtil.frame32(7, 1, 5, 1)],
}
var animDown: anim.IAnimData = {
  frames: [spriteUtil.frame32(8, 1, 5, 1)],
}

export function create(text: string = '') {
  let ctx = getContext()

  log.x('create button')

  let item = buttonsGeneric.create(
    text,
    '512-32-gui',
    null,
    animDefault,
    animHover,
    animDown,
    ctx.createSprite,
    ctx.layerUi
  )

  item.anim.sprite.tint = chroma('#0F6BA8').num()

  return item
}

export function createWithSprite(y, x, w = 4) {
  let ctx = getContext()

  log.x('create button')

  let item = buttonsGeneric.create(
    null,
    '512-32-gui',
    spriteUtil.frame32(y, x, w),
    animDefault,
    animHover,
    animDown,
    ctx.createSprite,
    ctx.layerUi
  )

  item.anim.sprite.tint = chroma('#0F6BA8').num()
  // item.textSprite = ctx.createSprite(
  //   '512-32-gui',
  //   spriteUtil.frame32(y, x, w),
  //   0,
  //   0,
  //   2
  // )

  return item
}

createWithSprite

export function createSmaller(text: string = '') {
  let ctx = getContext()

  log.x('create button')

  return buttonsGeneric.create(
    text,
    '512-32-gui',
    null,
    animDefault,
    animHover,
    animDown,
    ctx.createSprite,
    ctx.layerUi
  )
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()

  buttonsGeneric.updateAll(elapsedTimeSec)
}
