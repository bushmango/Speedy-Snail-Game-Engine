import { _ } from './importsLodashsServer'

export interface ICard {
  name: string,
  type: 'move' | 'dodge' | 'attack',
  frame: number
}
export const cards: ICard[] = [
  {
    name: 'Null',
    type: 'move',
    frame: 0,
  },
  {
    name: 'Walk',
    type: 'move',
    frame: 1,
  },
  {
    name: 'Run',
    type: 'move',
    frame: 2,
  },
  {
    name: 'Sprint',
    type: 'move',
    frame: 3,
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

console.log('standard deck', standardDeck)

export { standardDeck }
