export interface ITiledTilesJson {
  columns: number
  tiles: ITiledTileData[]
}

export interface ITiledTileData {
  id: number
  properties: any
}

export function loadTiles(json: ITiledTilesJson, onTile: () => void) {
  return {
    columns: json.columns,
  }
}
