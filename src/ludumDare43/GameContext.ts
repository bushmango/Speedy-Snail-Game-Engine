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

import * as goalPieces from './actors/goalPieces'
import * as uiGoal from './ui/uiGoal'

import * as goats from './actors/goats'
import * as helpArrows from './actors/helpArrows'
import * as coreSpawner from './actors/coreSpawner'
import * as engineParticles from './actors/engineParticles'

import * as debris from './actors/debris'
import * as rockets from './actors/rockets'

let debugCollision = false
let skipSplashScreen = true
let skipMainMenu = true
let currentContext: GameContext = null

let doTestDifficulty = true
let testDifficulty = 'test'

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
  layerGoat: PIXI.Container
  layerAbove: PIXI.Container
  layerBelow: PIXI.Container
  layerSmoke: PIXI.Container
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
    // camera settings
    ctx.camera.x = 0
    ctx.camera.y = 0
    ctx.camera.scale = 2
    cameras.updateAll(0, 0) // Camera hack

    ctx.layerBelow = cameras.addLayer(ctx.camera)
    ctx.layerParticles = cameras.addLayer(ctx.camera)
    ctx.layerPlayer = cameras.addLayer(ctx.camera)
    ctx.layerGoat = cameras.addLayer(ctx.camera)
    ctx.layerSmoke = cameras.addLayer(ctx.camera)
    ctx.layerAbove = cameras.addLayer(ctx.camera)
    ctx.layerDetectors = cameras.addLayer(ctx.camera)
    ctx.layerDebugGraphics = cameras.addLayer(ctx.camera)
    ctx.addLayer(ctx.camera.container)

    ctx.layerUi = this.addLayer()
    ctx.layerFrameRate = this.addLayer()

    // let player = players.create(ctx.layerPlayer)

    shipParts.createSelectors()

    menuStart.create()
    menuQuickSettings.create()
    uiGoal.create()

    coreSpawner.create()
    engineParticles.create()

    debris.create()

    let sps = shipPartSpawners.create()
    sps = shipPartSpawners.create()
    sps.position = 'bottom'

    goats.create()
    goats.eject()

    helpArrows.createAll()
    starfield.initialize()

    stats.setEasyDifficulty()

    if(doTestDifficulty) {
      stats.setDifficulty(testDifficulty)
    }
   

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

  getCameraView() {
    let ctx = getContext()
    let view = ctx.sge.getViewSize()
    return cameras.viewToCameraView(ctx.camera, view.width, view.height)
  }

  onUpdate() {
    let ctx = this
    log.x('update')

    let elapsedTimeSecRaw = ctx.sge.elapsedTimeSec
    let elapsedTimeSec = cameras.applySlowdown(ctx.camera, elapsedTimeSecRaw)

    // log.x('update', elapsedTime)
    // log.x('update')

    let mouse = ctx.sge.getMouse()
    if (mouse.isLeftJustDown) {
      // Rocket test
      // let { cx, cy } = cameras.xyToCamera(ctx.camera, mouse)
      // let c = rockets.create('rocket')
      // c.anim.sprite.x = cx
      // c.anim.sprite.y = cy
    }

    ctx.splash.update()

    // parallaxLayers.updateLayers(ctx);
    cameras.updateAll(elapsedTimeSec, elapsedTimeSecRaw)
    menuStart.update(elapsedTimeSec)
    menuQuickSettings.update(elapsedTimeSec)
    buttons.updateAll(elapsedTimeSec)
    sounds.updateAll()

    asteroids.updateAll(elapsedTimeSec)
    starfield.updateAll(elapsedTimeSec)
    // players.updateAll()
    // let curStats = ctx.stats.getCurrentStats()
    //starfield.updateAll(elapsedTimeSec, curStats.speed * 100)
    goats.updateAll(elapsedTimeSec)
    coreSpawner.updateAll(elapsedTimeSec)

    shipParts.updateAll(elapsedTimeSec)
    shipPartSpawners.updateAll(elapsedTimeSec)
    smashedParts.updateAll(elapsedTimeSec)

    uiGoal.updateAll(elapsedTimeSec)
    goalPieces.updateAll(elapsedTimeSec)
    helpArrows.updateAll(elapsedTimeSec)

    engineParticles.updateAll(elapsedTimeSec)

    debris.updateAll(elapsedTimeSec)
    rockets.updateAll(elapsedTimeSec)

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
