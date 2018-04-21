import { ICard } from './CardInfo'

export interface IMove {
  id: number,
  x: number,
  y: number,
}

export interface IMessage {
  command: string,
  id?: number,
  x?: number,
  y?: number,
  cards?: ICard[],
  moves?: IMove[],
}

export interface IClientMesssage {
  command: string,
  cardName?: string,
  direction?: number,
}