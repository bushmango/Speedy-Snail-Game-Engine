import * as assert from 'engine/common/assert'
import { _ } from 'engine/importsEngine'

import { SimpleGameEngine } from 'engine/SimpleGameEngine'
const { Rectangle, Sprite, Container } = PIXI
const { TextureCache } = PIXI.utils

export interface IGridSpot {

  sprites: PIXI.Sprite[],

  bx: number,
  by: number,

  canMove: boolean,

  // // Extra data
  // canSpawnCoin: boolean,

  // // Race
  // isBoost: boolean,
  // raceCheckpoint: number,
  // spawnDirection: number,
}

export interface ITileData {
  name: string,
  textureName: string,
  tx: number,
  ty: number,
}

export class TileMap<TIGridSpot extends IGridSpot> {

  blockWidth = 0
  blockHeight = 0
  blockSize = 0
  numLayers = 0

  containers: PIXI.Container[] = []

  data: TIGridSpot[] = []
  tileData: ITileData[] = []
  defaultTile: ITileData

  gridSpotCreator: (sprites, bx, by) => TIGridSpot 

  constructor(
    sge: SimpleGameEngine,
    blockSize,
    tiles: ITileData[],
    numLayers,
    gridSpotCreator) {

    this.blockSize = blockSize
    this.numLayers = numLayers
    this.tileData = tiles
    this.gridSpotCreator = gridSpotCreator


    // Index tiles by name too
    _.forEach(tiles, (c) => {
      this.tileData[c.name] = c
    })

    this.defaultTile = this.tileData['default'] || this.tileData[0]
    // console.log(this.defaultTile)

    let { data } = this

    _.forEach(_.times(numLayers), (c) => {
      this.containers.push(new PIXI.Container())
    })

  }

  resize(blockWidth, blockHeight) {

    this.blockWidth = blockWidth
    this.blockHeight = blockHeight

    // clear existing
    _.forEach(this.data, (c) => {
      _.forEach(c.sprites, (sprite) => {
        if (sprite) {
          sprite.destroy()
        }
      })
    })

    if(this.gridSpotCreator === null) {
      this.gridSpotCreator = (sprites, bx, by) => (
        {
          sprites: sprites,
          bx: bx,
          by: by,
          canMove: true,
        } as TIGridSpot
      )
    }

    this.data = []
    for (let j = 0; j < blockHeight; j++) {
      for (let i = 0; i < blockWidth; i++) {
        let sprites = _.times(this.numLayers, _.constant(null))
        // let gridSpot: IGridSpot = {
        //   sprites: _.times(this.numLayers, _.constant(null)),
        //   bx: i,
        //   by: j,
        //   canMove: true,
        //   canSpawnCoin: true,
        //   isBoost: false,
        //   raceCheckpoint: 0,
        //   spawnDirection: 0,
        // }
        let gridSpot: TIGridSpot = this.gridSpotCreator(sprites, i, j)
        this.data.push(gridSpot)

      }
    }
  }


  update() {

  }

  setPosition(x, y) {
    _.forEach(this.containers, (c) => {
      c.position.set(x, y)
    })
  }
  setScale(s) {
    _.forEach(this.containers, (c) => {
      c.scale.set(s, s)
    })
  }

  // tileCenterToWorldX(bx) {
  //   return this.ox + this.blockSize * bx
  // }
  // tileCenterToWorldY(by) {
  //   return this.oy + this.blockSize * by
  // }

  inRange(bx, by) {
    if (bx < 0 || bx >= this.blockWidth) { return false }
    if (by < 0 || by >= this.blockHeight) { return false }
    return true
  }
  wrapX(bx) {
    if (bx < 0) { bx = this.blockWidth - 1 }
    if (bx > this.blockWidth - 1) { bx = 0 }
    return bx
  }
  wrapY(by) {
    if (by < 0) { by = this.blockHeight - 1 }
    if (by > this.blockHeight - 1) { by = 0 }
    return by
  }
  clampBoundsX(bx) {
    if (bx < 0) { bx = 0 }
    if (bx > this.blockWidth - 1) { bx = this.blockWidth - 1 }
    return bx
  }
  clampBoundsY(by) {
    if (by < 0) { by = 0 }
    if (by > this.blockHeight - 1) { by = this.blockHeight - 1 }
    return by
  }

