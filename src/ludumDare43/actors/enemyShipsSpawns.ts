import * as enemyShips from './enemyShips'
import * as debris from './debris'
import * as shipParts from './shipParts'
import {
  IEnemyShip,
  attachNewPart,
  centerShipGridX,
  centerShipGridY,
} from './enemyShips'

export function attachBaby(c: IEnemyShip, sp: shipParts.IShipPart) {
  let de = debris.create('baby')
  de.anim.sprite.x = 200
  de.anim.sprite.y = 200

  de.elapsedEjectTime = 10
  debris.catchDebris(de, sp, true)

  //debris.
}
export function attachCore(c: IEnemyShip) {
  let core = attachNewPart(c, 'core-1', centerShipGridX, centerShipGridY)
  attachBaby(c, core)
}

export function spawn1() {
  let c = enemyShips.create()
  attachCore(c)
  attachNewPart(c, 'engine-1', centerShipGridX, centerShipGridY - 1)
  attachNewPart(c, 'engine-2', centerShipGridX, centerShipGridY + 1)
  return c
}

export function spawn2() {
  let c = enemyShips.create()
  attachCore(c)
  attachNewPart(c, 'engine-1', centerShipGridX - 1, centerShipGridY + 0)
  attachNewPart(c, 'wing-1', centerShipGridX + 0, centerShipGridY - 1)
  attachNewPart(c, 'wing-2', centerShipGridX + 0, centerShipGridY + 1)
  attachNewPart(c, 'cockpit-1', centerShipGridX + 1, centerShipGridY + 0)
  return c
}

export function spawn3() {
  // Baby bomber
  let c = enemyShips.create()
  attachCore(c)
  attachNewPart(c, 'engine-1', centerShipGridX - 2, centerShipGridY + 2)
  attachNewPart(c, 'engine-1', centerShipGridX - 2, centerShipGridY + 0)
  attachNewPart(c, 'engine-1', centerShipGridX - 2, centerShipGridY - 2)

  attachNewPart(c, 'cross', centerShipGridX - 1, centerShipGridY - 0)
  attachNewPart(c, 'cross', centerShipGridX + 1, centerShipGridY - 0)

  attachNewPart(c, 'baby-head', centerShipGridX + 0, centerShipGridY - 1)
  attachNewPart(c, 'baby-head', centerShipGridX + 0, centerShipGridY - 2)
  attachNewPart(c, 'baby-head', centerShipGridX + 0, centerShipGridY + 1)
  attachNewPart(c, 'baby-head', centerShipGridX + 0, centerShipGridY + 2)

  attachNewPart(c, 'baby-head', centerShipGridX + 1, centerShipGridY - 1)
  attachNewPart(c, 'baby-head', centerShipGridX + 1, centerShipGridY - 2)
  attachNewPart(c, 'baby-head', centerShipGridX + 1, centerShipGridY + 1)
  attachNewPart(c, 'baby-head', centerShipGridX + 1, centerShipGridY + 2)

  attachNewPart(c, 'baby-head', centerShipGridX - 1, centerShipGridY - 1)
  attachNewPart(c, 'baby-head', centerShipGridX - 1, centerShipGridY - 2)
  attachNewPart(c, 'baby-head', centerShipGridX - 1, centerShipGridY + 1)
  attachNewPart(c, 'baby-head', centerShipGridX - 1, centerShipGridY + 2)

  return c
}

