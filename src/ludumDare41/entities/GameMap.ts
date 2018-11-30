import { TileMap, ITileData, IGridSpot } from 'engine/tiles/TileMap'
import * as tileMapFiller from 'engine/tiles/tileMapFiller'
import { LudumDare41Context } from 'ludumDare41/LudumDare41Context'
// import * as tileMapLoader from 'snakeBattle/tiles/tileMapLoader'

export class GameMap {
  tileMap: TileMap<IGridSpot>

  init(context: LudumDare41Context) {
    let defaultTextureName = 'ase-512-8'
    let tileData: ITileData[] = []
    tileData.push({
      name: 'default',
      textureName: defaultTextureName,
      tx: 1,
      ty: 2,
    })
    tileData.push({
      name: 'wall-1',
      textureName: defaultTextureName,
      tx: 2,
      ty: 2,
    })
    tileData.push({
      name: 'tree-1',
      textureName: defaultTextureName,
      tx: 3,
      ty: 2,
    })
    tileData.push({
      name: 'lava-1',
      textureName: defaultTextureName,
      tx: 4,
      ty: 2,
    })
    tileData.push({
      name: 'treasure-1',
      textureName: defaultTextureName,
      tx: 5,
      ty: 2,
    })
    this.tileMap = new TileMap<IGridSpot>(context.sge, 8, tileData, 1, null)
    this.tileMap.resize(22, 22)

    this.reset()
  }

  update() {}

  reset() {
    //tileMapFiller.strokeRect(this.tileMap, 0, 'wall-1', 0, 0, 22, 22)
    //tileMapFiller.fillRect(this.tileMap, 0, 'default', 1, 1, 22 - 2, 22 - 2)
    tileMapFiller.fillRect(this.tileMap, 0, 'default', 0, 0, 22, 22)
  }

  setLava(x, y) {
    this.setTile(x, y, 3)
  }
  setTile(x, y, t) {
    this.tileMap.setTileAt(0, x, y, t)
  }
}
