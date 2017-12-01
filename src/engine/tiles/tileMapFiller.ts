import { TileMap, IGridSpot } from 'engine/tiles/TileMap'

export function strokeRect(tm: TileMap<IGridSpot>, layer, tileIndex, x: number, y: number, w: number, h: number, ) {

  for (let i = 0; i < w; i++) {
    tm.setTileAt(layer, x + i, y, tileIndex)
    tm.setTileAt(layer, x + i, y + h - 1, tileIndex)
  }

  for (let j = 0; j < h; j++) {
    tm.setTileAt(layer, x, y + j, tileIndex)
    tm.setTileAt(layer, x + w - 1, y + j, tileIndex)
  }

}

export function fillRect(tm: TileMap<IGridSpot>, layer, tileIndex, x: number, y: number, w: number, h: number, ) {

  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      tm.setTileAt(layer, x + i, y + j, tileIndex)
    }
  }

}


export function strokeRectBox(
  tm: TileMap<IGridSpot>,
  layer,
  tileIndexN,
  tileIndexE,
  tileIndexS,
  tileIndexW,

  tileIndexNW,
  tileIndexNE,
  tileIndexSE,
  tileIndexSW,

  x: number, y: number, w: number, h: number,
) {


  for (let i = 1; i < w - 1; i++) {
    tm.setTileAt(layer, x + i, y, tileIndexN)
    tm.setTileAt(layer, x + i, y + h - 1, tileIndexS)
  }

  for (let j = 1; j < h - 1; j++) {
    tm.setTileAt(layer, x, y + j, tileIndexW)
    tm.setTileAt(layer, x + w - 1, y + j, tileIndexE)
  }

  tm.setTileAt(layer, x, y, tileIndexNW)
  tm.setTileAt(layer, x, y + h - 1, tileIndexSW)
  tm.setTileAt(layer, x + w - 1, y, tileIndexNE)
  tm.setTileAt(layer, x + w - 1, y + h - 1, tileIndexSE)


}