import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from 'engine/log'
import * as spriteUtil from 'engine/anim/spriteUtil'
import * as anim from 'engine/anim/anim'

interface IGoalPiece {
  anim: anim.IAnim
}
let items: IGoalPiece[] = []
export function getAll() {
  return items
}
var animDefault: anim.IAnimData = {
  frames: [spriteUtil.frame32(10, 1)],
  frameTime: 10 / 60,
}
// var animFlag: anim.IAnimData = {
//   frames: spriteUtil.frame32runH(10, 2, 2),
//   frameTime: 10 / 60,
//   loop: true,
// }

let framesFlag = []
for (let j = 0; j < 3; j++) {
  for (let i = 0; i < 3; i++) {
    framesFlag.push(spriteUtil.frame32(8 + j, 11 - i))
  }
}

var animFlag: anim.IAnimData = {
  frames: framesFlag,
  frameTime: 10 / 60,
  loop: true,
}

var animAsteroid: anim.IAnimData = {
  frames: [spriteUtil.frame32(11, 1)],
  frameTime: 10 / 60,
}
var animPlanet: anim.IAnimData = {
  frames: [spriteUtil.frame32(11, 2)],
  frameTime: 10 / 60,
}

export { animDefault, animFlag, animAsteroid, animPlanet }

export function create() {
  let ctx = getContext()

  log.x('create goal piece')
  let item: IGoalPiece = {
    anim: anim.create(),
  }

  item.anim.sprite = ctx.createSprite(
    'ship-001',
    animDefault.frames[0],
    0.5,
    0.5,
    2
  )
  ctx.layerUi.addChild(item.anim.sprite)
  anim.playAnim(item.anim, animDefault)
  items.push(item)

  return item
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()
  let kb = ctx.sge.keyboard

  _.forEach(items, (c) => {
    anim.update(c.anim, elapsedTimeSec)
  })
}
