import { _ } from 'engine/importsEngine'
import { ILD40GridSpot } from 'ludumDare40/map/ILD40GridSpot'
import { TileMap, IGridSpot } from 'engine/tiles/TileMap'

const Layer_Background = 0
const Layer_BackgroundDecor = 1
const Layer_Wall = 2
const Layer_Decor = 3
const Layer_Marker = 4
const Num_Layers = 5

const tilesPerRow = 32
const tilesetWidth = 512
const tilesetHeight = 512
const defaultTextureName = 'public/ludumdare40/images/ase-512-16.png'

export {
  Layer_Background,
  Layer_BackgroundDecor,
  Layer_Wall,
  Layer_Decor,
  Layer_Marker,
  Num_Layers,
}

export interface ISpawnLocation {
  bx: number,
  by: number,
}
export interface IMapMedatada {
  spawns: ISpawnLocation[]
}
export function createMetaData() {
  let md: IMapMedatada = {
    spawns: []
  }
  return md
}

const Rot_90_Flag = 0xA0000000
const Rot_180_Flag = 0xC0000000
const Rot_270_Flag = 0x60000000

const FlippedHorizontallyFlag = 0x80000000
const FlippedVerticallyFlag = 0x40000000
const FlippedAntiDiagonallyFlag = 0x20000000

const MinFlag = 0x10000000

function isExact(t, y, x) {
  return (t == y * tilesPerRow + x)
}

function inYRange(t, y1, y2, x) {

  for (let y = y1; y <= y2; y++) {
    if (t >= y * tilesPerRow + x) {
      return true
    }
  }

  return false

}

function inXRange(t, y, x1, x2) {
  if (t >= y * tilesPerRow + x1 && t <= y * tilesPerRow + x2) {
    return true
  }
  return false
}

function inSquareRange(t, y1, y2, x1, x2) {

  for (let y = y1; y <= y2; y++) {
    if (t >= y * tilesPerRow + x1 && t <= y * tilesPerRow + x2) {
      return true
    }
  }

  return false

}

export function addTex(y, x, tm: TileMap<ILD40GridSpot>) {

  let texKey = '_' + y + '_' + x

  if (x >= tilesetWidth || y >= tilesetHeight) {
    console.error('bad tex', x, y)
    return
  }

  if (false === tm.hasTile(texKey)) {
    let newTile = {
      name: texKey,
      textureName: defaultTextureName,
      tx: x,
      ty: y,
    }
    tm.addTile(newTile)
  } else {
    console.error('tex already loaded', x, y)
  }
}

export function load(tm: TileMap<ILD40GridSpot>, mapMeta: IMapMedatada, json, levelMetadata) {
  console.log('load map', json)

  _.forEach(json.layers, (layer: { name: string, data: any }) => {

    console.log('processing layer', layer.name, layer)

    if (layer.name === "Background") {
      loadBackgroundLayer(tm, mapMeta, layer.data)
    }
    if (layer.name === "Background-Decor") {
      loadBackgroundDecorLayer(tm, mapMeta, layer.data)
    }

    if (layer.name === "Wall") {
      loadWallLayer(tm, mapMeta, layer.data)
    }

    if (layer.name === "Decor") {
      loadDecorLayer(tm, mapMeta, layer.data)
    }

    if (layer.name === "Marker") {
      loadMarkerLayer(tm, mapMeta, layer.data)
    }

  })

}

