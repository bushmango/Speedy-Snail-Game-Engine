import { LudumDare40Context } from 'ludumDare40/LudumDare40Context';
import { hats } from 'ludumDare40/entities/hats';

import * as mapLoader from 'ludumDare40/map/MapLoader';

export class MapScanner {
  frames = 0
  lastHats = 0
  //lastButton = false
  //lastDefeated = false
  isScanning = true
  scanY = 0
  update(context: LudumDare40Context) {

    let hidden = 0.15

    this.frames++
    let numHats = context.player.hats.hats.length
    if (!this.isScanning) {

      // if (numHats !== this.lastHats) {
      //   
      //   this.isScanning = true
      //   this.scanY = 0
      // }
      this.lastHats = numHats
      this.isScanning = true
      this.scanY = 0

    } else {
      // Scan and update
      let tm = context.tileMap
      let j = this.scanY
      this.scanY++
      if (j >= tm.blockHeight) {
        this.isScanning = false
      } else {

        for (let i = 0; i < tm.blockWidth; i++) {
          let gs = tm.getTileAt(i, j)

          if (gs.hideBossButtonPressed) {
            gs.canMove = context.pressedBossButton
            gs.sprites[mapLoader.Layer_Wall].alpha = !gs.canMove ? 1 : hidden
          }
          if (gs.hideBossDefeated) {
            gs.canMove = context.defeatedBoss
            gs.sprites[mapLoader.Layer_Wall].alpha = !gs.canMove ? 1 : hidden
          }
          if (gs.hideMidButtonPressed) {
            gs.canMove = context.pressedMidButton
            gs.sprites[mapLoader.Layer_Wall].alpha = !gs.canMove ? 1 : hidden
          }

          if (gs.hatCountHide) {
            if (gs.hatCountHide <= numHats) {
              gs.canMove = true
              gs.sprites[mapLoader.Layer_Wall].alpha = hidden
            } else {
              gs.canMove = false
              gs.sprites[mapLoader.Layer_Wall].alpha = 1
            }
          }
          if (gs.hatCountShow) {
            if (numHats >= gs.hatCountShow) {
              gs.canMove = false
              gs.sprites[mapLoader.Layer_Wall].alpha = 1
            } else {
              gs.canMove = true
              gs.sprites[mapLoader.Layer_Wall].alpha = hidden
            }
          }
        }
      }
    }
  }

}
