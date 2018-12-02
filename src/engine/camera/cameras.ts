import { _ } from 'engine/importsEngine'
import * as log from '../log'

const isActive = true

export interface ICamera {
  container: PIXI.Container

  x: number
  y: number
  scale: number

  shakeX: number
  shakeY: number
  shakeFactor: number
  shakeSec: number

  frameDelaySec: number

  frameSlowdownSec: number
  frameSlowdownRate: number
}
let items: ICamera[] = []

export function getAll() {
  return items
}

export function create() {
  log.x('create camera')
  let item: ICamera = {
    container: new PIXI.Container(),
    x: 0,
    y: 0,
    scale: 2,
    shakeX: 0,
    shakeY: 0,
    shakeFactor: 0,
    shakeSec: 0,
    frameDelaySec: 0,
    frameSlowdownSec: 0,
    frameSlowdownRate: 0,
  }
  items.push(item)

  return item
}

export function shake(c: ICamera, shakeSec, shakeFactor) {
  if (shakeFactor >= c.shakeFactor) {
    c.shakeFactor = shakeFactor
    c.shakeSec = shakeSec
  }
}

export function frameDelay(c: ICamera, frameDelaySec) {
  if (frameDelaySec >= c.frameDelaySec) {
    c.frameDelaySec = frameDelaySec
  }
}
export function frameSlowdown(c: ICamera, frameSlowdownSec, frameSlowdownRate) {
  if (
    frameSlowdownSec >= c.frameSlowdownSec ||
    frameSlowdownRate >= c.frameSlowdownRate
  ) {
    c.frameSlowdownSec = frameSlowdownSec
    c.frameSlowdownRate = frameSlowdownRate
  }
}
export function getIsSlowed(c: ICamera) {
  return c.frameSlowdownSec > 0
}

export function applySlowdown(c: ICamera, elapsedTimeSec) {
  if (c.frameDelaySec > 0) {
    elapsedTimeSec = 0
  }
  if (c.frameSlowdownSec > 0) {
    elapsedTimeSec *= c.frameSlowdownRate
  }
  return elapsedTimeSec
}

export function addLayer(c: ICamera, container: PIXI.Container = null) {
  if (!container) {
    container = new PIXI.Container()
  }
  c.container.addChild(container)
  return container
}

export function xyToCamera(c: ICamera, obj) {
  let cx = obj.x / c.container.scale.x - c.container.x / c.container.scale.x
  let cy = obj.y / c.container.scale.y - c.container.y / c.container.scale.y
  return { cx, cy }
}

export function cameraToXY(c: ICamera, obj) {
  let x = obj.x * c.container.scale.x + c.container.x * c.container.scale.x
  let y = obj.y * c.container.scale.y + c.container.y * c.container.scale.y
  return { x, y }
}

export function viewToCameraView(c: ICamera, w, h) {
  let cameraWidth = w / c.container.scale.x
  let cameraHeight = h / c.container.scale.y
  return { cameraWidth, cameraHeight }
}

//export function getCameraView() {}

export function updateAll(elapsedTimeSec, elapsedTimeSecRaw) {
  _.forEach(items, (c) => {
    if (c.shakeSec > 0) {
      c.shakeSec -= elapsedTimeSec
      c.shakeX = _.random(-1, 1, true) * c.shakeFactor
      c.shakeY = _.random(-1, 1, true) * c.shakeFactor
    } else {
      c.shakeFactor = 0
      c.shakeX = 0
      c.shakeY = 0
    }

    if (c.frameDelaySec > 0) {
      c.frameDelaySec -= elapsedTimeSecRaw
    } else if (c.frameSlowdownSec > 0) {
      c.frameSlowdownSec -= elapsedTimeSecRaw
    }

    c.container.position.set(c.x + c.shakeX, c.y + c.shakeY)
    c.container.scale.set(c.scale)
  })
}
