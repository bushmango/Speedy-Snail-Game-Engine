// See: https://github.com/kittykatattack/learningPixi

import * as Victor from 'victor'

const { Rectangle, Sprite } = PIXI
const { TextureCache } = PIXI.utils

import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { GamepadTester } from 'engine/gamepad/GamepadTester'
import { InputControl } from 'engine/gamepad/InputControl'

import { TileMap, ITileData, IGridSpot } from 'engine/tiles/TileMap'
import { ParticleEmitter } from 'engine/particles/ParticleEmitter'
// import * as tileMapFiller from 'engine/tiles/tileMapFiller'
// import * as tileMapLoader from 'engine/tiles/tileMapLoader'

let sge = new SimpleGameEngine()
let inputControl = new InputControl()
// console.log('inputControl', inputControl)

export function preload() {
  // .add("public/images/test-ship.png")
  // .add("public/images/test-tileset.png")
  // .add("public/images/gui-tileset.png")
  // .add("public/images/space-512-8.png")
  //.add("public/maps/tiled-test.json")
  // sge.preloadBitmapFonts([
  //   {
  //     key: 'defaultfont',
  //     file: 'source-sans-pro',
  //   }
  // ])

  sge.preloadBitmapFonts(['defaultfont'])
  sge.preloadSprites(['test-ship'])
  sge.preloadSpriteSheets(['test-tileset', 'space-512-8', 'gui-tileset'])
  sge.preloadTiledMaps(['tiled-test'])
}

let pixiMode = 'unknown'
export function run() {
  console.log('Running ship sample')

  sge.init()
  sge.createRenderer()
  let stage = sge.stage
  let renderer = sge.renderer

  preload()
  sge.preload('public/examples', () => {
    onLoaded()
  })

  let rocket: PIXI.Sprite = null
  let message: PIXI.Text = null

  let tileMap: TileMap<IGridSpot> = null
  let tileMap2: TileMap<IGridSpot> = null

  let gamepadTester: GamepadTester = null

  let bitmapFontText: PIXI.extras.BitmapText = null

  let particleEmitter1: ParticleEmitter = null
  let particleEmitter2: ParticleEmitter = null

  function onLoaded() {
    test_tileMap()
    test_tileMap2()

    test_simpleSprite()

    test_simpleShip()

    test_bitmapText()

    test_particles()

    sge.onUpdateCallback = onUpdate
    sge.startGameLoop()
  }

  function test_tileMap() {
    let defaultTextureName = 'test-tileset'
    let tileData: ITileData[] = []
    tileData.push({
      name: 'default',
      textureName: defaultTextureName,
      tx: 0,
      ty: 2,
    })
    tileData.push({
      name: 'wall-1',
      textureName: defaultTextureName,
      tx: 2,
      ty: 4,
    })
    tileMap = new TileMap<IGridSpot>(sge, 32, tileData, 1, null)
    tileMap.resize(20, 20)

    // tileMapFiller.strokeRect(tileMap, 0, 'wall-1', 0, 0, 10, 10)
    // tileMapFiller.strokeRect(tileMap, 0, 'wall-1', 2, 2, 10 - 4, 10 - 4)

    // tileMapFiller.fillRect(tileMap, 0, 'wall-1', 4, 4, 2, 2)

    // tileMap.container.position.set(25, 25)
    stage.addChild(tileMap.containers[0])
  }

  function test_tileMap2() {
    // let defaultTextureName = 'space-512-8'
    // let tileData: ITileData[] = []
    // tileData.push({
    //   name: 'default',
    //   textureName: defaultTextureName,
    //   tx: 0,
    //   ty: 0,
    // })
    // tileData.push({
    //   name: 'wall-1',
    //   textureName: defaultTextureName,
    //   tx: 2,
    //   ty: 4,
    // })
    // tileMap2 = new TileMap(sge, 64, 64, 8, tileData, 3)
    // let mapJson = sge.getJson('tiled-test')
    // tileMapLoader.load(tileMap2, mapJson, {})
    // // tileMapFiller.strokeRect(tileMap2, 'wall-1', 0, 0, 10, 10)
    // // tileMapFiller.strokeRect(tileMap2, 'wall-1', 2, 2, 10 - 4, 10 - 4)
    // // tileMapFiller.fillRect(tileMap2, 'wall-1', 4, 4, 2, 2)
    // tileMap2.containerMain.position.set(100, 100)
    // stage.addChild(tileMap2.containerMain)
  }

  function test_simpleSprite() {
    // Simple Sprite
    let sprite = new Sprite(sge.getTexture('test-ship'))

    sprite.x = 96
    sprite.y = 96
    sprite.scale.set(2, 2)
    sprite.rotation = 0.5

    stage.addChild(sprite)
  }

  function test_simpleShip() {
    // Tileset sprite
    // Create the `tileset` sprite from the texture
    let texture = sge.getTexture('test-tileset')

    let size = 32

    let rectangle = new Rectangle(size * 3, size * 2, size, size)
    texture.frame = rectangle
    rocket = new Sprite(texture)

    // Position the rocket sprite on the canvas
    rocket.x = 32
    rocket.y = 32

    // Add the rocket to the stage
    stage.addChild(rocket)
  }

  function test_gamepad() {
    let gamepadTexture = sge.getTexture('gui-tileset')
    let size = 32
    gamepadTexture.frame = new Rectangle(size * 1, size * 0, size, size)
    let gamepad = new Sprite(gamepadTexture)
    stage.addChild(gamepad)

    renderer.render(stage)

    gamepadTester = new GamepadTester()
    gamepadTester.init(sge)
  }

  function test_bitmapText() {
    // // Add bitmap text
    // bitmapFontText = new PIXI.extras.BitmapText('Bitmap fonts are\n now supported!', { font: '32px defaultfont' });
    // bitmapFontText.x = 0
    // bitmapFontText.y = 20
    // stage.addChild(bitmapFontText)
  }

  function test_particles() {
    let size = 32
    let particles1 = [[0, 0, 32, 32], [32, 32, 32, 32]]
    let particles2 = [[0, 0, 8, 8], [8, 8, 8, 8], [0, 8, 8, 8], [8, 0, 8, 8]]

    particleEmitter1 = new ParticleEmitter()
    particleEmitter1.init(sge, 'test-tileset', particles1)

    particleEmitter2 = new ParticleEmitter()
    particleEmitter2.init(sge, 'test-tileset', particles2)

    stage.addChild(particleEmitter1.container)
    stage.addChild(particleEmitter2.container)
  }

  function onUpdate() {
    if (gamepadTester) {
      gamepadTester.update()
    }

    particleEmitter1.emit(50, 50)
    particleEmitter2.emit(300, 350)

    particleEmitter1.update()
    particleEmitter2.update()

    // console.log(inputControl)
    inputControl.update()
    rocket.x += inputControl.vx
    rocket.y += inputControl.vy
    let vec = new Victor(inputControl.vx, inputControl.vy)
    if (vec.length() > 0.05) {
      rocket.anchor.set(0.5, 0.5)
      rocket.rotation = vec.angle()
    }

    // if (test_bitmapText) {
    //   bitmapFontText.text = `VX: ${inputControl.vx} VY: ${inputControl.vy}`
    // }
  }
}
