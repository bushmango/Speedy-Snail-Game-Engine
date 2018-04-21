import { ICard } from './CardInfo'

export interface IMove {
  id: number,
  x?: number,
  y?: number,
  move?: boolean,
  bounce?: boolean,
  lava?: boolean,
  destroyTree?: boolean,
}

export interface ITileSpawn {
  x: number,
  y: number,
  t: number,
}

export interface IMessage {
  command: string,
  id?: number,
  x?: number,
  y?: number,
  cards?: ICard[],
  moves?: IMove[],
  tileSpawns?: ITileSpawn[],
  isBot?: boolean,
  isAlive?: boolean,
}

export interface IClientMesssage {
  command: string,
  cardName?: string,
  direction?: number,
}