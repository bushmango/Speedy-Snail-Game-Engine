import { ICard } from './CardInfo'

export interface IMessage {
  command: string,
  x?: number,
  y?: number,
  cards?: ICard[],
}