  addTile(newTile: ITileData) {
    this.tileData[newTile.name] = newTile
  }
  hasTile(tileName) {
    return (this.tileData[tileName] != null)
  }


  checkInRange(bx, by) {
    if (bx < 0 || bx >= this.blockWidth) { return false }
    if (by < 0 || by >= this.blockHeight) { return false }
    return true
  }
  safeGetTileAt(bx, by) {
    if (bx < 0 || bx >= this.blockWidth) { return null }
    if (by < 0 || by >= this.blockHeight) { return null }

    let gs = this.data[by * this.blockWidth + bx]
    return gs
  }
  canMoveOn(bx, by) {
    if (false === this.checkInRange(bx, by)) {
      return false
    }
    return this.getTileAt(bx, by).canMove
  }

  getTileAt(bx, by) {

    assert.failIf(bx < 0 || bx >= this.blockWidth, `bx out of range: ${bx}`)
    assert.failIf(by < 0 || by >= this.blockHeight, `by out of range: ${by}`)

    let gs = this.data[by * this.blockWidth + bx]
    return gs
  }
  setTileAt(layer: number, bx: number, by: number, tileIndex) {

    return this.setTileAtEx(layer, bx, by, tileIndex, false, false, 0)

    // TODO: multiple texture support
    // TODO: precompute rect
    // TODO: animated texture support
    // TODO: actually share textures?
    // let texture = sge.getTexture(defaultTile.textureName) // PIXI.loader.resources[defaultTile.textureName].texture
    // let rectangle = new PIXI.Rectangle(blockSize * defaultTile.tx, blockSize * defaultTile.ty, blockSize, blockSize)
    // sprite.texture.frame = rectangle

    // sprites.push(sprite)

    // TODO: move this elsewhere?
    // sprite.texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST
    //sprite.position.set(i * blockSize, j * blockSize)

    // gs.sprite.play(tileName, 1, false)
  }

  setTileAtEx(layer: number, bx: number, by: number, tileIndex, flipX, flipY, rot) {

    assert.failIf(bx < 0 || bx >= this.blockWidth, `bx out of range: ${bx}`)
    assert.failIf(by < 0 || by >= this.blockHeight, `by out of range: ${by}`)

    let gs = this.data[by * this.blockWidth + bx]
    assert.exists(gs, `gs does not exist ${bx}:${by}`)

    let tile = this.tileData[tileIndex]
    let blockSize = this.blockSize

    let sprite = gs.sprites[layer]
    if (sprite == null) {
      let texture = TextureCache[this.defaultTile.textureName]
      sprite = new PIXI.Sprite(new PIXI.Texture(texture.baseTexture))
      sprite.anchor.set(0.5)
      let pixelAdjust = 0.01
      sprite.position.set(bx * blockSize + blockSize/2 + pixelAdjust, by * blockSize + blockSize/2 + pixelAdjust)
      this.containers[layer].addChild(sprite)
      gs.sprites[layer] = sprite
    }

    let rectangle = new PIXI.Rectangle(blockSize * tile.tx, blockSize * tile.ty, blockSize, blockSize)
    sprite.texture.frame = rectangle
    sprite.visible = true

    sprite.rotation = rot
    sprite.scale.set(flipX ? -1 : 1, flipY ? -1 : 1)

    return gs
  }

  clearTileAt(layer, bx, by) {
    assert.failIf(bx < 0 || bx >= this.blockWidth, `bx out of range: ${bx}`)
    assert.failIf(by < 0 || by >= this.blockHeight, `by out of range: ${by}`)

    let gs = this.data[by * this.blockWidth + bx]
    assert.exists(gs, `gs does not exist ${bx}:${by}`)

    let sprite = gs.sprites[layer]
    if (sprite) {
      sprite.visible = false
    }

    return gs
  }
}
