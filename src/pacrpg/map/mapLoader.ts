import { _ } from 'engine/importsEngine'

import * as tiledMapTilesLoader from 'engine/tiles2/tiledMapTilesLoader'
import * as tiledMapLayerLoader from 'engine/tiles2/tiledMapLayerLoader'
import * as maps from './maps'
import * as log from 'engine/log'

import * as tileData from './tileDatas'

// const Layer_Path = 0
// const Layer_Spawn = 1
// const Num_Layers = 2
// export { Layer_Path, Layer_Spawn, Num_Layers }

export interface ISpawnLocation {
  bx: number
  by: number
  data?: any
}
export interface IMapMedatada {
  spawns: ISpawnLocation[]
}

export function load(
  map: maps.IMap,
  jsonTiles: tiledMapTilesLoader.ITiledTilesJson,
  jsonMap: tiledMapLayerLoader.ITiledMapJson
) {
  log.x('load map')

  let { width, height } = jsonMap

  maps.resize(map, width, height)

  let numTileColumns = jsonTiles.columns

  _.forEach(jsonMap.layers, (layer) => {
    log.x('processing layer', layer.name)

    if (layer.name === 'path') {
      loadLayer_path(map, layer, numTileColumns)
    } else if (layer.name === 'spawn') {
      loadLayer_spawn(layer, numTileColumns)
    } else {
      log.x('unknown layer', layer.name)
    }
  })
}

function loadLayer_path(
  map: maps.IMap,
  data: tiledMapLayerLoader.ILayerData,
  numTileColumns
) {
  tiledMapLayerLoader.loadLayer(
    data,
    numTileColumns,
    (x, y, t, tx, ty, flipX, flipY, rot) => {
      log.x('tile', x, y, tx, ty, t)

      if (t) {
        let td = tileData.getTileData(t, numTileColumns)

        maps.setTile(map, x, y, td)
      }

      // if(t )
    }
  )

  // loadBasicLayer(
  //   json,
  //   x,
  //   y,
  //   tm,
  //   Layer_Background,
  //   data,
  //   (t) => {
  //     return t
  //   },
  //   (gs, t) => {}
  // )
}

function loadLayer_spawn(data: tiledMapLayerLoader.ILayerData, numTileColumns) {
  // loadBasicLayer(
  //   json,
  //   x,
  //   y,
  //   tm,
  //   Layer_Background,
  //   data,
  //   (t) => {
  //     return t
  //   },
  //   (gs, t) => {}
  // )
}
