import { _ } from 'engine/importsEngine'

import * as tiledMapTilesLoader from 'engine/tiles2/tiledMapTilesLoader'
import * as tiledMapLayerLoader from 'engine/tiles2/tiledMapLayerLoader'

import * as tileDatas from './tileDatas'

import * as log from 'engine/log'

export function load(jsonTiles: tiledMapTilesLoader.ITiledTilesJson) {
  log.x('load tile props')

  _.forEach(jsonTiles.tiles, (c) => {
    tileDatas.loadTileProps(c)
  })
}
