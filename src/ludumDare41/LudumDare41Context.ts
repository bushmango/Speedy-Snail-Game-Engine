
const { Rectangle, Sprite } = PIXI
const { TextureCache } = PIXI.utils

import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { GamepadTester } from 'engine/gamepad/GamepadTester'
import { InputControl } from 'engine/gamepad/InputControl'

import { TileMap, ITileData, IGridSpot } from 'engine/tiles/TileMap'
import { ParticleEmitter } from 'engine/particles/ParticleEmitter'

import * as tileMapFiller from 'engine/tiles/tileMapFiller'
// import * as tileMapLoader from 'snakeBattle/tiles/tileMapLoader'

import { MenuManager } from 'ludumDareStart/menu/MenuManager'
import { SplashScreen } from 'engine/misc/SplashScreen'
import { Ninja, NinjaManager } from 'ludumDare41/entities/Ninja'
import { Card, CardManager } from 'ludumDare41/entities/Card'

const showSplashScreen = false

export class LudumDare41Context {

  sge: SimpleGameEngine
  tileMap: TileMap<IGridSpot>
  menuManager = new MenuManager()

  splash: SplashScreen

  rootContainer: PIXI.Container

  layerObjects: PIXI.Container
  layerCards: PIXI.Container

  ninjas = new NinjaManager()
  cards = new CardManager()

  scale = 3
  mx = 50
  my = 50

  setLayerSettings(layer: PIXI.Container) {

    layer.position.set(this.mx, this.my)
    layer.scale.set(this.scale)
  }

  onLoaded(_sge: SimpleGameEngine) {
    this.sge = _sge

    this.rootContainer = new PIXI.Container()

    this.initTileMap()

    this.menuManager.init(this.sge)

    if (showSplashScreen) {
      this.rootContainer.visible = false
      this.splash = new SplashScreen()
      this.splash.init(this.sge, 'prariesnailgames', () => {
        this.rootContainer.visible = true
      })
    }

    // Add layers

    this.addLayer(this.tileMap.containers[0])
    this.layerObjects = this.addLayer()
    this.layerCards = this.addLayer()
    this.addLayer(this.menuManager.menuManager.container)
    this.addLayer(this.menuManager.container)

    this.setLayerSettings(this.tileMap.containers[0])
    this.setLayerSettings(this.layerObjects)

    this.ninjas.init(this)
    // this.addLayer(this.ninjas.container)
    this.ninjas.createAt(0, 0)
    this.ninjas.createAt(2, 0)
    this.ninjas.createAt(0, 3)
    this.ninjas.createAt(3, 3)

    this.cards.init(this)

    let cardSize = 4*8*3
    let cx = this.mx + cardSize/2
    let cy = this.my + 22 * 8 * this.scale + cardSize/2 + 2
    this.layerCards.position.set(cx, cy)
    this.layerCards.scale.set(4)

    for (let i = 0; i < 6; i++) {
      this.cards.createAt((8 * 3 + 2) * i, 0)
    }

    this.sge.stage.addChild(this.rootContainer)
    if (showSplashScreen) {
      this.sge.stage.addChild(this.splash.container)
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
    if (showSplashScreen) {
      this.splash.update()
    }
    this.ninjas.update()
    this.cards.update()
    this.menuManager.update()
  }

  initTileMap() {
    let defaultTextureName = 'ase-512-8'
    let tileData: ITileData[] = []
    tileData.push({
      name: 'default',
      textureName: defaultTextureName,
      tx: 1,
      ty: 2,
    })
    tileData.push({
      name: 'wall-1',
      textureName: defaultTextureName,
      tx: 2,
      ty: 2,
    })
    tileData.push({
      name: 'tree-1',
      textureName: defaultTextureName,
      tx: 3,
      ty: 2,
    })
    this.tileMap = new TileMap<IGridSpot>(this.sge, 8, tileData, 1, null)
    this.tileMap.resize(22, 22)

    tileMapFiller.strokeRect(this.tileMap, 0, 'wall-1', 0, 0, 22, 22)
    tileMapFiller.fillRect(this.tileMap, 0, 'default', 1, 1, 22 - 2, 22 - 2)


  }
}

