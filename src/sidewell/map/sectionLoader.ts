import { _ } from 'engine/importsEngine'

import * as tiledMapTilesLoader from 'engine/tiles2/tiledMapTilesLoader'
import * as tiledMapLayerLoader from 'engine/tiles2/tiledMapLayerLoader'
// import * as maps from './maps'
import * as log from 'engine/log'

import * as tileData from './tileDatas'

import { getContext } from '../GameContext'

import * as wallStacksGenerator2 from './../actors/wallStacksGenerator2'

export interface ISpawnLocation {
  bx: number
  by: number
  data?: any
}
export interface IMapMedatada {
  spawns: ISpawnLocation[]
}

export function load(
  jsonTiles: tiledMapTilesLoader.ITiledTilesJson,
  jsonMap: tiledMapLayerLoader.ITiledMapJson,
  bx: number
) {
  log.x('load section')
  let { width, height } = jsonMap
  if (height !== 10) {
    throw `height is not 10 - ${height}`
  }

  let numTileColumns = jsonTiles.columns

  _.forEach(jsonMap.layers, (layer) => {
    log.x('processing layer', layer.name)

    if (layer.name === 'back') {
      loadLayer_back(layer, numTileColumns, bx)
    } else if (layer.name === 'collision') {
      loadLayer_collision(layer, numTileColumns, bx)
    } else if (layer.name === 'fore') {
      loadLayer_fore(layer, numTileColumns, bx)
    } else {
      log.x('unknown layer', layer.name)
    }
  })
}

function loadLayer_back(
  data: tiledMapLayerLoader.ILayerData,
  numTileColumns: number,
  sbx: number
) {
  tiledMapLayerLoader.loadLayer(
    data,
    numTileColumns,
    (bx, by, t, tx, ty, flipX, flipY, rot) => {
      if (t) {
        wallStacksGenerator2.setBack(sbx + bx, by, t, tx, ty)
      } else {
        wallStacksGenerator2.setBack(sbx + bx, by, 0, 0, 0)
      }
    }
  )
}
function loadLayer_collision(
  data: tiledMapLayerLoader.ILayerData,
  numTileColumns: number,
  sbx: number
) {
  tiledMapLayerLoader.loadLayer(
    data,
    numTileColumns,
    (bx, by, t, tx, ty, flipX, flipY, rot) => {
      if (t) {
        wallStacksGenerator2.setCollision(sbx + bx, by, t, tx, ty)
      } else {
        wallStacksGenerator2.setCollision(sbx + bx, by, 0, 0, 0)
      }
    }
  )
}
function loadLayer_fore(
  data: tiledMapLayerLoader.ILayerData,
  numTileColumns: number,
  sbx: number
) {
  tiledMapLayerLoader.loadLayer(
    data,
    numTileColumns,
    (bx, by, t, tx, ty, flipX, flipY, rot) => {
      if (t) {
        wallStacksGenerator2.setFore(sbx + bx, by, t, tx, ty)
      } else {
        wallStacksGenerator2.setFore(sbx + bx, by, 0, 0, 0)
      }
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
        // let td = tileData.getTileData(t, numTileColumns)
        // if (td.props) {
        //   // if (td.props.enemy) {
        //   //   log.x('spawn enemy!')
        //   //   let c = enemies.create(td.props.enemy)
        //   //   enemies.moveToB(c, bx, by)
        //   // }
        // }
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
