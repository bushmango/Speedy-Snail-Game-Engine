import * as spriteUtil from '../../engine/anim/spriteUtil'
import { _ } from 'engine/importsEngine'
import * as anim from '../../engine/anim/anim'

export interface IShipPartData {
  name: string
  frame: PIXI.Rectangle
  //frame2?: PIXI.Rectangle
  anim?: anim.IAnimData
  anim2?: anim.IAnimData
  noLeft?: boolean
  noRight?: boolean
  noTop?: boolean
  noBottom?: boolean
  mass: number
  enginePower?: number
  notSpawnable?: boolean
  damagesTo?: IShipPartData
  clickTo?: IShipPartData
  special?: string
  noColorSwap?: boolean
  extraBright?: boolean
}

let datas: IShipPartData[] = []
let spawnableDatas: IShipPartData[] = []
let core: IShipPartData = {
  name: 'core-1',
  frame: spriteUtil.frame31p1(1, 1),
  mass: 5,
  notSpawnable: true,
  noColorSwap: true,
}
datas.push(core)
export { core }

// let shipPart2: IShipPartData = {
//   name: 'body',
//   frame: spriteUtil.frame31p1(1, 2),
//   mass: 1,
//   notSpawnable: true,
// }
// datas.push(shipPart2)
// export { shipPart2 }

let s: IShipPartData = {
  name: 'cross',
  frame: spriteUtil.frame31p1(1, 7),
  mass: 0.5,
}
datas.push(s)

let wing: IShipPartData = {
  name: 'wing-1',
  frame: spriteUtil.frame31p1(2, 1),
  noRight: true,
  noTop: true,
  mass: 0.5,
}
datas.push(wing)
export { wing }

let wing2: IShipPartData = {
  name: 'wing-2',
  frame: spriteUtil.frame31p1(3, 1),
  noRight: true,
  noBottom: true,
  mass: 0.5,
}
datas.push(wing2)

let sd: IShipPartData = {
  name: 'wing-armor-1d',
  frame: spriteUtil.frame31p1(2, 9),
  noTop: true,
  noRight: true,
  mass: 0.75,
  notSpawnable: true,
}
datas.push(sd)
s = {
  name: 'wing-armor-1',
  frame: spriteUtil.frame31p1(2, 8),
  noTop: true,
  noRight: true,
  mass: 1,
  damagesTo: sd,
}
datas.push(s)

sd = {
  name: 'wing-armor-2d',
  frame: spriteUtil.frame31p1(3, 9),
  noBottom: true,
  noRight: true,
  mass: 0.75,
  notSpawnable: true,
}
datas.push(sd)
s = {
  name: 'wing-armor-2',
  frame: spriteUtil.frame31p1(3, 8),
  noBottom: true,
  noRight: true,
  mass: 1,
  damagesTo: sd,
}
datas.push(s)

s = {
  name: 'tr',
  frame: spriteUtil.frame31p1(1, 8),
  noBottom: true,
  noLeft: true,
  mass: 0.25,
}
datas.push(s)
s = {
  name: 'br',
  frame: spriteUtil.frame31p1(1, 9),
  noTop: true,
  noLeft: true,
  mass: 0.25,
}
datas.push(s)
s = {
  name: 'bl',
  frame: spriteUtil.frame31p1(1, 10),
  noTop: true,
  noRight: true,
  mass: 0.25,
}
datas.push(s)
s = {
  name: 'tl',
  frame: spriteUtil.frame31p1(1, 11),
  noBottom: true,
  noRight: true,
  mass: 0.25,
}
datas.push(s)

s = {
  name: 'h',
  frame: spriteUtil.frame31p1(1, 12),
  noBottom: true,
  noTop: true,
  mass: 0.25,
}
datas.push(s)

s = {
  name: 'v',
  frame: spriteUtil.frame31p1(1, 13),
  noLeft: true,
  noRight: true,
  mass: 0.25,
}
datas.push(s)

s = {
  name: 't',
  frame: spriteUtil.frame31p1(1, 14),
  noLeft: true,
  mass: 0.35,
}
datas.push(s)

var animCa: anim.IAnimData = {
  frames: [spriteUtil.frame31p1(2, 2), spriteUtil.frame31p1(3, 2)],
  frameTime: 30 / 60,
  loop: true,
}

