const { Rectangle, Sprite } = PIXI
const { TextureCache } = PIXI.utils

import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { GamepadTester } from 'engine/gamepad/GamepadTester'
import { InputControl } from 'engine/gamepad/InputControl'

import { ParticleEmitter } from 'engine/particles/ParticleEmitter'

import * as players from './actors/players'
import * as coins from './actors/coins'
import * as enemies from './actors/enemies'
import * as flightController from './flightController'
import * as uiExpBar from './ui/uiExpBar'
import * as log from '../engine/log'
import * as maps from './map/maps'
import * as mapLoader from './map/mapLoader'
import * as tilesLoader from './map/tilesLoader'

import * as tilePickers from './actors/tilePickers'
import * as mouseTrails from './actors/mouseTrails'
import * as stretchyBois from './actors/stretchyBois'
import * as sounds from './sounds/sounds'

import * as uiHearts from './ui/uiHearts'

import * as backgroundColorChanger from './misc/backgroundColorChanger'
import * as cameras from 'engine/camera/cameras'
import { KeyCodes } from 'engine/input/Keyboard'

import * as stats from './misc/stats'

import * as buttons from './menu/buttons'
import * as menuStart from './menu/menuStart'
import * as menuQuickSettings from './menu/menuQuickSettings'
import * as uiMode from './ui/uiMode'

import { SplashScreen } from 'engine/misc/SplashScreen'

let final = false

export function getIsFinal() {
  return final
}

let debugCollision = false
let skipSplashScreen = true && !final
let skipMainMenu = true && !final
let currentContext: GameContext = null

export function getContext() {
  return currentContext
}

export class GameContext {
  sge: SimpleGameEngine

  rootContainer: PIXI.Container
  splash: SplashScreen

  //cameraLayer: PIXI.Container

  layerFrameRate: PIXI.Container
  layerMap: PIXI.Container
  layerPlayer: PIXI.Container
  layerUi: PIXI.Container
  layerDetectors: PIXI.Container

  layerDebugGraphics: PIXI.Container

  layerMouseTrail: PIXI.Container

  map: maps.IMap
  tilePicker: tilePickers.ITilePicker
  camera: cameras.ICamera

  gfx: PIXI.Graphics
  sfx = sounds
  stats = stats
  uiMode = uiMode

  stretchyBoi: stretchyBois.IStretchyBoi

  player1: players.IPlayer

  // Particles
  particleEmitter1: ParticleEmitter

  createSprite(spriteSheet, frame: PIXI.Rectangle, anchorX, anchorY, scale) {
    let ctx = getContext()
    let baseTex = ctx.sge.getTexture(spriteSheet)
    let tex = new PIXI.Texture(baseTex.baseTexture, frame)
    let sprite = new PIXI.Sprite(tex)
    sprite.anchor.set(anchorX, anchorY)
    sprite.y = 0
    sprite.x = 0
    sprite.scale.set(scale)
    return sprite
  }

  onLoaded(_sge: SimpleGameEngine) {
    // Force unmute
    // settingsGeneric.updateSettings({ muteSound: false })

    let ctx = this
    currentContext = ctx

    ctx.sge = _sge
    ctx.rootContainer = new PIXI.Container()

    ctx.camera = cameras.create()
    ctx.layerMap = cameras.addLayer(ctx.camera)
    ctx.layerPlayer = cameras.addLayer(ctx.camera)
    ctx.layerDetectors = cameras.addLayer(ctx.camera)
    ctx.layerDebugGraphics = cameras.addLayer(ctx.camera)
    ctx.addLayer(ctx.camera.container)

    ctx.layerUi = this.addLayer()

    ctx.layerMouseTrail = this.addLayer()
    ctx.layerFrameRate = this.addLayer()

    uiHearts.create()

    //buttons.create('hello button')
    // buttons.create('')

    menuStart.create()
    menuQuickSettings.create()

    // let player = players.create(ctx.layerPlayer)

    // uiExpBar.create()

    // let map = (this.map = maps.create(ctx.layerMap))
    // let jsonTiles = this.sge.getJson('tiled-tiles')
    // tilesLoader.load(jsonTiles)
    // let jsonMap = this.sge.getJson('map-shelter-001')
    // mapLoader.load(map, jsonTiles, jsonMap)
    // ctx.tilePicker = tilePickers.create(ctx.layerPlayer)

    // stretchyBois.create()
    // ctx.stretchyBoi = stretchyBois.create()
    // ctx.stretchyBoi.anim.sprite.x -= 100
    // ctx.stretchyBoi.anim.sprite.y -= 50
    // ctx.stretchyBoi.frame = 30

    ctx.player1 = players.create()
    ctx.player1.flightController = flightController.create(ctx)

    // log.x('map loaded', jsonMap)

    for (let i = 0; i < 5; i++) {
      let item = mouseTrails.create(ctx.layerMouseTrail)
      item.rate = 0.2 * (i / 5)
    }

    let particles1 = [[0, 0, 32, 32], [32, 32, 32, 32]]
    ctx.particleEmitter1 = new ParticleEmitter()
    ctx.particleEmitter1.init(ctx.sge, 'player1', particles1)
    ctx.addLayer(ctx.particleEmitter1.container)

    // camera?
    ctx.camera.x = 50
    ctx.camera.y = 50
    ctx.camera.scale = 2
    // ctx.cameraLayers.position.x = 50
    // ctx.cameraLayers.position.y = 50
    // ctx.cameraLayers.scale.set(2, 2)

    ctx.sge.stage.addChild(ctx.rootContainer)
    // Move frame rate text layer
    ctx.sge.stage.removeChild(ctx.sge.frameRateText)
    ctx.layerFrameRate.addChild(ctx.sge.frameRateText)
    ctx.sge.stage.addChild(ctx.layerFrameRate)
    //this.rootContainer.addChild(this.modeBar.container)

    ctx.splash = new SplashScreen()

    ctx.splash.init(this.sge, 'prariesnailgames', () => {
      if (skipMainMenu) {
        menuStart.slideOut()
        uiMode.setMode('game')
      } else {
        menuStart.slideIn()
      }

      this.rootContainer.visible = true
      //this.rootContainerUI.visible = true
    })
    ctx.sge.stage.addChild(this.splash.container)
    if (skipSplashScreen) {
      ctx.splash.skip()
    }

    ctx.sge.onResize = () => {
      menuQuickSettings.onResize()
    }
  }

