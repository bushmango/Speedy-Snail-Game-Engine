import { IEnemyShip } from './enemyShips'
import { consts } from './consts';

export interface IEnemyShipAi {
  speed: number
}

function create(): IEnemyShipAi {
  return {
    speed: 1,
  }
}

function update(c: IEnemyShip) {
  c.dir = consts.turnRight(c.dir)
}

export const enemyShipAi = {
  create,
  update,
}
