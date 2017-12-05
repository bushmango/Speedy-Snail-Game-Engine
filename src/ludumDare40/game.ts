// See: https://github.com/kittykatattack/learningPixi

// TODO: custom textures -- if needed
// TODO: run stand alone
// TODO: deploy to github
// TODO: deploy to steviebushman.com
// TODO: get tools working for sounds and music and gfx conversion
// TODO: X menu indicator
// TODO: X better font
// TODO: X sound
// TODO: X music
// TODO: X basic menus
// TODO: X revamp menus
// TODO: X basic sound + music muting
// TODO: advanced sound + music muting

const { Rectangle, Sprite } = PIXI
const { TextureCache } = PIXI.utils

import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { LudumDare40Context } from 'ludumDare40/LudumDare40Context';

import * as settingsGeneric from 'engine/misc/settingsGeneric'
import * as ldSounds from 'ludumDare40/sounds/ldSounds'

let sge = new SimpleGameEngine()

let context = new LudumDare40Context()

export function preload() {

  settingsGeneric.load('ludum-dare-40-v003')

  sge.preloadAudioSprites([
    'audioSprite',
  ])
  sge.preloadBitmapFonts([
    'defaultfont',
  ])
  sge.preloadSprites([
    'test-ship',
    'prariesnailgames',
  ])
  sge.preloadSpriteSheets([
    'test-tileset',
    'gui-tileset',
    'ase-512-16',
  ])
 
  sge.preloadTiledMaps([
    'map-start',
    'map-01-001',
    'map-01-002',
    'map-01-003',
    'map-01-004',
    'map-01-005',
    'map-01-006',
    'map-01-007',
    'map-01-008',
    'map-01-009',
    'map-mid',
    'map-boss',
    'map-end',
  ])
  sge.preloadPackedSprites([
  ])

}

let pixiMode = 'unknown'
export function run() {

  console.log('Running ludum dare start sample')

  sge.init()
  sge.createRenderer()
  let stage = sge.stage
  let renderer = sge.renderer

  preload()
  sge.preload(
    '/public/ludumDare40',
    () => {
      onLoaded()
    },
  )

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
