import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from 'engine/log'
import * as spriteUtil from 'engine/anim/spriteUtil'

import * as placeSwitcher from 'engine/anim/placeSwitcher'
import * as buttons from './buttons'
import * as buttonsGeneric from 'engine/menus2/buttonsGeneric'

export interface IMenuStart {
  logoSwitch: placeSwitcher.IPlaceSwitcher
  logoSprite: PIXI.Sprite

  buttons: buttonsGeneric.IMenuButton[]
}

let item: IMenuStart = null

export function slideIn() {
  let ctx = getContext()
  ctx.uiMode.setMode('menu-start')

  placeSwitcher.moveIn(item.logoSwitch)
  _.forEach(item.buttons, (c, cIdx) => {
    placeSwitcher.moveIn(c.placeSwitcher)
  })
}
export function slideOut() {
  let ctx = getContext()
  ctx.uiMode.setMode('game')

  placeSwitcher.moveOut(item.logoSwitch)
  _.forEach(item.buttons, (c, cIdx) => {
    placeSwitcher.moveOut(c.placeSwitcher)
  })
}

export function create() {
  let ctx = getContext()

  log.x('create menu start')

  item = {
    logoSwitch: placeSwitcher.create(200, 100, 100, -100),
    logoSprite: null,
    buttons: [],
  }

  item.logoSprite = ctx.createSprite(
    '512-32-gui',
    spriteUtil.frame32(2, 5, 6, 2),
    0,
    0,
    1
  )
  ctx.layerUi.addChild(item.logoSprite)
  item.logoSwitch.delayOut = 0.5
  placeSwitcher.startOut(item.logoSwitch, item.logoSprite)

  let button = buttons.create('Play!')
  button.onClick = () => {
    slideOut()
  }
  item.buttons.push(button)
  button = buttons.create('b')
  item.buttons.push(button)
  button = buttons.create('c')
  item.buttons.push(button)

  _.forEach(item.buttons, (c, cIdx) => {
    c.placeSwitcher = placeSwitcher.create(
      100,
      200 + 100 * cIdx,
      -200,
      200 + 100 * cIdx
    )
    c.placeSwitcher.delayIn = (cIdx + 1) * 0.25
    c.placeSwitcher.delayOut = (item.buttons.length - cIdx) * 0.1

    placeSwitcher.startOut(c.placeSwitcher, c.container)
  })

  return item
}

export function update(elapsedTimeSec) {
  let ctx = getContext()

  placeSwitcher.update(item.logoSwitch, item.logoSprite, elapsedTimeSec)
}
