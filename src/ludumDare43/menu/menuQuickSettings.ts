import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as settingsGeneric from 'engine/misc/settingsGeneric'

import * as placeSwitcher from 'engine/anim/placeSwitcher'
import * as buttons from './buttons'
import * as buttonsGeneric from 'engine/menus2/buttonsGeneric'

import * as spriteUtil from 'engine/anim/spriteUtil'
import * as sounds from './../sounds/sounds'

import * as shipParts from './../actors/shipParts'
import * as goats from './../actors/goats'
import * as asteroids from './../actors/asteroids'

export interface IMenuQuickSettings {
  buttonSound: buttonsGeneric.IMenuButton
  buttonMusic: buttonsGeneric.IMenuButton
  buttonMainMenu: buttonsGeneric.IMenuButton
  buttonZoom: buttonsGeneric.IMenuButton
  buttonDifficulty: buttonsGeneric.IMenuButton
  buttonFullScreen: buttonsGeneric.IMenuButton
  buttonColorMode: buttonsGeneric.IMenuButton
  buttonReset: buttonsGeneric.IMenuButton

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
    buttonDifficulty: null,
    buttonFullScreen: null,
    buttonColorMode: null,
    buttonReset: null,
    buttons: [],
  }

  item.buttonMusic = buttons.createWithSprite(12, 1)
  item.buttonMusic.onClick = () => {
    //slideOut()
    settingsGeneric.updateSettings({
      muteMusic: !settingsGeneric.getSettings().muteMusic,
    })
  }
  item.buttons.push(item.buttonMusic)
  item.buttonSound = buttons.createWithSprite(12, 1) // buttons.create('Sound!!')
  item.buttonSound.onClick = () => {
    //slideOut()

    let mute = !settingsGeneric.getSettings().muteSound

    settingsGeneric.updateSettings({
      muteSound: mute,
    })
  }
  item.buttons.push(item.buttonSound)

  item.buttonMainMenu = buttons.createWithSprite(9, 1) //buttons.create('Main menu')
  item.buttonMainMenu.onClick = () => {
    let ctx = getContext()
    ctx.menuStart.slideIn()
  }
  item.buttons.push(item.buttonMainMenu)

  item.buttonDifficulty = buttons.create('Difficulty')
  item.buttonDifficulty.onClick = () => {}
  item.buttons.push(item.buttonDifficulty)

  item.buttonReset = buttons.create('Reset')
  item.buttonReset.onClick = () => {
    //asteroids.
    goats.eject()
    // TODO: destroy all asteroids
    // reset distance and score
    // destroy all ship parts
    _.forEach(asteroids.getAll(), (c) => {
      asteroids.smash(c)
    })
    _.forEach(shipParts.getAll(), (c) => {
      if (c.isAttached) {
        shipParts.destroyFixedPiece(c)
      } else {
        shipParts.smash(c)
      }
    })
  }
  item.buttons.push(item.buttonReset)

  item.buttonColorMode = buttons.create('Color Mode')
  item.buttonColorMode.onClick = () => {}
  item.buttons.push(item.buttonColorMode)

  item.buttonFullScreen = buttons.create('Full Screen')
  item.buttonFullScreen.onClick = () => {
    toggleFullscreen()
  }
  item.buttons.push(item.buttonFullScreen)

  // item.buttonZoom = buttons.createWithSprite(11, 1) // buttons.create('Zoom')
  // item.buttonZoom.onClick = () => {
  //   //let ctx = getContext()
  //   //ctx.menuStart.slideIn()
  //   ctx.toggleZoom()
  // }
  // item.buttons.push(item.buttonZoom)

  onResize()

  return item
}

let fullScreenOpen = false
function toggleFullscreen() {
  if (fullScreenOpen) {
    closeFullscreen()
  } else {
    openFullscreen()
  }
}
function openFullscreen() {
  var elem = document.documentElement as any
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen()
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen()
  }
  fullScreenOpen = true
}
function closeFullscreen() {
  let doc = document as any
  if (doc.exitFullscreen) {
    doc.exitFullscreen()
  } else if (doc.mozCancelFullScreen) {
    /* Firefox */
    doc.mozCancelFullScreen()
  } else if (doc.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    doc.webkitExitFullscreen()
  } else if (doc.msExitFullscreen) {
    /* IE/Edge */
    doc.msExitFullscreen()
  }
  fullScreenOpen = false
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
