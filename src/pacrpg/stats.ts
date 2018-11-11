// stats?
let stats = {
  exp: 0,
  level: 1,
}

let expToNextLevel = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048]

export function getNextExp() {
  let nextExp = expToNextLevel[stats.level]
  if (!nextExp) {
    nextExp = expToNextLevel[expToNextLevel.length - 1]
  }
  return nextExp
}

export function addExp(exp = 1) {
  stats.exp += exp
  let nextExp = getNextExp()

  if (stats.exp > nextExp) {
    stats.level += 1
    stats.exp -= nextExp
    addExp(0) // repeat loop
  }
}

export function getCurrentStats() {
  return stats
}
