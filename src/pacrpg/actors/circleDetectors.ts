// import { _ } from 'engine/importsEngine'

// import { getContext } from '../GameContext'
// import * as log from '../../engine/log'

// import * as spriteUtil from '../../engine/anim/spriteUtil'
// import * as anim from '../../engine/anim/anim'

// import * as maps from './../map/maps'

// const isActive = true

// export interface ICircleDetector {
//   x: number
//   y: number
//   ox: number
//   oy: number
//   r: number
// }
// let items: ICircleDetector[] = []


// export function create(ox, oy, r) {
//   let ctx = getContext()
//   log.x('create detector')
//   let item: ICircleDetector = {
//     x: 4,
//     y: 4,
//     ox: ox,
//     oy: oy,
//     r: r
//   }

//   let baseTex = ctx.sge.getTexture('player1')

//   ctx.layerDetectors.addChild(sprite)

//   return item
// }

// export function testAgainstMap(c: IDetector, tx, ty) {
//   let ctx = getContext()
//   let tile = maps.getTileAtWorld(ctx.map, tx + c.ox, ty + c.oy)
//   if (tile) {
//     //    log.x(tile.tileData.t)
//     if (tile.tileData.t === 9) {
//       // Can't move
//       return false
//     } else {
//       return true
//     }
//   }
//   return false
// }

// import { InputControl } from 'engine/gamepad/InputControl'
// export function update(c: IDetector, sprite) {
//   let elapsedTime = 1.0 / 60.0
//   c.anim.sprite.x = sprite.x + c.ox
//   c.anim.sprite.y = sprite.y + c.oy
//   anim.update(c.anim, elapsedTime)
// }
// // export function updateAll() {
// //   _.forEach(items, (c) => {
// //     update(c)
// //   })
// // }
