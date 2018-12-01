import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'
import { KeyCodes, Keyboard } from 'engine/input/Keyboard'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'
import * as tween from '../../engine/anim/tween'

interface IShipPart {
  anim: anim.IAnim
}
let items: IShipPart[] = []

interface IShipPartData {
  name: string
  frame: PIXI.Rectangle
}

let datas: IShipPartData[] = []
let shipPart1: IShipPartData = {
  name: 'part-1',
  frame: spriteUtil.frame32(1, 1),
}
datas.push(shipPart1)
let shipPart2: IShipPartData = {
  name: 'part-2',
  frame: spriteUtil.frame32(1, 2),
}
datas.push(shipPart2)
let wing: IShipPartData = {
  name: 'wing-1',
  frame: spriteUtil.frame32(2, 1),
}
datas.push(wing)
let cockpit: IShipPartData = {
  name: 'cockpit-1',
  frame: spriteUtil.frame32(2, 2),
}
datas.push(cockpit)
let engine: IShipPartData = {
  name: 'engine-1',
  frame: spriteUtil.frame32(2, 3),
}
datas.push(engine)

export function create() {
  let ctx = getContext()

  log.x('create ship part')
  let item: IShipPart = {
    anim: anim.create(),
  }

  let sprite = ctx.createSprite('ship-001', engine.frame, 0.5, 0.5, 2)
  item.anim.sprite = sprite

  sprite.interactive = true
  sprite.buttonMode = true
  sprite.on('mouseover', () => {
    sprite.tint = 0xcccccccc
  })
  sprite.on('mouseout', () => {
    sprite.tint = 0xffffffff
  })

  ctx.layerPlayer.addChild(sprite)

  // anim.playAnim(item.anim, animRun)
  items.push(item)
  return item
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()
  let kb = ctx.sge.keyboard

  _.forEach(items, (c) => {
    anim.update(c.anim, elapsedTimeSec)

    c.anim.sprite.x -= elapsedTimeSec * 50
  })
}
