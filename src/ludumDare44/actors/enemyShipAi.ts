import { _ } from 'engine/importsEngine'
import { IEnemyShip } from './enemyShips'
import { consts } from './consts'
import { background } from './background'
import { powerPellets } from './powerPellets'

export interface IEnemyShipAi {
  type: string
  onUpdate: (c: IEnemyShip) => void
}

function create(): IEnemyShipAi {
  let map = [
    // {
    //   type: 'straight',
    //   func: createStraight,
    // },
    // {
    //   type: 'circle',
    //   func: createCircle,
    // },
    // {
    //   type: 'random',
    //   func: createRandom,
    // },
    // {
    //   type: 'avoider',
    //   func: createAvoider,
    // },
    {
      type: 'gobbler',
      func: createGobbler,
    },
  ]

  let p = _.sample(map)

  let ai: IEnemyShipAi = {
    type: p.type,
    onUpdate: p.func(),
  }

  return ai
}

function createStraight() {
  return (c: IEnemyShip) => {}
}

function createCircle() {
  let steps = 1
  let radius = _.random(1, 5)
  let turn = _.random(0, 1)
  return (c: IEnemyShip) => {
    steps++
    if (steps >= radius) {
      steps = 0
      if (turn === 0) {
        c.dir = consts.turnLeft(c.dir)
      } else {
        c.dir = consts.turnRight(c.dir)
      }
    }
  }
}

function createRandom() {
  return (c: IEnemyShip) => {
    let t = _.random(0, 2)

    if (t === 0) {
    } else if (t === 1) {
      c.dir = consts.turnRight(c.dir)
    } else if (t === 2) {
      c.dir = consts.turnLeft(c.dir)
    }
  }
}

function createAvoider() {
  return (c: IEnemyShip) => {
    avoidCrashing(c)
  }
}

function createGobbler() {
  return (c: IEnemyShip) => {
    if (!avoidCrashing(c)) {
      let a = getAt(c.bx, c.by, consts.turnLeft(c.dir))
      let b = getAt(c.bx, c.by, consts.turnRight(c.dir))

      _.forEach(powerPellets.getAll(), (d) => {
        if (a && d.bx === a.bx && d.by === a.by) {
          c.dir = consts.turnLeft(c.dir)
          return false
        } else if (b && d.bx === b.bx && d.by === b.by) {
          c.dir = consts.turnRight(c.dir)
          return false
        }
      })
    }
  }
}

function avoidCrashing(c: IEnemyShip) {
  if (!checkAt(c.bx, c.by, c.dir)) {
    // We need to avoid this
    let t = _.random(0, 1)

    let dir1 = consts.turnLeft(c.dir)
    let dir2 = consts.turnRight(c.dir)

    if (t === 1) {
      let temp = dir1
      dir1 = dir2
      dir2 = temp
    }

    if (checkAt(c.bx, c.by, dir1)) {
      c.dir = dir1
    } else if (checkAt(c.bx, c.by, dir2)) {
      c.dir = dir2
    }
    return true
  }
  return false
}

function checkAt(bx, by, dir) {
  let t = getAt(bx, by, dir)
  return t && !t.isDead
}
function getAt(bx, by, dir) {
  let { ox, oy } = consts.dirToOxy(dir)
  let t = background.getAt(bx + ox, by + oy)
  return t
}

function update(c: IEnemyShip) {
  if (c.ai.onUpdate) {
    c.ai.onUpdate(c)
  }
}

export const enemyShipAi = {
  create,
  update,
}
