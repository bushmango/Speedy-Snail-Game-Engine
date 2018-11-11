import { _ } from 'engine/importsEngine'

import * as tiledMapTilesLoader from 'engine/tiles2/tiledMapTilesLoader'
import * as tiledMapLayerLoader from 'engine/tiles2/tiledMapLayerLoader'
import * as maps from './maps'
import * as log from 'engine/log'

import * as tileData from './tileDatas'

import { getContext } from './../GameContext'
import { catDeck } from 'ludumDare41/server/CardInfo'

import * as coins from '../actors/coins'
import * as enemies from '../actors/enemies'
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
    (bx, by, t, tx, ty, flwasipX, flipY, rot) => {
      // log.x('tile', bx, by, tx, ty, t)

      if (t) {
        if (t === 11) {
          let c = coins.create()
          coins.moveToB(c, bx, by)
          t = 10
        }

        let td = tileData.getTileData(t, numTileColumns)

        maps.setTile(map, bx, by, td)
      }

      // if(t )
    }
  )
}

function loadLayer_spawn(data: tiledMapLayerLoader.ILayerData, numTileColumns) {
  tiledMapLayerLoader.loadLayer(
    data,
    numTileColumns,
    (bx, by, t, tx, ty, flwasipX, flipY, rot) => {
      // log.x('tile', bx, by, tx, ty, t)

      if (t) {
        let td = tileData.getTileData(t, numTileColumns)
        if (td.props) {
          if (td.props.enemy) {
            log.x('spawn enemy!')

            let c = enemies.create(td.props.enemy)
            enemies.moveToB(c, bx, by)
          }
        }

        // if (t === 26) {
        //   let c = enemies.create('cactus')
        //   enemies.moveToB(c, bx, by)
        // }
        // if (t === 27) {
        //   let c = enemies.create('rat')
        //   enemies.moveToB(c, bx, by)
        // }
        // if (t === 28) {
        //   let c = enemies.create('bat')
        //   enemies.moveToB(c, bx, by)
        // }
        // if (t === 29) {
        //   let c = enemies.create('goblin')
        //   enemies.moveToB(c, bx, by)
        // }

        //

        //maps.setTile(map, bx, by, td)
      }

      // if(t )
    }
  )
}
