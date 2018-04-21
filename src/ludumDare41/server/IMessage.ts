import { ICard } from './CardInfo'

export interface IMessage {
  command: string,
  x?: number,
  y?: number,
  cards?: ICard[],
}

export interface IClientMesssage {
  command: string,
  cardName?: string,
  direction?: number,
}