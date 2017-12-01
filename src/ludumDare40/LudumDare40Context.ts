
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

import { MenuManager } from 'ludumDare40/menu/MenuManager'
import { SplashScreen } from 'engine/misc/SplashScreen';


const turn = Math.PI * 2

export class Ship {
  sge: SimpleGameEngine
  ship: PIXI.Sprite

  init(_sge: SimpleGameEngine) {
    this.sge = _sge

    let texture = this.sge.getTexture("test-tileset")
    let size = 32
    let rectangle = new Rectangle(size * 3, size * 2, size, size)
    texture.frame = rectangle
    this.ship = new Sprite(texture)
    this.ship.x = 32 + 300
    this.ship.y = 32 + 300
    this.ship.anchor.set(0.5, 0.5)

  }
  update() {
    this.ship.rotation += turn / (60 * 4)
  }

}

export class LudumDare40Context {

  sge: SimpleGameEngine
  tileMap: TileMap<IGridSpot>
  menuManager = new MenuManager()

  splash: SplashScreen

  rootContainer: PIXI.Container
  layerObjects: PIXI.Container
  ship: Ship
  onLoaded(_sge: SimpleGameEngine) {
    this.sge = _sge

    this.rootContainer = new PIXI.Container()

    this.initTileMap()
    this.initShip()

    this.menuManager.init(this.sge)

    this.rootContainer.visible = false
    this.splash = new SplashScreen()
    this.splash.init(this.sge, 'prariesnailgames', () => {
      this.rootContainer.visible = true
    })

    // Add layers
    this.addLayer(this.tileMap.containers[0])
    this.layerObjects = this.addLayer()
    this.layerObjects.addChild(this.ship.ship)
    this.addLayer(this.menuManager.menuManager.container)
    this.addLayer(this.menuManager.container)

    this.sge.stage.addChild(this.rootContainer)
    this.sge.stage.addChild(this.splash.container)

  }

  addLayer(container: PIXI.Container = null) {
    if(!container) {
      container = new PIXI.Container()
    }
    this.rootContainer.addChild(container)
    return container
  }

  onUpdate() {
    this.splash.update()
    this.ship.update()
    this.menuManager.update()
  }

  initShip() {
    this.ship = new Ship()
    this.ship.init(this.sge)
  }

  initTileMap() {
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
    this.tileMap = new TileMap<IGridSpot>(this.sge, 32, tileData, 1, null)
    this.tileMap.resize(20, 20)

    tileMapFiller.strokeRect(this.tileMap, 0, 'wall-1', 0, 0, 10, 10)
    tileMapFiller.fillRect(this.tileMap, 0, 'default', 1, 1, 8, 8)
    let layer = this.tileMap.containers[0]
    layer.x = 350
    layer.y = 200


  }
}

