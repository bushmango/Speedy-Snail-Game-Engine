import * as spriteUtil from '../../engine/anim/spriteUtil'
import { _ } from 'engine/importsEngine'

export interface IShipPartData {
  name: string
  frame: PIXI.Rectangle
  noLeft?: boolean
  noRight?: boolean
  noTop?: boolean
  noBottom?: boolean
  mass: number
  enginePower?: number
  notSpawnable?: boolean
  damagesTo?: IShipPartData
  special?: string
}

let datas: IShipPartData[] = []
let spawnableDatas: IShipPartData[] = []
let shipPart1: IShipPartData = {
  name: 'core-1',
  frame: spriteUtil.frame32(1, 1),
  mass: 5,
  notSpawnable: true,
}
datas.push(shipPart1)
let shipPart2: IShipPartData = {
  name: 'part-2',
  frame: spriteUtil.frame32(1, 2),
  mass: 1,
}
datas.push(shipPart2)
let s: IShipPartData = {
  name: 'connector-1',
  frame: spriteUtil.frame32(1, 7),
  mass: 0.5,
}
datas.push(s)
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
  frame: spriteUtil.frame32(2, 4),
  noLeft: true,
  mass: 1,
  enginePower: 2,
}
datas.push(engine2)

let armor1d: IShipPartData = {
  name: 'armor-1d',
  frame: spriteUtil.frame32(1, 6),
  noRight: true,
  mass: 1.5,
  notSpawnable: true,
}
datas.push(armor1d)
let armor1: IShipPartData = {
  name: 'armor-1',
  frame: spriteUtil.frame32(1, 5),
  noRight: true,
  mass: 2,
  damagesTo: armor1d,
}
datas.push(armor1)

let crate1: IShipPartData = {
  name: 'crate-1',
  frame: spriteUtil.frame32(3, 3),
  mass: 2,
  special: 'snails',
}
datas.push(armor1)

spawnableDatas = _.filter(datas, (c: IShipPartData) => !c.notSpawnable)

export { datas, shipPart1, spawnableDatas }
