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

import { loadBasicLayer } from './MapLoaderBasic'
import { ButtonBoss, ButtonWin, ButtonMid } from 'ludumDare40/entities/Button'

export {
  Layer_Background,
  Layer_BackgroundDecor,
  Layer_Wall,
  Layer_Decor,
  Layer_Marker,
  Num_Layers,
}

export interface ISpawnLocation {
  bx: number
  by: number
  data?: any
}
export interface IMapMedatada {
  spawn: ISpawnLocation
  blobs: ISpawnLocation[]
  hats: ISpawnLocation[]
  hatCounters: ISpawnLocation[]
  buttons: ISpawnLocation[]
  texts: ISpawnLocation[]
  decors: ISpawnLocation[]
}
export function createMetaData() {
  let md: IMapMedatada = {
    spawn: null,
    blobs: [],
    hats: [],
    hatCounters: [],
    buttons: [],
    texts: [],
    decors: [],
  }
  return md
}

function isExact(t, y, x) {
  return t == y * tilesPerRow + x
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

export function load(
  x,
  y,
  tm: TileMap<ILD40GridSpot>,
  mapMeta: IMapMedatada,
  json,
  levelMetadata
) {
  console.log('load map', json)

  _.forEach(json.layers, (layer: { name: string; data: any }) => {
    console.log('processing layer', layer.name, layer)

    if (layer.name === 'Background') {
      loadBackgroundLayer(json, x, y, tm, mapMeta, layer.data)
    }
    if (layer.name === 'Background-Decor') {
      loadBackgroundDecorLayer(json, x, y, tm, mapMeta, layer.data)
    }

    if (layer.name === 'Wall') {
      loadWallLayer(json, x, y, tm, mapMeta, layer.data)
    }

    if (layer.name === 'Decor') {
      loadDecorLayer(json, x, y, tm, mapMeta, layer.data)
    }

    if (layer.name === 'Marker') {
      loadMarkerLayer(json, x, y, tm, mapMeta, layer.data)
    }
  })
}

function loadBackgroundLayer(
  json,
  x,
  y,
  tm: TileMap<ILD40GridSpot>,
  mapMeta: IMapMedatada,
  data: any
) {
  loadBasicLayer(
    json,
    x,
    y,
    tm,
    Layer_Background,
    data,
    (t) => {
      return t
    },
    (gs, t) => {}
  )
}
function loadBackgroundDecorLayer(
  json,
  x,
  y,
  tm: TileMap<ILD40GridSpot>,
  mapMeta: IMapMedatada,
  data: any
) {
  loadBasicLayer(
    json,
    x,
    y,
    tm,
    Layer_BackgroundDecor,
    data,
    (t) => {
      return t
    },
    (gs, t) => {}
  )
}

function loadWallLayer(
  json,
  x,
  y,
  tm: TileMap<ILD40GridSpot>,
  mapMeta: IMapMedatada,
  data: any
) {
  loadBasicLayer(json, x, y, tm, Layer_Wall, data, null, (gs, t) => {
    gs.canMove = t <= 1

    if (isExact(t, 6, 4)) {
      gs.hatCountHide = 1
    }
    if (isExact(t, 6, 5)) {
      gs.hatCountHide = 10
    }
    if (isExact(t, 6, 6)) {
      gs.hatCountHide = 20
    }
    if (isExact(t, 6, 7)) {
      gs.hatCountHide = 30
    }
    if (isExact(t, 6, 8)) {
      gs.hatCountHide = 40
    }
    if (isExact(t, 6, 9)) {
      gs.hatCountHide = 50
    }

    if (isExact(t, 7, 3)) {
      gs.fatal = true
    }
    if (isExact(t, 7, 4)) {
      gs.hatCountShow = 1
      gs.fatal = true
    }
    if (isExact(t, 7, 5)) {
      gs.hatCountShow = 10
      gs.fatal = true
    }
    if (isExact(t, 7, 6)) {
      gs.hatCountShow = 20
      gs.fatal = true
    }
    if (isExact(t, 7, 7)) {
      gs.hatCountShow = 30
      gs.fatal = true
    }
    if (isExact(t, 7, 8)) {
      gs.hatCountShow = 40
      gs.fatal = true
    }
    if (isExact(t, 7, 9)) {
      gs.hatCountShow = 50
      gs.fatal = true
    }

    if (isExact(t, 4, 7)) {
      gs.hideBossButtonPressed = true
      gs.canMove = false
    }
    if (isExact(t, 4, 9)) {
      gs.hideBossDefeated = true
      gs.canMove = false
    }
    if (isExact(t, 4, 11)) {
      gs.hideMidButtonPressed = true
      gs.canMove = false
    }

    if (isExact(t, 14, 5)) {
      console.log('hit hat c', t)
      mapMeta.hatCounters.push({
        bx: gs.bx,
        by: gs.by,
        data: { type: 'hat' },
      })
    }
    if (isExact(t, 15, 4)) {
      console.log('hit hat c', t)
      mapMeta.hatCounters.push({
        bx: gs.bx,
        by: gs.by,
        data: { type: 'lava' },
      })
    }
  })
}

function loadDecorLayer(
  json,
  x,
  y,
  tm: TileMap<ILD40GridSpot>,
  mapMeta: IMapMedatada,
  data: any
) {
  loadBasicLayer(json, x, y, tm, Layer_Decor, data, null, (gs, t) => {})
}

function loadMarkerLayer(
  json,
  x,
  y,
  tm: TileMap<ILD40GridSpot>,
  mapMeta: IMapMedatada,
  data: any
) {
  loadBasicLayer(json, x, y, tm, Layer_Marker, data, null, (gs, t, x, y) => {
    if (t > 1) {
      // Add spawns
      if (isExact(t, 1, 2)) {
        console.log('marker hit spawn', t)
        mapMeta.spawn = {
          bx: gs.bx,
          by: gs.by,
        }
      } else if (isExact(t, 4, 1)) {
        console.log('marker hit blob', t)
        mapMeta.blobs.push({
          bx: gs.bx,
          by: gs.by,
        })
      } else if (isExact(t, 2, 1)) {
        console.log('marker hit hat', t)
        mapMeta.hats.push({
          bx: gs.bx,
          by: gs.by,
        })
      } else if (isExact(t, 5, 6)) {
        console.log('marker hit button1', t)
        mapMeta.buttons.push({
          bx: gs.bx,
          by: gs.by,
          data: { buttonType: ButtonBoss },
        })
      } else if (isExact(t, 5, 8)) {
        console.log('marker hit button 2', t)
        mapMeta.buttons.push({
          bx: gs.bx,
          by: gs.by,
          data: { buttonType: ButtonWin },
        })
      } else if (isExact(t, 5, 10)) {
        console.log('marker hit button 3', t)
        mapMeta.buttons.push({
          bx: gs.bx,
          by: gs.by,
          data: { buttonType: ButtonMid },
        })
      } else if (isExact(t, 15, 5)) {
        console.log('marker hit text', t)
        mapMeta.texts.push({
          bx: gs.bx,
          by: gs.by,
          data: { text: 'wasd or arrows to move and jump' },
        })
      } else if (isExact(t, 15, 6)) {
        console.log('marker hit text', t)
        mapMeta.texts.push({
          bx: gs.bx,
          by: gs.by,
          data: { text: 'collect hats to change blocks' },
        })
      } else if (isExact(t, 15, 7)) {
        console.log('marker hit text', t)
        mapMeta.texts.push({
          bx: gs.bx,
          by: gs.by,
          data: { text: 'Press button to WIN' },
        })
      } else if (isExact(t, 15, 8)) {
        console.log('space throws hats', t)
        mapMeta.texts.push({
          bx: gs.bx,
          by: gs.by,
          data: { text: 'space throws hats' },
        })
      } else if (isExact(t, 15, 9)) {
        console.log('space throws hats', t)
        mapMeta.texts.push({
          bx: gs.bx,
          by: gs.by,
          data: { text: 'warning: more hats, more problems' },
        })
      } else if (isExact(t, 15, 10)) {
        console.log('space throws hats', t)
        mapMeta.texts.push({
          bx: gs.bx,
          by: gs.by,
          data: { text: 'good job! halfway there!' },
        })
      } else if (isExact(t, 2, 13)) {
        mapMeta.decors.push({
          bx: gs.bx,
          by: gs.by,
          data: { idx: 0 },
        })
      } else if (isExact(t, 3, 13)) {
        mapMeta.decors.push({
          bx: gs.bx,
          by: gs.by,
          data: { idx: 1 },
        })
      } else if (isExact(t, 4, 13)) {
        mapMeta.decors.push({
          bx: gs.bx,
          by: gs.by,
          data: { idx: 2 },
        })
      } else if (isExact(t, 1, 13)) {
        mapMeta.decors.push({
          bx: gs.bx,
          by: gs.by,
          data: { idx: 3 },
        })
      } else {
        console.warn('marker UNKNOWN', t)
      }
    }
  })
}
