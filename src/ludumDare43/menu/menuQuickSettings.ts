import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as settingsGeneric from 'engine/misc/settingsGeneric'

import * as pubSub from 'engine/common/pubSub'

import * as placeSwitcher from 'engine/anim/placeSwitcher'
import * as buttons from './buttons'
import * as buttonsGeneric from 'engine/menus2/buttonsGeneric'

import * as spriteUtil from 'engine/anim/spriteUtil'

export interface IMenuQuickSettings {
  buttonSound: buttonsGeneric.IMenuButton
  buttonMusic: buttonsGeneric.IMenuButton
  buttonMainMenu: buttonsGeneric.IMenuButton
  buttonZoom: buttonsGeneric.IMenuButton
  buttons: buttonsGeneric.IMenuButton[]
}

let item: IMenuQuickSettings = null

// export function slideIn() {
//   let ctx = getContext()
// }
// export function slideOut() {
//   let ctx = getContext()
// }

export function create() {
  let ctx = getContext()

  log.x('create menu quick settings')

  item = {
    buttonSound: null,
    buttonMusic: null,
    buttonMainMenu: null,
    buttonZoom: null,
    buttons: [],
  }

  item.buttonMusic = buttons.createWithSprite(12, 1)
  item.buttonMusic.onClick = () => {
    //slideOut()
    settingsGeneric.updateSettings({
      muteMusic: !settingsGeneric.getSettings().muteMusic,
    })

    pubSub.emit('gui:toggle-music')
  }
  item.buttons.push(item.buttonMusic)
  item.buttonSound = buttons.createWithSprite(12, 1) // buttons.create('Sound!!')
  item.buttonSound.onClick = () => {
    //slideOut()

    settingsGeneric.updateSettings({
      muteSound: !settingsGeneric.getSettings().muteSound,
    })
  }
  item.buttons.push(item.buttonSound)

  item.buttonMainMenu = buttons.createWithSprite(9, 1) //buttons.create('Main menu')
  item.buttonMainMenu.onClick = () => {
    let ctx = getContext()
    ctx.menuStart.slideIn()
  }
  item.buttons.push(item.buttonMainMenu)

  item.buttonZoom = buttons.createWithSprite(11, 1) // buttons.create('Zoom')
  item.buttonZoom.onClick = () => {
    //let ctx = getContext()
    //ctx.menuStart.slideIn()
    ctx.toggleZoom()
  }
  item.buttons.push(item.buttonZoom)

  onResize()

  return item
}

export function update(elapsedTimeSec) {
  let ctx = getContext()
  let { width, height } = ctx.sge.getViewSize()
  _.forEach(item.buttons, (c, cIdx) => {
    //c.placeSwitcher.x1
  })

  let settings = settingsGeneric.getSettings()
  //item.buttonSound.text.text = settings.muteSound ? 'Sound off' : 'Sound on'
  item.buttonSound.textSprite.texture.frame = settings.muteSound
    ? spriteUtil.frame32(9, 6, 4)
    : spriteUtil.frame32(14, 1, 4)
  item.buttonMusic.textSprite.texture.frame = settings.muteMusic
    ? spriteUtil.frame32(13, 1, 4)
    : spriteUtil.frame32(12, 1, 4)
  // item.buttonMusic.text.text = settings.muteMusic ? 'Music off' : 'Music on'

  // placeSwitcher.update(item.bu, item.logoSprite, elapsedTimeSec)
}

export function onResize() {
  let ctx = getContext()
  let { width, height } = ctx.sge.getViewSize()
  _.forEach(item.buttons, (c, cIdx) => {
    c.placeSwitcher = placeSwitcher.create(
      10 + 175 * cIdx,
      height - 34,
      -200,
      height - 50 + 100
    )
    c.placeSwitcher.delayIn = (cIdx + 1) * 0.25
    c.placeSwitcher.delayOut = (item.buttons.length - cIdx) * 0.1

    placeSwitcher.startOut(c.placeSwitcher, c.container)
    placeSwitcher.moveIn(c.placeSwitcher)
  })
}
