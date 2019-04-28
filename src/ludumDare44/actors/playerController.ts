import { IEnemyShip } from 'ludumDare44/actors/enemyShips'
import { getContext } from 'ludumDare44/GameContext'
import { KeyCodes } from 'engine/input/Keyboard'

function update(c: IEnemyShip) {
  let ctx = getContext()

  let kb = ctx.sge.keyboard

  if (kb.justPressed(KeyCodes.arrowUp) || kb.justPressed(KeyCodes.w)) {
    if (c.lastDir !== 2) {
      c.dir = 0
    }
  }
  if (kb.justPressed(KeyCodes.arrowRight) || kb.justPressed(KeyCodes.d)) {
    if (c.lastDir !== 3) {
      c.dir = 1
    }
  }
  if (kb.justPressed(KeyCodes.arrowDown) || kb.justPressed(KeyCodes.s)) {
    if (c.lastDir !== 0) {
      c.dir = 2
    }
  }
  if (kb.justPressed(KeyCodes.arrowLeft) || kb.justPressed(KeyCodes.a)) {
    if (c.lastDir !== 1) {
      c.dir = 3
    }
  }
}

export const playerConroller = {
  update,
}
