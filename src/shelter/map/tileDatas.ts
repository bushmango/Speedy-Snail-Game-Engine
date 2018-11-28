import * as _ from 'lodash'
import * as log from 'engine/log'
import * as spriteUtil from 'engine/anim/spriteUtil'

let tileDatas: any = {}
let tileProps: any = {}

// TODO: configure tile size, num columns -- load from tile json?

export interface ITileData {
  t: number
  tx: number
  ty: number
  rect: PIXI.Rectangle
  tex: PIXI.Texture
  props: any
}

export function loadTileProps(data) {
  let t = data.id
  let tileProp = {
    t,
  }
  _.forEach(data.properties, (c) => {
    log.x(t, c.name, c.value)
    tileProp[c.name] = c.value
  })

  tileProps[t] = tileProp
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
      props: tileProps[t],
    }
    tileDatas[t] = tileData
  }
  return tileData
}
