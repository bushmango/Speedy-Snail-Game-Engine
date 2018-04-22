// import { _ } from './importsLodashsServer'
import * as _ from 'lodash'

export interface ICardAction {
  type: 'move' | 'attack' | 'shoot'
  dir?: number
}

export interface ICardAndDir {
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
    name: 'Dead',
    type: 'move',
    frame: 4,
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
  },
  {
    name: 'Punch',
    type: 'attack',
    frame: 5,
    actions: [
      {
        type: 'attack',
      }
    ]
  },
  {
    name: 'Swipe',
    type: 'attack',
    frame: 6,
    actions: [
      {
        type: 'attack',
      },
      {
        type: 'attack',
        dir: -1,
      },
      {
        type: 'attack',
        dir: +1,
      }
    ]
  },

  {
    name: 'Shiriken',
    type: 'attack',
    frame: 6,
    actions: [
      {
        type: 'shoot',
      }
    ]
  },
  {
    name: 'Shoot Gun',
    type: 'attack',
    frame: 7,
    actions: [
      {
        type: 'attack',
      },
      {
        type: 'shoot',
      }
    ]
  },
  {
    name: 'Fireball',
    type: 'attack',
    frame: 8,
    actions: [
      {
        type: 'shoot',
      }, {
        type: 'shoot',
        dir: +1,
      }, {
        type: 'shoot',
        dir: +2,
      }, {
        type: 'shoot',
        dir: +3,
      }
    ]
  },
  {
    name: 'Rocket',
    type: 'attack',
    frame: 9,
    actions: [
      {
        type: 'shoot',
      }
    ]
  },

]

const nullCard = _.find(cards, c => c.name === 'Null')

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

addCards(standardDeck, 'Punch', 2)
addCards(standardDeck, 'Swipe', 2)

addCards(standardDeck, 'Shiriken', 2)
addCards(standardDeck, 'Shoot Gun', 2)
addCards(standardDeck, 'Fireball', 2)
addCards(standardDeck, 'Rocket', 2)

const deadHand: ICard[] = []
addCards(deadHand, 'Dead', 6)

const zombieHand: ICard[] = []
addCards(zombieHand, 'Walk', 6)

// console.log('standard deck', standardDeck)

export { standardDeck, nullCard, deadHand, zombieHand }
