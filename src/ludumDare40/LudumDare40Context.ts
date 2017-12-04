
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
import { Layer_Background, IMapMedatada, Layer_Decor } from 'ludumDare40/map/MapLoader';

import * as sounds from 'ludumDare40/sounds/ldSounds'
import { MapScanner } from 'ludumDare40/game/MapScanner';
import { KeyCodes } from 'engine/input/Keyboard';
import { HatCounter, HatCounterManager } from 'ludumDare40/entities/HatCounter';
import { ButtonManager, ButtonBoss, ButtonWin, ButtonMid } from 'ludumDare40/entities/Button';
import { TextsManager } from 'ludumDare40/entities/Texts';
import { BossHeadManager } from 'ludumDare40/entities/Boss';
import { DecorManager } from 'ludumDare40/entities/Decor';

const turn = Math.PI * 2

let drawBounds = false
let drawMarkers = false

export class LudumDare40Context {

  sge: SimpleGameEngine

  tileMap: TileMap<ILD40GridSpot> = null
  mapMeta: IMapMedatada
  mapScanner = new MapScanner()

  menuManager = new MenuManager()

  splash: SplashScreen

  sounds = sounds

  rootContainer: PIXI.Container = new PIXI.Container()
  rootContainerUI: PIXI.Container = new PIXI.Container()

  layerDecor: PIXI.Container = new PIXI.Container()
  layerObjects: PIXI.Container = new PIXI.Container()
  layerParticles: PIXI.Container = new PIXI.Container()
  layerBounds: PIXI.Container = new PIXI.Container()
  layerMarkers: PIXI.Container // = new PIXI.Container()

  player: Player

  particles = new ParticleManager()
  boundsDrawer = new BoundsDrawer()

  blobs = new BlobManager()
  hats = new HatManager()
  hatCounters = new HatCounterManager()
  buttons = new ButtonManager()
  texts = new TextsManager()
  bossHeads = new BossHeadManager()
  decors = new DecorManager()

  pressedBossButton = false
  pressedMidButton = false
  defeatedBoss = false

