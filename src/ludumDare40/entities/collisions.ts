import { Player } from 'ludumDare40/entities/Player'
import { Blob } from 'ludumDare40/entities/Blob'

import { IBounds } from './BoundsDrawer'

export function checkPlayerVsBlob(player: Player, blob: Blob) {

  // Get player bounds



}


export function isRectOverlap(a: IBounds, b: IBounds) {

  if (a.boundsX2 < b.boundsX1 || a.boundsX1 > b.boundsX2) {
    return false
  }
  if (a.boundsY2 < b.boundsY1 || a.boundsY1 > b.boundsY2) {
    return false
  }
  return true

}