  addLayer(container: PIXI.Container = null) {
    if (!container) {
      container = new PIXI.Container()
    }
    this.rootContainer.addChild(container)
    return container
  }

  onUpdate() {
    let ctx = this

    let elapsedTimeSecRaw = ctx.sge.elapsedTimeSec
    let elapsedTimeSec = cameras.applySlowdown(ctx.camera, elapsedTimeSecRaw)

    // log.x('update', elapsedTime)
    // log.x('update')

    ctx.splash.update()

    // parallaxLayers.updateLayers(ctx);

    cameras.updateAll(elapsedTimeSec, elapsedTimeSecRaw)
    maps.updateAll(ctx.camera.container)
    // tilePickers.updateAll()
    mouseTrails.updateAll()

    stretchyBois.updateAll(elapsedTimeSec)

    menuStart.update(elapsedTimeSec)
    menuQuickSettings.update(elapsedTimeSec)
    buttons.updateAll(elapsedTimeSec)

    uiHearts.update(elapsedTimeSec)

    flightController.updateAll(ctx)
    players.updateAll(elapsedTimeSec)

    // if (_.random(true) < 0.1) {
    //   ctx.particleEmitter1.emit(50, 50)
    // }

    let kb = ctx.sge.keyboard

    if (kb.justPressed(KeyCodes.space)) {
      cameras.frameDelay(ctx.camera, 0.25)
    }
    if (kb.isPressed(KeyCodes.s)) {
      cameras.frameSlowdown(ctx.camera, 0.1, 0.25)
    }

    if (ctx.uiMode.getMode() === 'game') {
      let mouse = ctx.sge.getMouse()
      // log.json(mouse)
      if (mouse.isLeftDown) {
        ctx.particleEmitter1.emit(mouse.x, mouse.y)
        backgroundColorChanger.setRandom()
      } else {
      }

      // ctx.stretchyBoi.anim.sprite.tint = ctx.sge.renderer.backgroundColor

      if (mouse.isRightDown) {
        cameras.shake(ctx.camera, 0.2, 5)
        backgroundColorChanger.cycleColor(elapsedTimeSec)
        ctx.sfx.playExplode()
      }

      if (mouse.isLeftJustDown) {
        ctx.stats.addLife(1)
      }
      if (mouse.isRightJustUp) {
        ctx.stats.addLife(-1)
      }
    }

    ctx.particleEmitter1.update(elapsedTimeSec)

    // players.updateAll()
    // coins.updateAll()
    // enemies.updateAll()

    // uiExpBar.update()

    // Debugging
    if (ctx.sge.keyboard.justPressed(KeyCodes.r)) {
      debugCollision = !debugCollision
    }
    if (ctx.gfx) {
      ctx.gfx.clear()
    }
    if (debugCollision) {
      if (!ctx.gfx) {
        ctx.gfx = new PIXI.Graphics()
        ctx.layerDebugGraphics.addChild(ctx.gfx)
      }

      coins.drawDebug(ctx.gfx)
    }
  }
}
