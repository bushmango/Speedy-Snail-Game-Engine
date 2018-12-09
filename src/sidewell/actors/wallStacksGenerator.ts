import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as wallPieces from './wallPieces'
import * as wallStacks from './wallStacks'
import * as wallPiecesData from './wallPiecesData'
import * as log from 'engine/log'

export function generate() {
  // Just a test generation

  for (let i = 0; i < 10; i++) {
    addAStack(i)
  }
}

export function addAStack(bx) {
  let s = wallStacks.create(bx)

  let t = _.random(1, 5)
  let b = _.random(1, 5)
  let m = 10 - t - b

  for (let j = 0; j < 10; j++) {
    let p = wallPieces.create()
    wallPieces.moveTo(p, s.bx, j)

    if (j <= t) {
      wallPieces.setData(p, wallPiecesData.DataB)
    } else if (j <= t + m) {
      wallPieces.setData(p, wallPiecesData.DataC)
    } else {
      wallPieces.setData(p, wallPiecesData.DataA)
    }
    // else {
    //   wallPieces.setData(p, wallPiecesData.DataC)
    // }

    s.items.push(p)
  }
}

export function update(elapsedTimeSec: number) {
  let ctx = getContext()
  let camera = ctx.camera
  let cv = ctx.getCameraView()
  let cxy = ctx.getCameraWorldPos()

  let csx = camera.x / camera.scale

  let stacks = wallStacks.getAll()
  if (stacks.length) {
    let lastStack = stacks[stacks.length - 1]

    // log.x(lastStack.bx * 16, camera.x, camera.x + cv.cameraWidth * 0.75)

    // if (lastStack.bx * 16 - csx < cv.cameraWidth * 0.9) {
    //   // Add a stack
    //   addAStack(lastStack.bx + 1)
    // }

    let margin = -32 // +32 for testing

    if (cxy.x + cv.cameraWidth - margin > lastStack.bx * 16) {
      // Add a stack
      addAStack(lastStack.bx + 1)
    }

    _.forEach(stacks, (c) => {
      if (csx + margin > c.bx * 16 + 16) {
        wallStacks.remove(c)
      }
    })
  }
}
