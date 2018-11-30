// See: https://github.com/kittykatattack/learningPixi

const { Rectangle, Sprite } = PIXI
const { TextureCache } = PIXI.utils

import * as log from '../engine/log'

import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as settingsGeneric from 'engine/misc/settingsGeneric'
import * as ldSounds from 'ludumDare41/sounds/ldSounds'
import { GameContext } from './GameContext'

let sge = new SimpleGameEngine()

let ctx = new GameContext()

import * as gamePreload from './gamePreload'

export function preload() {}

let pixiMode = 'unknown'
export function run() {
  log.x('Ludum Dare 43 Game by Prarie Snail Productions and Stevie Bushman')

  // Make crisp
  PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

  sge.init()
  sge.createRenderer()

  settingsGeneric.load(gamePreload.settingsPath)
  gamePreload.preload(sge)
  sge.preload(gamePreload.preloadPath, () => {
    onLoaded()
  })

  window.onresize = () => {
    sge.resize()
  }

  function onLoaded() {
    sge.onUpdateCallback = onUpdate

    // Now load sounds & music
    ldSounds.load(sge)
    ctx.onLoaded(sge)
    sge.startGameLoop()
  }

  function onUpdate() {
    ctx.onUpdate()
  }
}
