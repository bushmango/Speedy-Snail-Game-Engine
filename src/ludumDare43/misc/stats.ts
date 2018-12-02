// stats?
import { _ } from 'engine/importsEngine'

interface IStats {
  mass: number
  speed: number
  distancePercentage: number
  distance: number
  //distanceMax: number
}

let stats: IStats = {
  mass: 1,
  speed: 0,
  distancePercentage: 0,
  distance: 0,
  // distanceMax: 100,
}

export function getCurrentStats() {
  return stats
}

export function updateStats(update: Partial<IStats>) {
  _.merge(stats, update)
}
