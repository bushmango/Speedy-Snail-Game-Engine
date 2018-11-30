import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'
import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'

import * as placeSwitcher from 'engine/anim/placeSwitcher'
import * as buttonsGeneric from 'engine/menus2/buttonsGeneric'

var animDefault: anim.IAnimData = {
  frames: [spriteUtil.frame32(1, 1, 4, 1)],
}
var animHover: anim.IAnimData = {
  frames: [spriteUtil.frame32(3, 1, 4, 1)],
}
var animDown: anim.IAnimData = {
  frames: [spriteUtil.frame32(2, 1, 4, 1)],
}

export function create(text: string = '') {
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
