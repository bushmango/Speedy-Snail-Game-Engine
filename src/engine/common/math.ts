// Basic math

export function wrapRange(val, min, max) {
  let d = max - min
  if (d <= 0) {
    throw new Error('invalid range')
  }
  while (val < min) {
    val += d
  }
  while (val >= max) {
    val -= d
  }
  return val
}
