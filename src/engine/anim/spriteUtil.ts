export function frame16(y, x, w, h) {
  return new PIXI.Rectangle(16 * x, 16 * y, 16 * w, 16 * h)
}

export function frame32(y, x, w = 1, h = 1) {
  return new PIXI.Rectangle(32 * x, 32 * y, 32 * w, 32 * h)
}