function loadBasicLayer(
  tm: TileMap<ILD40GridSpot>,
  layer,
  data: any,
  pcb: (t: number, x: number, y: number) => any,
  cb: (gs: ILD40GridSpot, t: number, x: number, y: number) => any,
  clearEmpty: boolean = true) {

  for (let j = 0; j < tm.blockHeight; j++) {
    for (let i = 0; i < tm.blockWidth; i++) {

      let idx = j * tm.blockWidth + i
      let d = tm.data[idx]

      let t = data[idx] - 1

      // .. beep boop
      if (t > 1) {

        let flipX = false
        let flipY = false
        let rot = 0

        // Check for flipping
        if (t > MinFlag) {

          if (t & FlippedHorizontallyFlag) {
            t -= FlippedHorizontallyFlag
            flipX = !flipX
          }
          if (t & FlippedVerticallyFlag) {
            t -= FlippedVerticallyFlag
            flipY = !flipY
          }

          if (t & FlippedAntiDiagonallyFlag) {
            t -= FlippedAntiDiagonallyFlag
            flipX = !flipX
            //flipY = !flipY

            rot = Math.PI * 0.5

            if (flipY && !flipX) {
              //t = 4
              rot = -Math.PI * 0.5
            }

            if (!flipY && flipX) {
              //t = 4
              flipY = !flipY
              flipX = !flipX
            }


          }

          if (t & Rot_90_Flag) {
            t -= Rot_90_Flag
            t = 4
            //rot = Math.PI * 0.5
          }
          if (t & Rot_180_Flag) {
            t -= Rot_180_Flag
            t = 4
            //rot = Math.PI * 1
          }
          if (t & Rot_270_Flag) {
            t -= Rot_270_Flag
            t = 4
            //rot = Math.PI * 1.5
          }


        }

        let x = t % tilesPerRow
        let y = Math.floor(t / tilesPerRow)
        if (pcb) {
          t = pcb(t, x, y)
          x = t % tilesPerRow
          y = Math.floor(t / tilesPerRow)
        }

        let texKey = '_' + y + '_' + x

        if (x >= 512 || y >= 512) {
          console.error('bad tex', t, x, y, ' at ', i, j)
          continue
        }

        if (false === tm.hasTile(texKey)) {
          let newTile = {
            name: texKey,
            textureName: defaultTextureName,
            tx: x,
            ty: y,
          }
          tm.addTile(newTile)
        }

        let gs = tm.setTileAtEx(layer, i, j, texKey, flipX, flipY, rot)

        if (cb) {
          cb(gs, t, x, y)
        }

      } else {

        if (clearEmpty) {
          let gs = tm.clearTileAt(layer, i, j)

          if (cb) {
            cb(gs, t, 0, 0)
          }
        }

      }

    }
  }
}


function loadBackgroundLayer(tm: TileMap<ILD40GridSpot>, mapMeta: IMapMedatada, data: any) {
  loadBasicLayer(tm, Layer_Background, data, (t) => {
    return t
  },
    (gs, t) => {

    })
}
function loadBackgroundDecorLayer(tm: TileMap<ILD40GridSpot>, mapMeta: IMapMedatada, data: any) {
  loadBasicLayer(tm, Layer_BackgroundDecor, data, (t) => {
    return t
  },
    (gs, t) => {

    })
}

function loadWallLayer(tm: TileMap<ILD40GridSpot>, mapMeta: IMapMedatada, data: any) {
  loadBasicLayer(tm, Layer_Wall, data, null, (gs, t) => {
    gs.canMove = (t <= 1)
  })
}

function loadDecorLayer(tm: TileMap<ILD40GridSpot>, mapMeta: IMapMedatada, data: any) {
  loadBasicLayer(tm, Layer_Decor, data, null, (gs, t) => {

  })
}

function loadMarkerLayer(tm: TileMap<ILD40GridSpot>, mapMeta: IMapMedatada, data: any) {
  loadBasicLayer(tm, Layer_Marker, data, null, (gs, t, x, y) => {

    if (t > 1) {
      // Add spawns
      if (isExact(t, 1, 2)) {
        console.log('marker hit', t)
        addSpawn(mapMeta, gs)
      }
      else {
        console.warn('marker UNKNOWN', t)
      }

    }

  })
}

function addSpawn(mapMeta: IMapMedatada, gs: IGridSpot) {
  mapMeta.spawns.push({
    bx: gs.bx,
    by: gs.by,
  })
}