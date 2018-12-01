import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'
import * as cameras from 'engine/camera/cameras'

interface IShipPart {
  anim: anim.IAnim
}
let items: IShipPart[] = []

let tractoredPart: IShipPart = null

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

  let sprite = ctx.createSprite('ship-001', engine.frame, 0.5, 0.5, 1)
  item.anim.sprite = sprite

  sprite.interactive = true
  sprite.buttonMode = true
  sprite.on('mouseover', () => {
    sprite.tint = 0xcccccccc
    tractoredPart = item
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
  let mouse = ctx.sge.getMouse()

  _.forEach(items, (c) => {
    anim.update(c.anim, elapsedTimeSec)

    if (tractoredPart === c) {
      let { cx, cy } = cameras.xyToCamera(ctx.camera, mouse)
      c.anim.sprite.x += (cx - c.anim.sprite.x) * 0.1 * elapsedTimeSec * 60.0
      c.anim.sprite.y += (cy - c.anim.sprite.y) * 0.1 * elapsedTimeSec * 60.0
    } else {
      c.anim.sprite.x -= elapsedTimeSec * 50
    }

    // Destroy if off screen!!
  })
}
