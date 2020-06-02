import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from 'engine/log'
import * as spriteUtil from 'engine/anim/spriteUtil'

import * as placeSwitcher from 'engine/anim/placeSwitcher'
import * as buttons from './buttons'
import * as buttonsGeneric from 'engine/menus2/buttonsGeneric'

import * as pubSub from 'engine/common/pubSub'

import * as settingsGeneric from 'engine/misc/settingsGeneric'
import * as sounds from './../sounds/sounds'

export interface IMenuStart {
  logoSwitch: placeSwitcher.IPlaceSwitcher
  logoSprite: PIXI.Sprite

  creditsSwitch: placeSwitcher.IPlaceSwitcher
  creditsSprite: PIXI.Sprite

  buttonDifficulty: buttonsGeneric.IMenuButton
  // instructionsSwitch: placeSwitcher.IPlaceSwitcher
  // instructionsSprite: PIXI.Sprite

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
    logoSwitch: placeSwitcher.create(230, 50, 100, -800),
    logoSprite: null,

    creditsSwitch: placeSwitcher.create(230, 25, 2000, -100),
    creditsSprite: null,

    // instructionsSwitch: placeSwitcher.create(250, 200, 2000, -100),
    // instructionsSprite: null,
    buttonDifficulty: null,
    buttons: [],
  }

  // item.logoSprite = ctx.createSprite(
  //   '512-32-gui',
  //   spriteUtil.frame32(2, 5, 6, 2),
  //   0,
  //   0,
  //   1
  // )
  item.logoSprite = ctx.createSprite('title', null, 0, 0, 2)
  ctx.layerUi.addChild(item.logoSprite)
  item.logoSwitch.delayOut = 0.5
  placeSwitcher.startOut(item.logoSwitch, item.logoSprite)

  item.creditsSprite = ctx.createSprite('credits', null, 0, 0, 2)
  ctx.layerUi.addChild(item.creditsSprite)
  item.creditsSprite.interactive = true
  item.creditsSprite.buttonMode = true
  item.creditsSprite.on('pointerup', () => {
    placeSwitcher.moveOut(item.creditsSwitch)
    pubSub.emit('gui:click-button')
  })
  placeSwitcher.startOut(item.creditsSwitch, item.creditsSprite)
  // placeSwitcher.moveIn(item.creditsSwitch)

  // item.instructionsSprite = ctx.createSprite('instructions', null, 0, 0, 2)
  // item.instructionsSprite.interactive = true
  // item.instructionsSprite.buttonMode = true
  // item.instructionsSprite.on('pointerup', () => {
  //   placeSwitcher.moveOut(item.instructionsSwitch)
  //   pubSub.emit('gui:click-button')
  // })
  // ctx.layerUi.addChild(item.instructionsSprite)
  // placeSwitcher.startOut(item.instructionsSwitch, item.instructionsSprite)
  // placeSwitcher.moveIn(item.instructionsSwitch)

  let button = buttons.createWithSprite(10, 1, 3) //buttons.create('Play!')
  button.onClick = () => {
    slideOut()
    //placeSwitcher.moveOut(item.instructionsSwitch)
    placeSwitcher.moveOut(item.creditsSwitch)
  }
  item.buttons.push(button)
  // button = buttons.createWithSprite(10, 6, 5) // buttons.create('Instructions')
  // button.onClick = () => {
  //   placeSwitcher.moveIn(item.instructionsSwitch)
  //   placeSwitcher.moveOut(item.creditsSwitch)
  // }
  // item.buttons.push(button)
  item.buttonDifficulty = buttons.create(
    'Difficulty',
    0x009933,
    '20px tahoma20'
  )
  item.buttonDifficulty.onClick = () => {
    ctx.stats.nextDifficulty()
    // zones.setCurrentZoneSet(ctx.stats.getCurrentStats().difficulty)
    onReset()
  }

  item.buttons.push(item.buttonDifficulty)

  let onReset = () => {
    let ctx = getContext()
    ctx.stats.updateStats({ isResetting: true })
    ctx.stats.reset()

    // goats.eject()
    // // TODO: destroy all asteroids
    // // reset distance and score
    // // destroy all ship parts
    // _.forEach(asteroids.getAll(), (c) => {
    //   asteroids.smash(c)
    // })
    // _.forEach(shipParts.getAll(), (c) => {
    //   if (c.isAttached) {
    //     shipParts.destroyFixedPiece(c)
    //   } else {
    //     shipParts.smash(c)
    //   }
    // })
  }

  button = buttons.createWithSprite(11, 6, 3) //buttons.create('Credits')
  button.onClick = () => {
    placeSwitcher.moveIn(item.creditsSwitch)
    //placeSwitcher.moveOut(item.instructionsSwitch)
  }
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
  placeSwitcher.update(item.creditsSwitch, item.creditsSprite, elapsedTimeSec)

  item.buttonDifficulty.text.text =
    'Mode: ' + ctx.stats.getCurrentStats().difficultyLabel

  // placeSwitcher.update(
  //   item.instructionsSwitch,
  //   item.instructionsSprite,
  //   elapsedTimeSec
  // )
}