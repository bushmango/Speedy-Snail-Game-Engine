let tileDatas: any = {}

// TODO: configure tile size, num columns -- load from tile json?

import * as spriteUtil from 'engine/anim/spriteUtil'

export interface ITileData {
  t: number
  tx: number
  ty: number
  rect: PIXI.Rectangle
  tex: PIXI.Texture
}
export function getTileData(t, numTileColumns) {
  let tileData: ITileData = tileDatas[t]
  if (!tileData) {
    let tx = t % numTileColumns
    let ty = Math.floor(t / numTileColumns)
    tileData = {
      t,
      tx,
      ty,
      rect: spriteUtil.frame32(ty, tx),
      tex: null,
    }
    tileDatas[t] = tileData
  }
  return tileData
}
