// stats?
import { _ } from 'engine/importsEngine'

import { getIsFinal } from './../GameContext'

type TDiff = 'easy' | 'hard' | 'test' | 'free-build' | 'endless'

interface IStats {
  mass: number
  speed: number
  distancePercentage: number
  distance: number
  //distanceMax: number
  difficulty: TDiff
  difficultyLabel: string
  isResetting: boolean
  victory: boolean
  totalTime: number
  blocksDestroyed: number
}

let stats: IStats = {
  mass: 1,
  speed: 0,
  distancePercentage: 0,
  distance: 0,
  difficulty: 'easy',
  difficultyLabel: 'Easy',
  isResetting: false,
  victory: false,
  totalTime: 0,
  blocksDestroyed: 0,
  // distanceMax: 100,
}

export function reset() {
  updateStats({
    totalTime: 0,
    blocksDestroyed: 0,
  })
}

export function addSmashedBlock() {
  stats.blocksDestroyed++
}
export function addTime(time) {
  stats.totalTime += time
}

interface IDiff {
  val: TDiff
  label: string
}
let difficulties: IDiff[] = [
  {
    val: 'easy',
    label: 'Easy',
  },
  {
    val: 'hard',
    label: 'Hard',
  },
  {
    val: 'endless',
    label: 'Endless',
  },
  {
    val: 'free-build',
    label: 'Free Build',
  },
]

if (!getIsFinal()) {
  difficulties.push({
    val: 'test',
    label: 'Test',
  })
}

export function setEasyDifficulty() {
  updateStats({
    difficulty: difficulties[0].val,
    difficultyLabel: difficulties[0].label,
  })
}

export function nextDifficulty() {
  let i = _.findIndex(difficulties, (c) => c.val == stats.difficulty)
  i++
  if (i >= difficulties.length) {
    i = 0
  }
  updateStats({
    difficulty: difficulties[i].val,
    difficultyLabel: difficulties[i].label,
  })
}

export function setDifficulty(diff) {
  let i = _.findIndex(difficulties, (c) => c.val == diff)
  if (i !== -1) {
    updateStats({
      difficulty: difficulties[i].val,
      difficultyLabel: difficulties[i].label,
    })
  }
}

export function getCurrentStats() {
  return stats
}

export function updateStats(update: Partial<IStats>) {
  _.merge(stats, update)
}
