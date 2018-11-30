import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'
import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'

import * as stats from 'pacrpg/stats'

const isActive = true

import * as placeSwitcher from './placeSwitcher'
import * as buttons from './buttons'

export interface IStartMenu {
  logoSwitch: placeSwitcher.IPlaceSwitcher
  logoSprite: PIXI.Sprite

  buttons: buttons.IMenuButton[]
}

let item: IStartMenu = null

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
  placeSwitcher.moveIn(item.logoSwitch)

  let button = buttons.create('Play!')
  button.onClick = () => {
    ctx.uiMode.setMode('game')
    placeSwitcher.moveOut(item.logoSwitch)
    _.forEach(item.buttons, (c, cIdx) => {
      placeSwitcher.moveOut(c.placeSwitcher)
    })
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
    placeSwitcher.moveIn(c.placeSwitcher)
  })

  return item
}

export function update(elapsedTimeSec) {
  let ctx = getContext()

  placeSwitcher.update(item.logoSwitch, item.logoSprite, elapsedTimeSec)
}
