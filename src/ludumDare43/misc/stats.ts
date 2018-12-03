// stats?
import { _ } from 'engine/importsEngine'

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
}

let stats: IStats = {
  mass: 1,
  speed: 0,
  distancePercentage: 0,
  distance: 0,
  difficulty: 'easy',
  difficultyLabel: 'Easy',
  isResetting: false,
  // distanceMax: 100,
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
  {
    val: 'test',
    label: 'Test',
  },
]

export function nextDifficulty() {
  let i = _.findIndex(difficulties, (c) => c.val == stats.difficulty)
  if (!i || i >= difficulties.length) {
    i = 0
  }
  updateStats({
    difficulty: difficulties[i].val,
    difficultyLabel: difficulties[i].label,
  })
}

export function getCurrentStats() {
  return stats
}

export function updateStats(update: Partial<IStats>) {
  _.merge(stats, update)
}
