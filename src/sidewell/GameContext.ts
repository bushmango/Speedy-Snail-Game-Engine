const { Rectangle, Sprite } = PIXI
const { TextureCache } = PIXI.utils

import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { GamepadTester } from 'engine/gamepad/GamepadTester'
import { InputControl } from 'engine/gamepad/InputControl'

import { ParticleEmitter } from 'engine/particles/ParticleEmitter'

import * as flightController from './flightController'
import * as players from './actors/players'
import * as wallPieces from './actors/wallPieces'
import * as wallStacks from './actors/wallStacks'
import * as wallStacksGenerator2 from './actors/wallStacksGenerator2'
import * as scroller from './actors/scroller'

import * as coins from './actors/coins'
import * as enemies from './actors/enemies'

import * as log from 'engine/log'
import * as maps from './map/maps'
import * as mapLoader from './map/mapLoader'
import * as tilesLoader from './map/tilesLoader'

import * as sounds from './sounds/sounds'

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
  // layerMap: PIXI.Container

  layerMapBack: PIXI.Container
  layerMapCollision: PIXI.Container
  layerPlayer: PIXI.Container
  layerMapFore: PIXI.Container
  layerUi: PIXI.Container
  layerDetectors: PIXI.Container

  layerDebugGraphics: PIXI.Container

  map: maps.IMap
  camera: cameras.ICamera

  gfx: PIXI.Graphics
  sfx = sounds
  stats = stats
  uiMode = uiMode

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
    ctx.layerMapBack = cameras.addLayer(ctx.camera)
    ctx.layerMapCollision = cameras.addLayer(ctx.camera)
    ctx.layerPlayer = cameras.addLayer(ctx.camera)
    ctx.layerMapFore = cameras.addLayer(ctx.camera)
    ctx.layerDetectors = cameras.addLayer(ctx.camera)
    ctx.layerDebugGraphics = cameras.addLayer(ctx.camera)
    ctx.addLayer(ctx.camera.container)
    ctx.layerUi = this.addLayer()
    ctx.layerFrameRate = this.addLayer()

    menuStart.create()
    menuQuickSettings.create()

    ctx.player1 = players.create()
    ctx.player1.flightController = flightController.create(ctx)

    wallStacksGenerator2.generate()

    let particles1 = [[0, 0, 32, 32], [32, 32, 32, 32]]
    ctx.particleEmitter1 = new ParticleEmitter()
    ctx.particleEmitter1.init(ctx.sge, 'player1', particles1)
    ctx.addLayer(ctx.particleEmitter1.container)

    // Camera
    ctx.camera.x = 0
    ctx.camera.y = 0
    ctx.camera.scale = 2

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

  getCameraView() {
    let ctx = getContext()
    let view = ctx.sge.getViewSize()
    return cameras.viewToCameraView(ctx.camera, view.width, view.height)
  }
  getCameraWorldPos() {
    let ctx = getContext()
    return cameras.cameraWorldPos(ctx.camera)
  }

  onUpdate() {
    let ctx = this

    let elapsedTimeSecRaw = ctx.sge.elapsedTimeSec
    let elapsedTimeSec = cameras.applySlowdown(ctx.camera, elapsedTimeSecRaw)

    // log.x('update', elapsedTime)
    // log.x('update')

    ctx.splash.update()

    maps.updateAll(ctx.camera.container)

    menuStart.update(elapsedTimeSec)
    menuQuickSettings.update(elapsedTimeSec)
    buttons.updateAll(elapsedTimeSec)

    flightController.updateAll(ctx)
    players.updateAll(elapsedTimeSec)

    scroller.update(elapsedTimeSec)
    cameras.updateAll(elapsedTimeSec, elapsedTimeSecRaw)

    wallStacksGenerator2.update(elapsedTimeSec)
    wallStacks.updateAll(elapsedTimeSec)
    wallPieces.updateAll(elapsedTimeSec)

    let kb = ctx.sge.keyboard

    if (kb.justPressed(KeyCodes.space)) {
      cameras.frameDelay(ctx.camera, 0.25)
    }
    if (kb.isPressed(KeyCodes.s)) {
      cameras.frameSlowdown(ctx.camera, 0.1, 0.25)
    }

    if (ctx.uiMode.getMode() === 'game') {
      let mouse = ctx.sge.getMouse()
    }

    ctx.particleEmitter1.update(elapsedTimeSec)

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
