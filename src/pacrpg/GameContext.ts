const { Rectangle, Sprite } = PIXI
const { TextureCache } = PIXI.utils

import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { GamepadTester } from 'engine/gamepad/GamepadTester'
import { InputControl } from 'engine/gamepad/InputControl'

import * as players from './actors/players'
import * as flightControler from './flightController'

import * as log from '../engine/log'
import * as maps from './map/maps'
import * as mapLoader from './map/mapLoader'

let currentContext: GameContext = null
export function getContext() {
  return currentContext
}

export class GameContext {
  sge: SimpleGameEngine

  rootContainer: PIXI.Container

  layerFrameRate: PIXI.Container
  layerMap: PIXI.Container
  layerPlayer: PIXI.Container
  layerDetectors: PIXI.Container

  map: maps.IMap

  onLoaded(_sge: SimpleGameEngine) {
    let ctx = this
    currentContext = ctx

    ctx.sge = _sge
    ctx.rootContainer = new PIXI.Container()

    ctx.layerMap = this.addLayer()
    ctx.layerPlayer = this.addLayer()
    ctx.layerDetectors = this.addLayer()
    ctx.layerFrameRate = this.addLayer()

    let player = players.create(ctx.layerPlayer)
    player.flightController = flightControler.create(ctx)

    let map = (this.map = maps.create(ctx.layerMap))
    let jsonTiles = this.sge.getJson('tiled-tiles')
    let jsonMap = this.sge.getJson('map-pac-001')
    mapLoader.load(map, jsonTiles, jsonMap)

    // log.x('map loaded', jsonMap)

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

  onUpdate() {
    let ctx = this
    log.x('update')

    // parallaxLayers.updateLayers(ctx);
    flightControler.updateAll(ctx)
    players.updateAll()
  }
}