export function spawn4() {
  // Baby gunship
  let c = enemyShips.create()
  attachCore(c)

  

  attachNewPart(c, 'engine-2', centerShipGridX - 2, centerShipGridY + 2)
  //attachNewPart(c, 'engine-1', centerShipGridX - 2, centerShipGridY + 0)
  attachNewPart(c, 'engine-2', centerShipGridX - 2, centerShipGridY - 2)

  attachNewPart(c, 'armor-1', centerShipGridX - 1, centerShipGridY - 0, true)
  attachNewPart(c, 'v', centerShipGridX + 1, centerShipGridY - 0)

  //attachNewPart(c, 'baby-head', centerShipGridX + 0, centerShipGridY - 1)
  //attachNewPart(c, 'baby-head', centerShipGridX + 0, centerShipGridY - 2)
  //attachNewPart(c, 'baby-head', centerShipGridX + 0, centerShipGridY + 1)

  //attachNewPart(c, 'baby-head', centerShipGridX + 1, centerShipGridY - 1)
  //attachNewPart(c, 'baby-head', centerShipGridX + 1, centerShipGridY - 2)

  //attachNewPart(c, 'baby-head', centerShipGridX + 1, centerShipGridY + 1)

  attachNewPart(c, 'crate-1', centerShipGridX + 0, centerShipGridY - 1)
  attachNewPart(c, 'crate-1', centerShipGridX + 0, centerShipGridY + 1)

  attachNewPart(c, 't', centerShipGridX + 1, centerShipGridY - 1, true)
  attachNewPart(c, 't', centerShipGridX + 1, centerShipGridY + 1, true)

  attachNewPart(c, 'wing-armor-1', centerShipGridX + 1, centerShipGridY - 2)
  attachNewPart(c, 'wing-armor-2', centerShipGridX + 1, centerShipGridY + 2)

  attachNewPart(c, 'laser-1', centerShipGridX - 1, centerShipGridY - 1, true)
  attachNewPart(c, 'bl', centerShipGridX - 1, centerShipGridY - 2)
  //attachNewPart(c, 'armor-1', centerShipGridX - 2, centerShipGridY - 2)
  attachNewPart(c, 'laser-1', centerShipGridX - 1, centerShipGridY + 1, true)
  attachNewPart(c, 'tl', centerShipGridX - 1, centerShipGridY + 2)
  //attachNewPart(c, 'laser-1', centerShipGridX - 2, centerShipGridY + 0)
}

export function spawn5() {
  let c = enemyShips.create()
  attachCore(c)
  attachNewPart(c, 'engine-1', centerShipGridX - 1, centerShipGridY + 0)
  attachNewPart(c, 'wing-1', centerShipGridX + 0, centerShipGridY - 1)
  attachNewPart(c, 'wing-2', centerShipGridX + 0, centerShipGridY + 1)
  attachNewPart(c, 'cockpit-1', centerShipGridX + 1, centerShipGridY + 1)
  return c
}

export function spawn6() {
  let c = enemyShips.create()
  attachCore(c)
  attachNewPart(c, 'engine-1', centerShipGridX - 1, centerShipGridY + 0)
  attachNewPart(c, 'wing-1', centerShipGridX + 0, centerShipGridY - 1)
  attachNewPart(c, 'wing-2', centerShipGridX + 0, centerShipGridY + 1)
  attachNewPart(c, 'cockpit-1', centerShipGridX + 1, centerShipGridY + 1)
  return c
}

export function spawn7() {
  let c = enemyShips.create()
  attachCore(c)
  attachNewPart(c, 'engine-1', centerShipGridX - 1, centerShipGridY + 0)
  attachNewPart(c, 'wing-1', centerShipGridX + 0, centerShipGridY - 1)
  attachNewPart(c, 'wing-2', centerShipGridX + 0, centerShipGridY + 1)
  attachNewPart(c, 'cockpit-1', centerShipGridX + 1, centerShipGridY + 1)
  return c
}

export function spawn8() {
  let c = enemyShips.create()
  attachCore(c)
  attachNewPart(c, 'engine-1', centerShipGridX - 1, centerShipGridY + 0)
  attachNewPart(c, 'wing-1', centerShipGridX + 0, centerShipGridY - 1)
  attachNewPart(c, 'wing-2', centerShipGridX + 0, centerShipGridY + 1)
  attachNewPart(c, 'cockpit-1', centerShipGridX + 1, centerShipGridY + 1)
  return c
}

export function spawn9() {
  let c = enemyShips.create()
  attachCore(c)
  attachNewPart(c, 'engine-1', centerShipGridX - 1, centerShipGridY + 0)
  attachNewPart(c, 'wing-1', centerShipGridX + 0, centerShipGridY - 1)
  attachNewPart(c, 'wing-2', centerShipGridX + 0, centerShipGridY + 1)
  attachNewPart(c, 'cockpit-1', centerShipGridX + 1, centerShipGridY + 1)
  return c
}
