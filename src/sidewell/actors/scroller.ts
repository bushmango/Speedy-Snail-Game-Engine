import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as wallStacksGenerator from './wallStacksGenerator'

export function update(elapsedTimeSec: number) {
  let ctx = getContext()
  let camera = ctx.camera
  let cv = ctx.getCameraView()

  camera.x += 100 * elapsedTimeSec
}
