import * as enemyShips from './enemyShips'
import {
  IEnemyShip,
  attachNewPart,
  centerShipGridX,
  centerShipGridY,
} from './enemyShips'

export function spawn1(c: IEnemyShip) {
  attachNewPart(c, 'core-1', centerShipGridX, centerShipGridY)
  attachNewPart(c, 'engine-1', centerShipGridX, centerShipGridY - 1)
  attachNewPart(c, 'engine-2', centerShipGridX, centerShipGridY + 1)

  //setShipGridCenter(c, )
}
