const Rot_90_Flag = 0xa0000000
const Rot_180_Flag = 0xc0000000
const Rot_270_Flag = 0x60000000

const FlippedHorizontallyFlag = 0x80000000
const FlippedVerticallyFlag = 0x40000000
const FlippedAntiDiagonallyFlag = 0x20000000

const MinFlag = 0x10000000

export interface ITiledMapJson {
  width: number
  height: number
  layers: ILayerData[]
}

export interface ILayerData {
  name: string
  width: number
  height: number
  data: number[]
}

export function loadLayer(
  layerData: ILayerData,
  numTileColumns: number,
  onTile: (x, y, t, tx, ty, flipX, flipY, rot) => void
) {
  let { width, height } = layerData

  let xDest = 0
  let yDest = 0

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      let ix = i + xDest
      let iy = j + yDest
      let idxSrc = j * width + i

      // Get our tile index
      let t = layerData.data[idxSrc] - 1

      let tilesPerRow = numTileColumns

      // .. beep boop
      if (t <= 0) {
        // Null tile
        onTile(ix, iy, 0, 0, 0, false, false, 0)
      } else {
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
            // This doesn't seem to be working?
            //rot = Math.PI * 0.5
          }
          if (t & Rot_180_Flag) {
            t -= Rot_180_Flag
            t = 4
            // This doesn't seem to be working?
            //rot = Math.PI * 1
          }
          if (t & Rot_270_Flag) {
            t -= Rot_270_Flag
            t = 4
            // This doesn't seem to be working?
            //rot = Math.PI * 1.5
          }
        }

        let tx = t % tilesPerRow
        let ty = Math.floor(t / tilesPerRow)

        onTile(ix, iy, t, tx, ty, flipX, flipY, rot)
      }
    }
  }
}
