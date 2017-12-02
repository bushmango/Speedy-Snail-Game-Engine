
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

import * as spriteCreator from 'ludumDare40/util/spriteCreator'

const turn = Math.PI * 2

let hats = [
  {
    y: 2,
    x: 1,
  },
  {
    y: 2,
    x: 2,
  },
  {
    y: 2,
    x: 3,
  },
  {
    y: 2,
    x: 4,
  },
  {
    y: 2,
    x: 5,
  },
]

export class Player {

  sge: SimpleGameEngine
  container = new PIXI.Container

  body: PIXI.Sprite
  head: PIXI.Sprite

  hats: PIXI.Sprite[] = []

  x = 100
  y = 100

  init(_sge: SimpleGameEngine) {
    this.sge = _sge

    this.body = spriteCreator.createSprite16(this.sge, 'ase-512-16', 1, 1)
    this.body.anchor.set(0.5, 0)
    this.head = spriteCreator.createSprite16(this.sge, 'ase-512-16', 1, 2)
    this.head.anchor.set(0.5, 0)

    this.container.addChild(this.body)
    this.container.addChild(this.head)

    for (let i = 0; i < 10; i++) {
      this.addHat()
    }

  }
  update() {
    this.body.position.set(this.x, this.y)
    this.head.position.set(this.x, this.y - 16)
    _.forEach(this.hats, (c, cIdx) => {
      c.position.set(this.x + 1, this.y - 16 - 8 + 1 + 12 - 3 * cIdx)
    })
  }

  addHat() {

    let hatData = _.sample(hats)

    let hat = spriteCreator.createSprite16(this.sge, 'ase-512-16', hatData.y, hatData.x)
    hat.anchor.set(0.5, 0.5)
    this.hats.push(hat)
    this.container.addChild(hat)
  }

}

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

  rootContainer: PIXI.Container = new PIXI.Container()
  rootContainerUI: PIXI.Container = new PIXI.Container()

  layerObjects: PIXI.Container
  ship: Ship

  player: Player

  onLoaded(_sge: SimpleGameEngine) {
    this.sge = _sge

    _sge.renderer.transparent = false
    // Force color property
    let r: any = _sge.renderer
    r.backgroundColor = 0xFF333333

    this.initTileMap()
    this.initShip()

    this.player = new Player()
    this.player.init(_sge)

    this.menuManager.init(this.sge)

    this.rootContainer.visible = false
    this.rootContainerUI.visible = false
    this.splash = new SplashScreen()
    this.splash.init(this.sge, 'prariesnailgames', () => {
      this.rootContainer.visible = true
      this.rootContainerUI.visible = true
    })

    // Add layers
    //this.addLayer(this.tileMap.containers[0])
    this.layerObjects = this.addLayer()
    //this.layerObjects.addChild(this.ship.ship)

    this.layerObjects.addChild(this.player.container)

    this.addLayerUI(this.menuManager.menuManager.container)
    this.addLayerUI(this.menuManager.container)

    this.sge.stage.addChild(this.rootContainer)
    this.rootContainer.scale.set(4)
    this.sge.stage.addChild(this.rootContainerUI)
    this.sge.stage.addChild(this.splash.container)

    this.rootContainer.scale

  }

  addLayer(container: PIXI.Container = null) {
    if (!container) {
      container = new PIXI.Container()
    }
    this.rootContainer.addChild(container)
    return container
  }
  addLayerUI(container: PIXI.Container = null) {
    if (!container) {
      container = new PIXI.Container()
    }
    this.rootContainerUI.addChild(container)
    return container
  }

  onUpdate() {
    this.splash.update()
    this.ship.update()

    this.player.update()

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

