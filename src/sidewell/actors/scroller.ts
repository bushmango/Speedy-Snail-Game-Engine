import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as wallStacksGenerator from './wallStacksGenerator'

import * as smoothMoves from 'engine/anim/smoothMover'

let item = {
  smoothMover: smoothMoves.create(0, 0),
}

export function update(elapsedTimeSec: number) {
  let ctx = getContext()
  let camera = ctx.camera
  let view = ctx.sge.getViewSize()
  let cv = ctx.getCameraView()
  let cxy = ctx.getCameraWorldPos()

  let player = ctx.player1

  let targetCameraX = (player.x - cv.cameraWidth * 0.25) * 2
  let targetCameraY = -(view.height / 2 - 16 * 10)
  if (camera.x < targetCameraX) {
    smoothMoves.moveTo(item.smoothMover, targetCameraX, targetCameraY)
    //camera.x += 200 * elapsedTimeSec
    //camera.x = player.x / camera.scale
  } else {
    smoothMoves.moveTo(item.smoothMover, camera.x, targetCameraY)
  }
  smoothMoves.update(item.smoothMover, camera, elapsedTimeSec)
}
