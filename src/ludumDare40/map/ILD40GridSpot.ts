import { IGridSpot } from 'engine/tiles/TileMap'

export interface ILD40GridSpot extends IGridSpot {
  fatal: boolean,
  hatCountHide: number,
  hatCountShow: number,

  hideBossDefeated: boolean,
  hideBossButtonPressed: boolean,
  hideMidButtonPressed: boolean,
}