  onLoaded(_sge: SimpleGameEngine) {
    this.sge = _sge

    _sge.renderer.transparent = false
    // Force color property
    let r: any = _sge.renderer
    r.backgroundColor = 0xFF333333

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
    this.hatCounters.init(this)
    this.buttons.init(this)
    this.texts.init(this)
    this.bossHeads.init(this)
    this.decors.init(this)

    this.player = new Player()
    this.player.init(this)

    this.reset()

    // Add layers
    this.addLayer(this.tileMap.containers[mapLoader.Layer_Background])
    this.addLayer(this.tileMap.containers[mapLoader.Layer_BackgroundDecor])

    this.addLayer(this.tileMap.containers[mapLoader.Layer_Wall])

    this.addLayer(this.layerDecor)
    this.addLayer(this.layerObjects)

    this.addLayer(this.tileMap.containers[mapLoader.Layer_Decor])
    this.layerMarkers = this.addLayer(this.tileMap.containers[mapLoader.Layer_Marker])
    this.layerMarkers.visible = drawMarkers

    this.addLayer(this.layerParticles)
    this.layerParticles.addChild(this.particles.container)

    this.addLayer(this.layerBounds)
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



    this.rootContainer.scale

  }
  getPlayerHatCount() {
    return this.player.hats.hats.length
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

    if (this.sge.keyboard.justPressed(KeyCodes.r)) {
      this.reset()
    }

    if (this.sge.keyboard.justPressed(KeyCodes.h)) {
      for (let i = 0; i < 10; i++) {
        this.player.hats.addHat()
      }
    }

    this.mapScanner.update(this)

    this.boundsDrawer.clear()

    this.splash.update()

    this.player.update()
    if (this.player.isDying && this.player.dyingFrames > 180) {
      this.reset()
    }

    this.blobs.update()
    this.hats.update()
    this.hatCounters.update()
    this.buttons.update()
    this.texts.update()
    this.bossHeads.update()
    this.decors.update()

    // Draw bounds
    if (drawBounds) {
      this.boundsDrawer.draw(this.player.bounds)
      this.blobs.drawBounds(this.boundsDrawer)
      this.hats.drawBounds(this.boundsDrawer)
    }

    // Check collisions
    let p = this.player
    _.forEach(this.blobs.items, (c) => {

      let b = c

      if (collisions.isRectOverlap(p.bounds, b.bounds)) {
        if (p.bounds.boundsY2 < b.bounds.boundsY2 && p.bounds.vy > 0) {
          // Stomp
          //this.particles.emitBlobParts(b.body.texture.frame, (b.boundsX1 + b.boundsX2) / 2, b.boundsY2)

          p.bounds.subY = b.bounds.boundsY1 * 32 - 32 - 16
          p.bounds.vy = 0
          p.bounds.accelY = 0
          p.bounds.jump()
          p.bounds.recalcBounds()

          if (b.hats.hats.length > 0) {
            let hat = b.hats.removeTopHat()
            b.popHat(hat, b.hats.hats.length)
          }
          else {
            if (!b.isReadyToBeDestroyed) {
              b.destroy()
              // _.forEach(b.hats.hats, (c) => {
              //   p.hats.addHat()
              // })
            }
          }

        } else {
          p.die()
        }

      }
    })

    this.defeatedBoss = this.bossHeads.items.length === 0

    _.forEach(this.bossHeads.items, (c) => {

      let b = c

      if (collisions.isRectOverlap(p.bounds, b.bounds)) {
        if (p.bounds.boundsY2 < b.bounds.boundsY2 && p.bounds.vy > 0) {
          // Stomp
          //this.particles.emitBlobParts(b.body.texture.frame, (b.boundsX1 + b.boundsX2) / 2, b.boundsY2)

          p.bounds.subY = b.bounds.boundsY1 * 32 - 32 - 16
          p.bounds.vy = 0
          p.bounds.accelY = 0
          p.bounds.jump()
          p.bounds.recalcBounds()

          b.bounds.setStateFalling()

          if (b.hats.hats.length > 0) {
            let hat = b.hats.removeTopHat()
            b.popHat(hat, b.hats.hats.length)
          }
          else {
            if (!b.isReadyToBeDestroyed) {
              b.destroy()



              // _.forEach(b.hats.hats, (c) => {
              //   p.hats.addHat()
              // })
            }
          }

        } else {
          p.die()
        }

      }
    })

    _.forEach(this.decors.items, (c) => {

      let b = c

      if (collisions.isRectOverlap(p.bounds, b.bounds)) {
        if (!c.isReadyToBeDestroyed) {
          // blob.destroy()
          let hat = this.hats.createAt(c.bounds.x, c.bounds.y - 16)
          hat.bounds.vy = _.random(-64, 0)
          hat.bounds.vx = _.random(-64, 64)
          c.destroy()

        }
      }
    })

    _.forEach(this.buttons.items, (c) => {

      let b = c

      if (collisions.isRectOverlap(p.bounds, b.bounds)) {
        if (p.bounds.boundsY2 < b.bounds.boundsY2 && p.bounds.vy > 0) {
          // Stomp
          if (!b.isPressed) {
            b.isPressed = true

            if (b.buttonType === ButtonBoss) {
              sounds.playMusicBoss()
              this.pressedBossButton = true

              let numHeads = 1 + Math.floor(this.getPlayerHatCount() / 10)
              if (numHeads > 10) { numHeads = 10 }
              for (let idxHead = 0; idxHead < numHeads; idxHead++) {
                let head = this.bossHeads.createAt(b.bounds.x + 150 - idxHead * 12, p.bounds.y)
                let numHats = _.random(0, 3, false)
                for (let idxHat = 0; idxHat < numHats; idxHat++) {
                  head.hats.addHat()
                }
              }


            } else if (b.buttonType === ButtonWin) {
              sounds.playMusicWin()
            } else if (b.buttonType === ButtonMid) {
              sounds.playMusicDungeon()
              this.pressedMidButton = true
            }
          }

        }

      }
    })

    _.forEach(this.hats.items, (hat) => {

      let processed = false
      _.forEach(this.blobs.items, (blob) => {
        if (processed) { return }

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


  reset() {

    this.pressedBossButton = false
    this.pressedMidButton = false
    this.defeatedBoss = false

    this.resetTileMap()

    // Set player to spawn
    let spawn = this.mapMeta.spawn


    this.player.reset()
    this.player.moveTo(spawn.bx * 16 + 8, spawn.by * 16 + 14)

    // Spawn blobs
    this.blobs.clear()
    _.forEach(this.mapMeta.blobs, (c) => {
      this.blobs.createAt(c.bx * 16 + 8, c.by * 16 + 8)
    })
    this.hats.clear()
    _.forEach(this.mapMeta.hats, (c) => {
      this.hats.createAt(c.bx * 16 + 8, c.by * 16 + 8)
    })
    this.hatCounters.clear()
    _.forEach(this.mapMeta.hatCounters, (c) => {
      this.hatCounters.createAt(c.bx * 16 + 8, c.by * 16 + 8)
    })
    this.buttons.clear()
    _.forEach(this.mapMeta.buttons, (c) => {
      let btn = this.buttons.createAt(c.bx * 16 + 8, c.by * 16 + 8)
      btn.buttonType = c.data.buttonType
    })
    this.texts.clear()
    _.forEach(this.mapMeta.texts, (c) => {
      let btn = this.texts.createAt(c.bx * 16 + 8, c.by * 16 + 8)
      btn.text.text = c.data.text
    })
    this.bossHeads.clear()

    this.decors.clear()
    _.forEach(this.mapMeta.decors, (c) => {
      let btn = this.decors.createAt(c.bx * 16 + 8, c.by * 16 + 8)
      btn.objIndex = c.data.idx
    })
  }

  resetTileMap() {
    if (this.tileMap === null) {

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
            hideBossDefeated: false,
            hideBossButtonPressed: false,
            hideMidButtonPressed: false,
          }
          return gridSpot
        }
      )

    }


    let pieces1 = [
      'map-01-001',
      'map-01-002',
      'map-01-003',
      'map-01-004',
      'map-01-005',
    ]

    let pieces2 = [
      'map-01-006',
      'map-01-007',
      'map-01-008',
      'map-01-009',
    ]

    let numPieces = pieces1.length + 4 + pieces2.length
    let maxRandos = pieces1.length + pieces2.length
    let inOrder = true
    let exact = 'map-mid'

    if (!inOrder) {
      pieces1 = _.shuffle(pieces1)
      pieces2 = _.shuffle(pieces2)
    }

    this.mapMeta = mapLoader.createMetaData()
    //let mapJson = this.sge.getJson('map-start')
    //let { width, height } = mapJson
    let width = 20
    let height = 20
    let acutalWidth = width + 1
    this.tileMap.resize((acutalWidth) * numPieces + 2, height + 6)

    // tileMapFiller.fillRect(this.tileMap, mapLoader.Layer_Background, 'default', 0, 0, 20, 20)

    let idxPiece = 0
    mapLoader.load(acutalWidth * idxPiece, 2, this.tileMap, this.mapMeta, this.sge.getJson('map-start'), {})
    idxPiece++

    let mid = Math.ceil(maxRandos / 2)

    while (pieces1.length > 0) {

      let map = pieces1.shift()
      if (exact) {
        map = exact
      }
      let randY = _.random(-2, 2)

      mapLoader.load(acutalWidth * idxPiece, 2 + randY, this.tileMap, this.mapMeta, this.sge.getJson(map), {})
      idxPiece++
    }

    // Mid
    mapLoader.load(acutalWidth * idxPiece, 2, this.tileMap, this.mapMeta, this.sge.getJson('map-mid'), {})
    idxPiece++

    while (pieces2.length > 0) {

      let map = pieces2.shift()
      if (exact) {
        map = exact
      }
      let randY = _.random(-2, 2)

      mapLoader.load(acutalWidth * idxPiece, 2 + randY, this.tileMap, this.mapMeta, this.sge.getJson(map), {})
      idxPiece++
    }

    mapLoader.load(acutalWidth * idxPiece, 2, this.tileMap, this.mapMeta, this.sge.getJson('map-boss'), {})
    idxPiece++

    mapLoader.load(acutalWidth * idxPiece, 2, this.tileMap, this.mapMeta, this.sge.getJson('map-end'), {})
    idxPiece++

    tileMapFiller.fillRect(this.tileMap, mapLoader.Layer_Wall, '_7_3', 0, height + 6 - 1, (acutalWidth) * numPieces + 1, 1,
      (gs: ILD40GridSpot) => {
        gs.canMove = false
        gs.fatal = true
      })


  }
}

