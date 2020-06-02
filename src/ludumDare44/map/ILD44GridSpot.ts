import { IGridSpot } from 'engine/tiles/TileMap'

export interface ILD44GridSpot extends IGridSpot {
  hatCountHide: number
  fatal: boolean
  hatCountShow: number
  hideBossButtonPressed: boolean
  hideBossDefeated: boolean
  hideMidButtonPressed: boolean
}
