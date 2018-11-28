const { Rectangle, Sprite } = PIXI
const { TextureCache } = PIXI.utils

import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { GamepadTester } from 'engine/gamepad/GamepadTester'
import { InputControl } from 'engine/gamepad/InputControl'

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

import { KeyCodes } from 'engine/input/Keyboard'

let debugCollision = false

let currentContext: GameContext = null
export function getContext() {
  return currentContext
}

export class GameContext {
  sge: SimpleGameEngine

  rootContainer: PIXI.Container

  cameraLayers: PIXI.Container

  layerFrameRate: PIXI.Container
  layerMap: PIXI.Container
  layerPlayer: PIXI.Container
  layerUi: PIXI.Container
  layerDetectors: PIXI.Container
  layerDebugGraphics: PIXI.Container

  map: maps.IMap
  tilePicker: tilePickers.ITilePicker

  gfx: PIXI.Graphics

  onLoaded(_sge: SimpleGameEngine) {
    let ctx = this
    currentContext = ctx

    ctx.sge = _sge
    ctx.rootContainer = new PIXI.Container()

    ctx.cameraLayers = this.addLayer()
    ctx.layerMap = this.addCameraLayer()
    ctx.layerPlayer = this.addCameraLayer()
    ctx.layerDetectors = this.addCameraLayer()
    ctx.layerUi = this.addLayer()
    ctx.layerDebugGraphics = this.addCameraLayer()
    ctx.layerFrameRate = this.addLayer()

    // let player = players.create(ctx.layerPlayer)
    // player.flightController = flightController.create(ctx)

    // uiExpBar.create()

    let map = (this.map = maps.create(ctx.layerMap))
    let jsonTiles = this.sge.getJson('tiled-tiles')
    tilesLoader.load(jsonTiles)
    let jsonMap = this.sge.getJson('map-shelter-001')
    mapLoader.load(map, jsonTiles, jsonMap)

    ctx.tilePicker = tilePickers.create(ctx.layerPlayer)

    // log.x('map loaded', jsonMap)

    // camera?
    ctx.cameraLayers.position.x = 50
    ctx.cameraLayers.position.y = 50
    ctx.cameraLayers.scale.set(2, 2)

    ctx.sge.stage.addChild(ctx.rootContainer)
    // Move frame rate text layer
    ctx.sge.stage.removeChild(ctx.sge.frameRateText)
    ctx.layerFrameRate.addChild(ctx.sge.frameRateText)
    ctx.sge.stage.addChild(ctx.layerFrameRate)
    //this.rootContainer.addChild(this.modeBar.container)
  }

  addLayer(container: PIXI.Container = null) {
    if (!container) {
      container = new PIXI.Container()
    }
    this.rootContainer.addChild(container)
    return container
  }
  addCameraLayer(container: PIXI.Container = null) {
    if (!container) {
      container = new PIXI.Container()
    }
    //container.scale.set(2, 2)
    this.cameraLayers.addChild(container)
    return container
  }

  onUpdate() {
    let ctx = this
    log.x('update')

    // parallaxLayers.updateLayers(ctx);
    flightController.updateAll(ctx)
    maps.updateAll(ctx.cameraLayers)
    tilePickers.updateAll()

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