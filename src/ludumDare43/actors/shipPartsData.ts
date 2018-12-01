import * as spriteUtil from '../../engine/anim/spriteUtil'

export interface IShipPartData {
  name: string
  frame: PIXI.Rectangle
  noLeft?: boolean
  noRight?: boolean
  noTop?: boolean
  noBottom?: boolean
  mass: number
  enginePower?: number
}

let datas: IShipPartData[] = []
let shipPart1: IShipPartData = {
  name: 'part-1',
  frame: spriteUtil.frame32(1, 1),
  mass: 2,
}
datas.push(shipPart1)
let shipPart2: IShipPartData = {
  name: 'part-2',
  frame: spriteUtil.frame32(1, 2),
  mass: 1,
}
datas.push(shipPart2)
let wing: IShipPartData = {
  name: 'wing-1',
  frame: spriteUtil.frame32(2, 1),
  noRight: true,
  noTop: true,
  mass: 0.5,
}
datas.push(wing)
let wing2: IShipPartData = {
  name: 'wing-2',
  frame: spriteUtil.frame32(3, 1),
  noRight: true,
  noBottom: true,
  mass: 0.5,
}
datas.push(wing2)
let cockpit: IShipPartData = {
  name: 'cockpit-1',
  frame: spriteUtil.frame32(2, 2),
  noRight: true,
  noTop: true,
  noBottom: true,
  mass: 1,
}
datas.push(cockpit)
let engine: IShipPartData = {
  name: 'engine-1',
  frame: spriteUtil.frame32(2, 3),
  noLeft: true,
  mass: 1,
  enginePower: 1,
}
datas.push(engine)
let engine2: IShipPartData = {
  name: 'engine-2',
  frame: spriteUtil.frame32(2, 3),
  noLeft: true,
  mass: 1,
  enginePower: 2,
}
datas.push(engine2)

export { datas, shipPart1 }
