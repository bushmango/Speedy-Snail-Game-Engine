import { TileMap } from 'engine/tiles/TileMap'
import { ILD44GridSpot } from './ILD44GridSpot'

const tilesPerRow = 32
const tilesetWidth = 512
const tilesetHeight = 512
const defaultTextureName = 'public/ludumdare40/images/ase-512-16.png'

const Rot_90_Flag = 0xa0000000
const Rot_180_Flag = 0xc0000000
const Rot_270_Flag = 0x60000000

const FlippedHorizontallyFlag = 0x80000000
const FlippedVerticallyFlag = 0x40000000
const FlippedAntiDiagonallyFlag = 0x20000000

const MinFlag = 0x10000000

export function loadBasicLayer(
  json,
  xDest,
  yDest,
  tm: TileMap<ILD44GridSpot>,
  layer,
  data: any,
  pcb: (t: number, x: number, y: number) => any,
  cb: (gs: ILD44GridSpot, t: number, x: number, y: number) => any,
  clearEmpty: boolean = true
) {
  let { width, height } = json

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      let ix = i + xDest
      let jy = j + yDest

      let idxDest = jy * tm.blockWidth + ix
      let idxSrc = j * width + i
      let d = tm.data[idxDest]

      let t = data[idxSrc] - 1

      // .. beep boop
      if (t > 1) {
        let flipX = false
        let flipY = false
        let rot = 0

        // Check for flipping
        if (t > MinFlag) {
          if (t & FlippedHorizontallyFlag) {
            t -= FlippedHorizontallyFlag
            flipX = !flipX
          }
          if (t & FlippedVerticallyFlag) {
            t -= FlippedVerticallyFlag
            flipY = !flipY
          }

          if (t & FlippedAntiDiagonallyFlag) {
            t -= FlippedAntiDiagonallyFlag
            flipX = !flipX
            //flipY = !flipY

            rot = Math.PI * 0.5

            if (flipY && !flipX) {
              //t = 4
              rot = -Math.PI * 0.5
            }

            if (!flipY && flipX) {
              //t = 4
              flipY = !flipY
              flipX = !flipX
            }
          }

          if (t & Rot_90_Flag) {
            t -= Rot_90_Flag
            t = 4
            //rot = Math.PI * 0.5
          }
          if (t & Rot_180_Flag) {
            t -= Rot_180_Flag
            t = 4
            //rot = Math.PI * 1
          }
          if (t & Rot_270_Flag) {
            t -= Rot_270_Flag
            t = 4
            //rot = Math.PI * 1.5
          }
        }

        let x = t % tilesPerRow
        let y = Math.floor(t / tilesPerRow)
        if (pcb) {
          t = pcb(t, x, y)
          x = t % tilesPerRow
          y = Math.floor(t / tilesPerRow)
        }

        let texKey = '_' + y + '_' + x

        if (x >= 512 || y >= 512) {
          console.error('bad tex', t, x, y, ' at ', i, j)
          continue
        }

        if (false === tm.hasTile(texKey)) {
          let newTile = {
            name: texKey,
            textureName: defaultTextureName,
            tx: x,
            ty: y,
          }
          tm.addTile(newTile)
        }

        let gs = tm.setTileAtEx(layer, ix, jy, texKey, flipX, flipY, rot)

        if (cb) {
          cb(gs, t, x, y)
        }
      } else {
        if (clearEmpty) {
          let gs = tm.clearTileAt(layer, ix, jy)

          if (cb) {
            cb(gs, t, 0, 0)
          }
        }
      }
    }
  }
}
