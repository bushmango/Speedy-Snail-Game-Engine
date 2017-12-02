
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

import { Player } from 'ludumDare40/entities/Player'
import { Blob } from 'ludumDare40/entities/Blob'

const turn = Math.PI * 2

export class LudumDare40Context {

  sge: SimpleGameEngine
  tileMap: TileMap<IGridSpot>
  menuManager = new MenuManager()

  splash: SplashScreen

  rootContainer: PIXI.Container = new PIXI.Container()
  rootContainerUI: PIXI.Container = new PIXI.Container()

  layerObjects: PIXI.Container

  player: Player

  blobs: Blob[] = []

  onLoaded(_sge: SimpleGameEngine) {
    this.sge = _sge

    _sge.renderer.transparent = false
    // Force color property
    let r: any = _sge.renderer
    r.backgroundColor = 0xFF333333

    this.initTileMap()




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


    this.addLayerUI(this.menuManager.menuManager.container)
    this.addLayerUI(this.menuManager.container)


    this.player = new Player()
    this.player.init(_sge)
    this.layerObjects.addChild(this.player.container)

    this.player.moveTo(200, 200)    

    for (let i = 0; i < 3; i++) {
      let blob = new Blob()
      blob.init(_sge)
      blob.moveTo(130 + i * 40, 0)
      this.blobs.push(blob)
      this.layerObjects.addChild(blob.container)
    }

    this.sge.stage.addChild(this.rootContainer)
    this.rootContainer.scale.set(4)
    this.rootContainer.position.set(0, 400)
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

    this.player.update()

    _.forEach(this.blobs, (c) => {
      c.update()
    })

    this.menuManager.update()
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

