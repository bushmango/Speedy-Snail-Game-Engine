import * as enemyShips from './enemyShips'
import * as debris from './debris'
import * as shipParts from './shipParts'
import {
  IEnemyShip,
  attachNewPart,
  centerShipGridX,
  centerShipGridY,
} from './enemyShips'

export function spawn1(c: IEnemyShip) {
  let core = attachNewPart(c, 'core-1', centerShipGridX, centerShipGridY)
  attachNewPart(c, 'engine-1', centerShipGridX, centerShipGridY - 1)
  attachNewPart(c, 'engine-2', centerShipGridX, centerShipGridY + 1)

  //setShipGridCenter(c, )

  attachBaby(c, core)
}

export function attachBaby(c: IEnemyShip, sp: shipParts.IShipPart) {
  let de = debris.create('baby')
  de.anim.sprite.x = 200
  de.anim.sprite.y = 200

  de.elapsedEjectTime = 10
  debris.catchDebris(de, sp, true)
}
