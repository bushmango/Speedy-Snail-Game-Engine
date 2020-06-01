// See: https://github.com/kittykatattack/learningPixi

const { Rectangle, Sprite } = PIXI
const { TextureCache } = PIXI.utils

import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { LudumDareStartContext } from 'ludumDareStart/LudumDareStartContext'

import * as settingsGeneric from 'engine/misc/settingsGeneric'
import * as ldSounds from 'ludumDareStart/sounds/ldSounds'

let sge = new SimpleGameEngine()

let context = new LudumDareStartContext()

export function preload() {
  settingsGeneric.load('ludum-dare-start-v001')

  sge.preloadAudioSprites(['audioSprite'])
  sge.preloadBitmapFonts(['defaultfont'])
  sge.preloadSprites(['test-ship', 'prariesnailgames'])
  sge.preloadSpriteSheets([
    'test-tileset',
    'gui-tileset',
    'ase-512-16',
    'ase-512-8',
  ])
  sge.preloadTiledMaps([])
  sge.preloadPackedSprites([])
}

let pixiMode = 'unknown'
export function run() {
  console.log('Running ludum dare start sample')

  sge.init()
  sge.createRenderer()
  let stage = sge.stage
  let renderer = sge.renderer

  preload()
  sge.preload('/public/ludumDareStart', () => {
    onLoaded()
  })

  window.onresize = () => {
    sge.resize()
  }

  function onLoaded() {
    sge.onUpdateCallback = onUpdate

    // Now load sounds & music
    ldSounds.load(sge)

    context.onLoaded(sge)

    sge.startGameLoop()
  }

  function onUpdate() {
    context.onUpdate()
  }
}
