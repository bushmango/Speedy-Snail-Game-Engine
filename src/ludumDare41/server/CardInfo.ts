// import { _ } from './importsLodashsServer'
import * as _ from 'lodash'

export interface ICardAction {
  type: 'move' | 'attack' | 'shoot' | 'respawn'
  dir?: number
  idx?: number
}

export interface ICardAndDir {
  card: ICard
  dir: number
}

export interface ICard {
  name: string
  type: 'move' | 'dodge' | 'attack' | 'respawn'
  frame: number
  actions: ICardAction[]
}
export const cards: ICard[] = [
  {
    name: 'Null',
    type: 'move',
    frame: 0,
    actions: [],
  },
  {
    name: 'Dead',
    type: 'move',
    frame: 4,
    actions: [],
  },
  {
    name: 'Pheonix',
    type: 'respawn',
    frame: 11,
    actions: [
      {
        type: 'respawn',
      },
    ],
  },
  {
    name: 'Walk',
    type: 'move',
    frame: 1,
    actions: [
      {
        type: 'move',
      },
    ],
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
      },
    ],
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
      },
    ],
  },
  {
    name: 'Punch',
    type: 'attack',
    frame: 5,
    actions: [
      {
        type: 'attack',
      },
    ],
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
      },
    ],
  },

  {
    name: 'Shiriken',
    type: 'attack',
    frame: 7,
    actions: [
      {
        type: 'shoot',
        idx: 0,
      },
    ],
  },
  {
    name: 'Shoot Gun',
    type: 'attack',
    frame: 8,
    actions: [
      {
        type: 'attack',
      },
      {
        type: 'shoot',
        idx: 1,
      },
    ],
  },
  {
    name: 'Fireball',
    type: 'attack',
    frame: 9,
    actions: [
      {
        type: 'shoot',
        idx: 2,
      },
      {
        type: 'shoot',
        idx: 2,
        dir: +1,
      },
      {
        type: 'shoot',
        idx: 2,
        dir: +2,
      },
      {
        type: 'shoot',
        idx: 2,
        dir: +3,
      },
    ],
  },
  {
    name: 'Rocket',
    type: 'attack',
    frame: 10,
    actions: [
      {
        type: 'shoot',
        idx: 3,
      },
    ],
  },
]

const nullCard = _.find(cards, (c) => c.name === 'Null')

function addCards(deck, name, num = 1) {
  let card = _.find(cards, (c) => c.name === name)
  if (!card) {
    console.error('cant find card', card.name)
  }
  for (let i = 0; i < num; i++) {
    deck.push(_.clone(card))
  }
}

const standardDeck: ICard[] = []
addCards(standardDeck, 'Walk', 4)
addCards(standardDeck, 'Run', 2)
addCards(standardDeck, 'Sprint', 1)
addCards(standardDeck, 'Punch', 2)

const testDeck: ICard[] = []
addCards(testDeck, 'Walk', 3)
addCards(testDeck, 'Run', 2)
addCards(testDeck, 'Sprint', 1)
addCards(testDeck, 'Punch', 2)
addCards(testDeck, 'Swipe', 2)
addCards(testDeck, 'Shiriken', 2)
addCards(testDeck, 'Shoot Gun', 2)
addCards(testDeck, 'Fireball', 2)
addCards(testDeck, 'Rocket', 2)

const ninjaDeck: ICard[] = []
addCards(ninjaDeck, 'Walk', 4)
addCards(ninjaDeck, 'Run', 2)
addCards(ninjaDeck, 'Sprint', 1)
addCards(ninjaDeck, 'Shiriken', 2)
addCards(ninjaDeck, 'Swipe', 2)

const robotDeck: ICard[] = []
addCards(robotDeck, 'Walk', 4)
addCards(robotDeck, 'Run', 2)
addCards(robotDeck, 'Rocket', 2)
addCards(robotDeck, 'Swipe', 2)

const wizardDeck: ICard[] = []
addCards(wizardDeck, 'Walk', 3)
addCards(wizardDeck, 'Run', 3)
addCards(wizardDeck, 'Fireball', 3)

const pirateDeck: ICard[] = []
addCards(pirateDeck, 'Walk', 3)
addCards(pirateDeck, 'Run', 3)
addCards(pirateDeck, 'Sprint', 1)
addCards(pirateDeck, 'Shoot Gun', 4)

const catDeck: ICard[] = []
addCards(catDeck, 'Walk', 3)
addCards(catDeck, 'Run', 3)
addCards(catDeck, 'Sprint', 3)
addCards(catDeck, 'Swipe', 3)

const deadHand: ICard[] = []
addCards(deadHand, 'Dead', 5)
addCards(deadHand, 'Pheonix', 1)

const zombieHand: ICard[] = []
addCards(zombieHand, 'Walk', 6)

// console.log('standard deck', standardDeck)

export {
  standardDeck,
  nullCard,
  deadHand,
  zombieHand,
  ninjaDeck,
  robotDeck,
  wizardDeck,
  pirateDeck,
  catDeck,
}
