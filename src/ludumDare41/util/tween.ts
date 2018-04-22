export function lerp(v0, v1, t) {
  return v0 * (1 - t) + v1 * t
}

export function lerpBounded(v0, v1, t) {
  if (t < 0) { return v0 }
  if (t > 1) { return v1 }
  return v0 * (1 - t) + v1 * t
}

export function bound(v0, v1, t, ease: (t: number) => number) {
  if (t < 0) { return v0 }
  if (t > 1) { return v1 }
  return lerp(v0, v1, ease(t))
}

export function quartInOut(t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t }