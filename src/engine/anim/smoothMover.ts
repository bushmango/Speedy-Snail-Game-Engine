export interface ISmoothMover {
  elapsedSec: number
  delay: number
  factor: number
  tx: number
  ty: number
}

export function create(tx, ty): ISmoothMover {
  return {
    tx,
    ty,
    elapsedSec: 0,
    delay: 0,
    factor: 0.1,
  }
}

export function moveTo(c: ISmoothMover, tx, ty, delay = 0) {
  c.tx = tx
  c.ty = ty
  c.delay = delay
  c.elapsedSec = 0
}

export interface ITarget {
  x: any
  y: any
}
export function update(c: ISmoothMover, t: ITarget, elapsedSec: number) {
  if (c.delay > 0) {
    c.delay -= elapsedSec
  } else {
    t.x += (c.tx - t.x) * c.factor * elapsedSec * 60.0
    t.y += (c.ty - t.y) * c.factor * elapsedSec * 60.0
  }
}
