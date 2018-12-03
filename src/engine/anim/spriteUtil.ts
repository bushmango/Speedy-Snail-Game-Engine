export function frame16(y, x, w, h) {
  return new PIXI.Rectangle(16 * x, 16 * y, 16 * w, 16 * h)
}

export function frame32(y, x, w = 1, h = 1) {
  return new PIXI.Rectangle(32 * x, 32 * y, 32 * w, 32 * h)
}

export function frame30p2(y, x, w = 1, h = 1) {
  return new PIXI.Rectangle(32 * x + 2, 32 * y + 2, 32 * w - 4, 32 * h - 4)
}

export function frame31p1(y, x, w = 1, h = 1) {
  return new PIXI.Rectangle(32 * x + 1, 32 * y + 1, 32 * w - 2, 32 * h - 2)
}

export function frame32p(p, y, x, w = 1, h = 1) {
  return new PIXI.Rectangle(
    32 * x + p,
    32 * y + p,
    32 * w - p * 2,
    32 * h - p * 2
  )
}

export function frame32runH(y, x, w = 1) {
  let frames = []
  for (let i = 0; i < w; i++) {
    frames.push(new PIXI.Rectangle(32 * (x + i), 32 * y, 32 * 1, 32 * 1))
  }
  return frames
}
