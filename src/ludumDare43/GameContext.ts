import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'

// import * as players from './actors/players'
import { KeyCodes } from 'engine/input/Keyboard'
import * as log from '../engine/log'

import * as buttons from './menu/buttons'
import * as menuStart from './menu/menuStart'
import * as menuQuickSettings from './menu/menuQuickSettings'
import { SplashScreen } from 'engine/misc/SplashScreen'

import * as sounds from './sounds/sounds'
import * as cameras from 'engine/camera/cameras'
import * as stats from './misc/stats'
import * as uiMode from './ui/uiMode'

import * as shipParts from './actors/shipParts'
import * as shipPartSpawners from './actors/shipPartSpawners'

import * as asteroids from './actors/asteroids'
import * as smashedParts from './actors/smashedParts'

import * as starfield from './actors/starfield'

let debugCollision = false
let skipSplashScreen = true
let skipMainMenu = true
let currentContext: GameContext = null
export function getContext() {
  return currentContext
}

export class GameContext {
  sge: SimpleGameEngine

  rootContainer: PIXI.Container
  splash: SplashScreen

  // Pass-thru
  sfx = sounds
  stats = stats
  uiMode = uiMode
  menuStart = menuStart

  layerFrameRate: PIXI.Container

  layerParticles: PIXI.Container
  layerPlayer: PIXI.Container
  layerAbove: PIXI.Container
  layerBelow: PIXI.Container
  layerUi: PIXI.Container
  layerDetectors: PIXI.Container
  layerDebugGraphics: PIXI.Container

  camera: cameras.ICamera

  gfx: PIXI.Graphics

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
    let ctx = this
    currentContext = ctx

    ctx.sge = _sge
    ctx.rootContainer = new PIXI.Container()

    ctx.camera = cameras.create()
    ctx.layerBelow = cameras.addLayer(ctx.camera)
    ctx.layerParticles = cameras.addLayer(ctx.camera)
    ctx.layerPlayer = cameras.addLayer(ctx.camera)
    ctx.layerAbove = cameras.addLayer(ctx.camera)
    ctx.layerDetectors = cameras.addLayer(ctx.camera)
    ctx.layerDebugGraphics = cameras.addLayer(ctx.camera)
    ctx.addLayer(ctx.camera.container)

    ctx.layerUi = this.addLayer()
    ctx.layerFrameRate = this.addLayer()

    // let player = players.create(ctx.layerPlayer)

    menuStart.create()
    menuQuickSettings.create()

    let sp = shipParts.create()
    sp.isFree = false
    sp.anim.sprite.x = 200
    sp.anim.sprite.y = 200
    shipParts.setShipGridCenter(sp)

    let sps = shipPartSpawners.create()
    sps.x = 600
    sps.y = 20
    sps = shipPartSpawners.create()
    sps.x = 600
    sps.y = 400

    starfield.initialize()

    // camera?
    ctx.camera.x = 50
    ctx.camera.y = 50
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

  toggleZoom() {
    let ctx = getContext()
    ctx.camera.scale++
    if (ctx.camera.scale === 3) {
      ctx.camera.scale = 1
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
    log.x('update')

    let elapsedTimeSecRaw = ctx.sge.elapsedTimeSec
    let elapsedTimeSec = cameras.applySlowdown(ctx.camera, elapsedTimeSecRaw)

    // TODO: Get ship velocity
    let velocity = -0;

    // log.x('update', elapsedTime)
    // log.x('update')

    ctx.splash.update()

    // parallaxLayers.updateLayers(ctx);
    cameras.updateAll(elapsedTimeSec, elapsedTimeSecRaw)
    menuStart.update(elapsedTimeSec)
    menuQuickSettings.update(elapsedTimeSec)
    buttons.updateAll(elapsedTimeSec)

    asteroids.updateAll(elapsedTimeSec)
    starfield.updateAll(elapsedTimeSec, velocity);
    // players.updateAll()

    shipParts.updateAll(elapsedTimeSec)
    shipPartSpawners.updateAll(elapsedTimeSec)
    smashedParts.updateAll(elapsedTimeSec)

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
    }
  }
}
