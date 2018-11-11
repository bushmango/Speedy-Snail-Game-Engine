// stats?
let stats = {
  exp: 0,
}

export function addExp(exp = 1) {
  stats.exp += exp
}

export function getCurrentStats() {
  return stats
}
