// import { _ } from './importsLodashsServer'
import * as _ from 'lodash'

export interface ICardAction {
  type: 'move'
}

export interface ICardAndDir{
  card: ICard,
  dir: number,
}

export interface ICard {
  name: string,
  type: 'move' | 'dodge' | 'attack',
  frame: number
  actions: ICardAction[]
}
export const cards: ICard[] = [
  {
    name: 'Null',
    type: 'move',
    frame: 0,
    actions: []
  },
  {
    name: 'Walk',
    type: 'move',
    frame: 1,
    actions: [
      {
        type: 'move',
      }
    ]
  },
  {
    name: 'Run',
    type: 'move',
    frame: 2,
    actions: [
      {
        type: 'move',
      },
      {
        type: 'move',
      }
    ]
  },
  {
    name: 'Sprint',
    type: 'move',
    frame: 3,
    actions: [
      {
        type: 'move',
      },
      {
        type: 'move',
      },
      {
        type: 'move',
      }
    ]
  }
]

const standardDeck: ICard[] = []
function addCards(deck, name, num = 1) {
  let card = _.find(cards, c => c.name === name)
  if (!card) {
    console.error('cant find card', card.name)
  }
  for (let i = 0; i < num; i++) {
    deck.push(_.clone(card))
  }
}

addCards(standardDeck, 'Walk', 3)
addCards(standardDeck, 'Run', 2)
addCards(standardDeck, 'Sprint', 1)

// console.log('standard deck', standardDeck)

export { standardDeck }
