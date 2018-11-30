export interface IPlaceSwitcher {
  x1: number
  x2: number
  y1: number
  y2: number
  elapsedSec: number
  delayIn: number
  delayOut: number
  factor: number
  delay: number
  tx: number
  ty: number
}

export function create(x1, y1, x2, y2): IPlaceSwitcher {
  return {
    x1,
    x2,
    y1,
    y2,
    elapsedSec: 0,
    delayIn: 0,
    delayOut: 0,
    factor: 0.1,
    delay: 0,
    tx: x1,
    ty: y1,
  }
}

export function moveIn(c: IPlaceSwitcher) {
  c.tx = c.x1
  c.ty = c.y1
  c.delay = c.delayIn
  c.elapsedSec = 0
}

export function moveOut(c: IPlaceSwitcher) {
  c.tx = c.x2
  c.ty = c.y2
  c.delay = c.delayOut
  c.elapsedSec = 0
}

// export function moveToX(x: number, elapsedSec: number) {}

// export function moveToY(c: IPlaceSwitcher, y: number, elapsedSec: number) {
//   let adjust = (c.ty - y) * c.factor
//   return adjust
// }

export interface ITarget {
  x: any
  y: any
}

export function startOut(c: IPlaceSwitcher, t: ITarget) {
  t.x = c.x2
  t.y = c.y2
}
export function update(c: IPlaceSwitcher, t: ITarget, elapsedSec: number) {
  if (c.delay > 0) {
    c.delay -= elapsedSec
  } else {
    t.y += (c.ty - t.y) * c.factor * elapsedSec * 60.0
    t.x += (c.tx - t.x) * c.factor * elapsedSec * 60.0
  }
}
