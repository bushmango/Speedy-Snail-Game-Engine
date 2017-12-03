
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
import { Hat, HatManager } from 'ludumDare40/entities/Hat'
import { ParticleManager } from 'ludumDare40/entities/ParticleManager';
import { BoundsDrawer } from 'ludumDare40/entities/BoundsDrawer';

import * as collisions from './entities/collisions'
import * as mapLoader from 'ludumDare40/map/MapLoader';
import { ILD40GridSpot } from 'ludumDare40/map/ILD40GridSpot';
import { Layer_Background, IMapMedatada } from 'ludumDare40/map/MapLoader';

import * as sounds from 'ludumDare40/sounds/ldSounds'
import { MapScanner } from 'ludumDare40/game/MapScanner';

const turn = Math.PI * 2

let drawBounds = false
let drawMarkers = false

export class LudumDare40Context {

  sge: SimpleGameEngine
  
  tileMap: TileMap<ILD40GridSpot>
  mapMeta: IMapMedatada
  mapScanner = new MapScanner()

  menuManager = new MenuManager()

  splash: SplashScreen

  sounds = sounds

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
  hats = new HatManager()

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

    this.blobs.init(this)
    this.hats.init(this)

    this.player = new Player()
    this.player.init(this)

    // Add layers
    this.addLayer(this.tileMap.containers[mapLoader.Layer_Background])
    this.addLayer(this.tileMap.containers[mapLoader.Layer_BackgroundDecor])

    this.addLayer(this.tileMap.containers[mapLoader.Layer_Wall])

    this.layerObjects = this.addLayer()

    this.addLayer(this.tileMap.containers[mapLoader.Layer_Decor])
    this.layerMarkers = this.addLayer(this.tileMap.containers[mapLoader.Layer_Marker])
    this.layerMarkers.visible = drawMarkers

    this.layerParticles = this.addLayer()
    this.layerParticles.addChild(this.particles.container)

    this.layerBounds = this.addLayer()
    this.layerBounds.visible = drawBounds

    this.boundsDrawer.init(this)
    this.layerBounds.addChild(this.boundsDrawer.container)

    //this.layerObjects.addChild(this.ship.ship)

    this.addLayerUI(this.menuManager.menuManager.container)
    this.addLayerUI(this.menuManager.container)


    this.layerObjects.addChild(this.player.container)


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
    _.forEach(this.mapMeta.hats, (c) => {
      this.hats.createAt(c.bx * 16 + 8, c.by * 16 + 8)
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

    this.mapScanner.update(this)

    this.boundsDrawer.clear()

    this.splash.update()

    this.player.update()

    this.blobs.update()
    this.hats.update()

    // Draw bounds
    if (drawBounds) {
      this.boundsDrawer.draw(this.player.bounds)
      this.blobs.drawBounds(this.boundsDrawer)
      this.hats.drawBounds(this.boundsDrawer)
    }

    // Check collisions
    _.forEach(this.blobs.items, (c) => {

      let p = this.player
      let b = c

      if (collisions.isRectOverlap(p.bounds, b.bounds)) {
        if (p.bounds.boundsY2 < b.bounds.boundsY2 && p.bounds.vy > 0) {
          // Stomp
          //this.particles.emitBlobParts(b.body.texture.frame, (b.boundsX1 + b.boundsX2) / 2, b.boundsY2)

          if (!b.isReadyToBeDestroyed) {
            b.destroy()
            // _.forEach(b.hats.hats, (c) => {
            //   p.hats.addHat()
            // })
          }

        }

      }
    })

    let p = this.player
    _.forEach(this.hats.items, (hat) => {

      let processed = false
      _.forEach(this.blobs.items, (blob) => {
        if(processed) { return }

        if (collisions.isRectOverlap(hat.bounds, blob.bounds)) {
          if (!blob.isReadyToBeDestroyed) {
            // blob.destroy()

            blob.hats.addHat(hat.body.texture.frame)
            hat.destroy()
            processed = true
          }
        }
      })

      if (!processed && collisions.isRectOverlap(p.bounds, hat.bounds)) {

        if (hat.frame > 30) // Don't pick up a fresh hat
        {
          if (!hat.isReadyToBeDestroyed) {
            p.hats.addHat(hat.body.texture.frame)
            hat.destroy()
            processed = true
          }
        }

      }
    })

    // camera
    let { width, height } = this.sge.getViewSize()
    let x = (-this.player.bounds.boundsX1 * this.rootContainer.scale.x)
    let y = (-this.player.bounds.boundsY1 * this.rootContainer.scale.y)
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
          hatCountHide: 0,
          hatCountShow: 0,
          fatal: false,
        }
        return gridSpot
      }
    )

    let numPieces = 10
    let maxRandos = 7
    let inOrder = false

    this.mapMeta = mapLoader.createMetaData()
    //let mapJson = this.sge.getJson('map-start')
    //let { width, height } = mapJson
    let width = 20
    let height = 20
    this.tileMap.resize(width * numPieces + 2, height + 4)

    // tileMapFiller.fillRect(this.tileMap, mapLoader.Layer_Background, 'default', 0, 0, 20, 20)

    mapLoader.load(20 * 0, 0, this.tileMap, this.mapMeta, this.sge.getJson('map-start'), {})
    for (let i = 1; i < (numPieces - 1); i++) {

      let mapNum = ((i - 1) % maxRandos) + 1
      if (inOrder) {

      } else {
        mapNum = _.random(1, mapNum, false)
      }
      mapLoader.load(20 * i, 0, this.tileMap, this.mapMeta, this.sge.getJson('map-01-00' + (mapNum)), {})  
    }
    mapLoader.load(20 * 9, 0, this.tileMap, this.mapMeta, this.sge.getJson('map-end'), {})

    tileMapFiller.fillRect(this.tileMap, mapLoader.Layer_Wall, '_6_3', 0, height + 4 - 1, width * numPieces, 1,
     (gs: ILD40GridSpot) => {
      gs.canMove = false
      gs.fatal = true
    })


  }
}