let cockpit: IShipPartData = {
  name: 'cockpit-1',
  frame: spriteUtil.frame31p1(4, 1),

  noRight: true,
  noTop: true,
  noBottom: true,
  mass: 1,
}
datas.push(cockpit)

let eye: IShipPartData = {
  name: 'eye-1',
  frame: spriteUtil.frame31p1(2, 2),
  //frame2: spriteUtil.frame31p1(3, 2),
  anim: animCa,

  noRight: true,
  noTop: true,
  noBottom: true,
  mass: 1,
}
datas.push(eye)

let engine: IShipPartData = {
  name: 'engine-1',
  frame: spriteUtil.frame31p1(2, 3),
  noLeft: true,
  mass: 1,
  enginePower: 1,
  extraBright: true,
}
datas.push(engine)
let engine2: IShipPartData = {
  name: 'engine-2',
  frame: spriteUtil.frame31p1(2, 4),
  noLeft: true,
  mass: 1,
  enginePower: 2,
  extraBright: true,
}
datas.push(engine2)

let armor1d: IShipPartData = {
  name: 'armor-1d',
  frame: spriteUtil.frame31p1(1, 6),
  noRight: true,
  mass: 1.5,
  notSpawnable: true,
}
datas.push(armor1d)
let armor1: IShipPartData = {
  name: 'armor-1',
  frame: spriteUtil.frame31p1(1, 5),
  noRight: true,
  mass: 2,
  damagesTo: armor1d,
}
datas.push(armor1)

let crate1: IShipPartData = {
  name: 'crate-1',
  frame: spriteUtil.frame31p1(3, 3),
  mass: 2,
  special: 'snails',
  noColorSwap: true,
}
datas.push(crate1)

let rocketEmpty: IShipPartData = {
  name: 'rocket-1e',
  frame: spriteUtil.frame31p1(2, 6),
  anim: {
    frames: [spriteUtil.frame31p1(2, 6)],
  },
  mass: 2,
  notSpawnable: true,
  special: 'rocket-spent',
  noColorSwap: true,
}
datas.push(rocketEmpty)

let rocket: IShipPartData = {
  name: 'rocket-1',
  frame: spriteUtil.frame31p1(2, 5),
  anim: {
    frames: [spriteUtil.frame31p1(2, 5), spriteUtil.frame31p1(5, 8)],
    frameTime: 20 / 60,
    loop: true,
  },
  mass: 2,
  special: 'rocket',
  clickTo: rocketEmpty,
  noColorSwap: true,
}
datas.push(rocket)

let rocket2: IShipPartData = {
  name: 'rocket-2',
  frame: spriteUtil.frame31p1(4, 2),
  anim: {
    frames: [spriteUtil.frame31p1(4, 2), spriteUtil.frame31p1(5, 7)],
    frameTime: 20 / 60,
    loop: true,
  },
  mass: 2,
  special: 'rocket',
  clickTo: rocket,
  noColorSwap: true,
}
datas.push(rocket2)

let rocket3: IShipPartData = {
  name: 'rocket-3',
  frame: spriteUtil.frame31p1(4, 5),
  anim: {
    frames: [spriteUtil.frame31p1(4, 5), spriteUtil.frame31p1(5, 6)],
    frameTime: 20 / 60,
    loop: true,
  },
  mass: 2,
  special: 'rocket',
  clickTo: rocket2,
  noColorSwap: true,
}
datas.push(rocket3)

var animL1: anim.IAnimData = {
  frames: [spriteUtil.frame31p1(2, 10)],
  frameTime: 30 / 60,
  loop: true,
}
var animL2: anim.IAnimData = {
  frames: [spriteUtil.frame31p1(2, 7), spriteUtil.frame31p1(3, 10)],
  frameTime: 20 / 60,
  loop: true,
}

let laser: IShipPartData = {
  name: 'laser-1',
  frame: spriteUtil.frame31p1(2, 10),
  anim: animL1,
  anim2: animL2,
  mass: 2,
  special: 'laser',
  noColorSwap: true,
}
datas.push(laser)

spawnableDatas = _.filter(datas, (c: IShipPartData) => !c.notSpawnable)

export { datas, spawnableDatas }
