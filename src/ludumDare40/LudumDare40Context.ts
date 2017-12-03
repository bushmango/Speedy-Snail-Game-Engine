
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
import { Blob, BlobManager } from 'ludumDare40/entities/Blob'
import { ParticleManager } from 'ludumDare40/entities/ParticleManager';
import { BoundsDrawer } from 'ludumDare40/entities/BoundsDrawer';

import * as collisions from './entities/collisions'
import * as mapLoader from 'ludumDare40/map/MapLoader';
import { ILD40GridSpot } from 'ludumDare40/map/ILD40GridSpot';
import { Layer_Background, IMapMedatada } from 'ludumDare40/map/MapLoader';

const turn = Math.PI * 2

export class LudumDare40Context {

  sge: SimpleGameEngine
  tileMap: TileMap<ILD40GridSpot>
  mapMeta: IMapMedatada
  menuManager = new MenuManager()

  splash: SplashScreen

  rootContainer: PIXI.Container = new PIXI.Container()
  rootContainerUI: PIXI.Container = new PIXI.Container()

  layerObjects: PIXI.Container
  layerParticles: PIXI.Container
  layerBounds: PIXI.Container
  layerMarkers: PIXI.Container

  player: Player

  particles = new ParticleManager()
  boundsDrawer = new BoundsDrawer()

  blobs = new BlobManager()

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

    this.particles.init(this.sge)

    // Add layers
    this.addLayer(this.tileMap.containers[mapLoader.Layer_Background])
    this.addLayer(this.tileMap.containers[mapLoader.Layer_BackgroundDecor])

    this.addLayer(this.tileMap.containers[mapLoader.Layer_Wall])

    this.layerObjects = this.addLayer()

    this.addLayer(this.tileMap.containers[mapLoader.Layer_Decor])
    this.layerMarkers = this.addLayer(this.tileMap.containers[mapLoader.Layer_Marker])
    this.layerMarkers.visible = false wd

    this.layerParticles = this.addLayer()
    this.layerParticles.addChild(this.particles.container)


    this.layerBounds = this.addLayer()

    this.boundsDrawer.init(this)
    this.layerBounds.addChild(this.boundsDrawer.container)

    //this.layerObjects.addChild(this.ship.ship)

    this.addLayerUI(this.menuManager.menuManager.container)
    this.addLayerUI(this.menuManager.container)

    this.player = new Player()
    this.player.init(this)
    this.layerObjects.addChild(this.player.container)

    this.blobs.init(this)
    // for (let i = 0; i < 3; i++) {
    //   this.blobs.createAt(130 + i * 40, 0)
    // }

    this.sge.stage.addChild(this.rootContainer)
    this.rootContainer.scale.set(4)
    this.rootContainer.position.set(0, 400)
    this.sge.stage.addChild(this.rootContainerUI)
    this.sge.stage.addChild(this.splash.container)

    // Set player to spawn
    let spawn = this.mapMeta.spawn
    this.player.moveTo(spawn.bx * 16 + 8, spawn.by * 16 + 14)

    // Spawn blobs
    _.forEach(this.mapMeta.blobs, (c) => {
      this.blobs.createAt(c.bx * 16 + 8, c.by * 16 + 8)
    })

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

    this.boundsDrawer.clear()

    this.splash.update()

    this.player.update()

    this.blobs.update()

    // Draw bounds
    this.boundsDrawer.draw(this.player)
    this.blobs.drawBounds(this.boundsDrawer)

    // Check collisions
    _.forEach(this.blobs.items, (c) => {

      let p = this.player
      let b = c

      if (collisions.isRectOverlap(p, b)) {
        if (p.boundsY2 < b.boundsY2 && p.vy > 0) {
          // Stomp
          //this.particles.emitBlobParts(b.body.texture.frame, (b.boundsX1 + b.boundsX2) / 2, b.boundsY2)

          if (!b.isReadyToBeDestroyed) {
            b.destroy()
            _.forEach(b.hats.hats, (c) => {
              p.hats.addHat()
            })
          }



        }

      }
    })

    // camera
    let { width, height } = this.sge.getViewSize()
    let x = (-this.player.boundsX1 * this.rootContainer.scale.x)
    let y = (-this.player.boundsY1 * this.rootContainer.scale.y)
    this.rootContainer.position.set(x + width / 2, y + height / 2)


    // this.particles.emitBlobParts(this.blobs[0].body.texture.frame, this.player.subX / 32, this.player.subY / 32)

    this.particles.update()

    this.menuManager.update()
  }


  initTileMap() {
    let defaultTextureName = 'ase-512-16'
    let tileData: ITileData[] = []
    tileData.push({
      name: 'default',
      textureName: defaultTextureName,
      tx: 0,
      ty: 0,
    })

    this.tileMap = new TileMap(
      this.sge,
      16,
      tileData,
      mapLoader.Num_Layers,
      (sprites, bx, by) => {
        let gridSpot: ILD40GridSpot = {
          sprites,
          bx,
          by,
          canMove: true,
        }
        return gridSpot
      })

    this.mapMeta = mapLoader.createMetaData()
    let mapJson = this.sge.getJson('map-test')
    let { width, height } = mapJson
    this.tileMap.resize(width, height)

    tileMapFiller.fillRect(this.tileMap, mapLoader.Layer_Background, 'default', 0, 0, 20, 20)

    mapLoader.load(this.tileMap, this.mapMeta, mapJson, {})


  }
}

