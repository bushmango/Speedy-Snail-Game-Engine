import * as spriteUtil from 'engine/anim/spriteUtil'

export interface IWallPieceData {
  frameX: number
  frameY: number
  frame: PIXI.Rectangle
  isPlayerCrash: boolean
}

let tileDatas = []
export function createData(y, x, isPlayerCrash): IWallPieceData {
  let item = {
    frameY: y,
    frameX: x,
    frame: spriteUtil.frame16(y, x),
    isPlayerCrash,
  }

  tileDatas[y * 32 + x] = item

  return item
}

let DataA = createData(3, 1, true)
let DataB = createData(3, 2, true)
let DataC = createData(4, 1, false)
let DataD = createData(5, 1, false)
let DataDefault = DataA

export { DataA, DataB, DataC, DataD, DataDefault, tileDatas }
