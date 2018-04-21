import { _ } from './importsLodashsServer'

const delay = ms => new Promise(res => setTimeout(res, ms))

import { IMessage } from './IMessage'

import { ICard, standardDeck } from './CardInfo'

export interface IPlayer {
  hand: ICard[],
  deck: ICard[],
  discard: ICard[],
}

export function log(...message) {
  console.log('S>', ...message)
}

export class Server {

  players: IPlayer[] = []

  continueRunning = true
  tickDelay = 100

  gameState = 'wait'
  onLocalMessage: (message: IMessage) => void = null
  localPlayer: IPlayer = null

  init = (isLocal) => {
    log('starting server')
    this.tickDelay = isLocal ? 100 : 250
    this.tick()
  }

  addPlayer() {
    // this.numPlayers++
    let player: IPlayer = {
      hand: [],
      deck: _.cloneDeep(standardDeck),
      discard: [],
    }
    log('player deck', player.deck)
    this.players.push(player)
    return player
  }

  wait = async () => await delay(this.tickDelay)

  tick = async () => {

    while (this.continueRunning) {
      log('waiting for players')
      while (this.players.length === 0) {
        await this.wait()
      }

      log('we have players')

      await this.spawnMap()
      await this.spawnPlayers()
      await this.dealCards()
      await this.waitForCards()
      await this.resolveDodges()
      await this.resoveAttacks()
      await this.resolveMoves()
      await this.checkVictory()
    }
  }

  sendToAllPlayers(message: IMessage) {
    if (this.onLocalMessage) {
      this.onLocalMessage(message)
    }
    // TODO: send via sockets or somesuch
  }
  sendToPlayer(player: IPlayer, message: IMessage) {
    if (this.onLocalMessage) {
      if (player === this.localPlayer) {
        this.onLocalMessage(message)
      }
    }
    // TODO: send via sockets or somesuch
  }

  spawnMap = async () => {
    log('spawnMap')
    this.sendToAllPlayers({
      command: 'resetMap'
    })
    await this.wait()
  }

  spawnPlayers = async () => {
    log('spawnPlayers')
    this.sendToAllPlayers({
      command: 'spawn',
      x: _.random(1, 20, false),
      y: _.random(1, 20, false),
    })
    await this.wait()
  }

  dealCards = async () => {
    log('dealCards')

    _.forEach(this.players, c => {

      // Discard hand
      _.forEach(c.hand, d => {
        c.discard.push(d)
      })
      c.hand = []

      let numCards = 5
      for (let iCard = 0; iCard < numCards; iCard++) {
        // Shuffle in new cards?
        if (c.deck.length === 0) {
          c.deck = c.discard
          c.discard = []
        }
        // Get a card and add it to our hand
        let card = _.sample(c.deck)
        if (card) {
          c.hand.push(card)
          _.pull(c.deck, card)
        }
      }

      log('player', c)

      this.sendToPlayer(c, {
        command: 'dealt',
        cards: _.cloneDeep(c.hand)
      })
    })

    await this.wait()
  }

  waitForCards = async () => {
    log('waitForCards')
    await this.wait()
  }

  resolveDodges = async () => {
    log('resolveDodges')
    await this.wait()
  }

  resoveAttacks = async () => {
    log('resoveAttacks')
    await this.wait()
  }

  resolveMoves = async () => {
    log('resolveMoves')
    await this.wait()
  }

  checkVictory = async () => {
    log('checkVictory')
    await this.wait()
  }

}