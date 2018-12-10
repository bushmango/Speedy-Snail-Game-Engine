import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as wallPieces from './wallPieces'
import * as wallStacks from './wallStacks'
import * as wallPiecesData from './wallPiecesData'
import * as log from 'engine/log'

let bHeight = 10

let item = {
  minGap: bHeight - 3,
  top: 1,
  bottom: 1,
  lastTop: 1,
  lastGap: 8,
}

export function generate() {
  // Just a test generation

  for (let i = 0; i < 10; i++) {
    addAStack(i)
  }
}

export function addAStack(bx) {
  let s = wallStacks.create(bx)

  if (bx % 10 === 0 && bx > 20) {
    item.minGap--
  }
  if (item.minGap < 2) {
    item.minGap = 2
  }

  let stacks = wallStacks.getAll()
  for (let iTry = 0; iTry < 100; iTry++) {
    //let dGap = 0
    // let minT = 0
    // let maxT = 0
    // if (newGap >= item.lastGap) {
    //   //minT =
    //   // Allowable difference
    // } else {
    //   // Must fit inside

    // }

    let newGap = _.random(item.minGap, 8)

    let minT = item.lastTop - (newGap - 2)
    let maxT = item.lastTop + item.lastGap - (newGap - 2)
    if (minT < item.top) {
      minT = item.top
    }
    if (maxT > bHeight - item.bottom) {
      maxT = bHeight - item.bottom
    }
    if (maxT < minT) {
      maxT = minT
    }

    // if (maxT + newGap > b) {
    //   maxT = b - newGap
    // }

    let newTop = _.random(minT, maxT)
    let b = bHeight - item.bottom - 1
    if (newTop + newGap > b) {
      newGap = b - newTop
    }

    log.x(minT, maxT, newGap, newTop)

    //if(bHeight - newTop - newGap )

    // if (newTop < item.top) {
    //   newTop = item.top
    // }

    // let left = bHeight - gap - item.top
    // let bottom = bHeight - top - gap

    // Make sure we have a path thru
    let isValid = true

    if (stacks.length > 0) {
      let lastStack = stacks[stacks.length - 1]

      // check for two gaps
    }
    if (isValid) {
      item.lastTop = newTop
      item.lastGap = newGap

      for (let j = 0; j < 10; j++) {
        let p = wallPieces.create()
        wallPieces.moveTo(p, s.bx, j)

        if (j <= newTop) {
          wallPieces.setData(p, wallPiecesData.DataB)
        } else if (j <= newTop + newGap) {
          wallPieces.setData(p, wallPiecesData.DataC)
        } else {
          wallPieces.setData(p, wallPiecesData.DataA)
        }
        // else {
        //   wallPieces.setData(p, wallPiecesData.DataC)
        // }

        s.items.push(p)
      }

      break
    }
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
