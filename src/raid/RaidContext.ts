const { Rectangle, Sprite } = PIXI
const { TextureCache } = PIXI.utils

import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { GamepadTester } from 'engine/gamepad/GamepadTester'
import { InputControl } from 'engine/gamepad/InputControl'

import * as players from './players'
import * as flightControler from './flightController'
import * as log from './log'
import * as map from './map'

const showSplashScreen = false
const useLocalServer = false

export class RaidContext {
  sge: SimpleGameEngine

  rootContainer: PIXI.Container

  layerFrameRate: PIXI.Container
  layerP1: PIXI.Container
  layerP2: PIXI.Container
  layerP3: PIXI.Container
  layerP4: PIXI.Container
  layerP5: PIXI.Container

  layerMap: PIXI.Container
  layerPlayer: PIXI.Container

  onLoaded(_sge: SimpleGameEngine) {
    let ctx = this

    ctx.sge = _sge
    ctx.rootContainer = new PIXI.Container()

    ctx.layerP1 = this.addLayer()
    ctx.layerP2 = this.addLayer()
    ctx.layerP3 = this.addLayer()
    ctx.layerP4 = this.addLayer()
    ctx.layerP5 = this.addLayer()
    ctx.layerMap = this.addLayer()
    ctx.layerPlayer = this.addLayer()
    ctx.layerFrameRate = this.addLayer()

    let player = players.create(ctx, ctx.layerPlayer)
    player.flightController = flightControler.create(ctx)

    map.create(ctx)

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
    players.updateAll(ctx)
  }
}
