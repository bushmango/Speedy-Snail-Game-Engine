import { _ } from './importsLodashsServer'

const delay = ms => new Promise(res => setTimeout(res, ms))

import { IMessage, IClientMesssage } from './IMessage'

import { ICard, standardDeck } from './CardInfo'

export interface IPlayer {
  id: number,
  hand: ICard[],
  deck: ICard[],
  discard: ICard[],
  chosenCards: ICard[],
  isAlive: boolean,
  x: number
  y: number
}

export function log(...message) {
  console.log('S>', ...message)
}
export function logWarn(...message) {
  console.warn('S>', ...message)
}


export class Server {

  players: IPlayer[] = []

  continueRunning = true
  tickDelay = 100
  turnTimer = 3000

  nextPlayerId = 100

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
      id: this.nextPlayerId++,
      hand: [],
      deck: _.cloneDeep(standardDeck),
      discard: [],
      chosenCards: [],
      isAlive: false,
      x: -1,
      y: -1,
    }
    log('player deck', player.deck)
    this.players.push(player)
    return player
  }

  wait = async () => await delay(this.tickDelay)
  waitFor = async (ms) => await delay(ms)

  tick = async () => {

    while (this.continueRunning) {
      log('waiting for players')
      while (this.players.length === 0) {
        await this.wait()
      }

      log('we have players')

      await this.spawnMap()
      await this.spawnPlayers()

      while (_.some(this.players, c => c.isAlive)) {
        await this.dealCards()
        await this.waitForCards()
        await this.resolveDodges()
        await this.resoveAttacks()
        await this.resolveMoves()
        await this.checkVictory()
      }
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
  receiveLocal(clientMessage: IClientMesssage) {
    if (this.localPlayer) {

      if (clientMessage.command === 'play') {

        let card = _.find(this.localPlayer.hand, c => c.name === clientMessage.cardName)
        if (card) {
          this.localPlayer.chosenCards = [card]
        } else {
          logWarn('dont have card', clientMessage.cardName)
        }

      } else {
        logWarn('unknown client message', clientMessage.command)
      }
    }
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
    _.forEach(this.players, c => {
      c.isAlive = true
      c.x = _.random(1, 20, false)
      c.y = _.random(1, 20, false)

      this.sendToAllPlayers({
        command: 'spawn',
        id: c.id,
        x: c.x,
        y: c.y,
      })

    })

    await this.wait()
  }

  dealCards = async () => {
    log('dealCards')

    _.forEach(this.players, c => {

      // Discard hand
      c.chosenCards = []
      _.forEach(c.hand, d => {
        c.discard.push(d)
      })
      c.hand = []

      let numCards = 6
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

    let numTicks = 10
    for (let iTicks = 0; iTicks < numTicks; iTicks++) {
      await this.waitFor(this.turnTimer / numTicks)
      log('.')
      if (this.localPlayer && this.localPlayer.chosenCards.length > 0) {
        log('cards chosen!')
        break
      }
    }
    log('timeup!')
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

    // sort by x/y position
    // process one at a time
    let moves = []
    _.forEach(this.players, c => {

      if (c.chosenCards.length > 0) {
        let card = c.chosenCards[0]

        if (card.type === 'move') {

          c.y -= 1

          moves.push({
            id: c.id,
            x: c.x,
            y: c.y,
          })

        }

      }

    })

    this.sendToAllPlayers({
      command: 'moves',
      moves: moves,
    })

    await this.wait()
  }

  checkVictory = async () => {
    log('checkVictory')
    await this.wait()
  }

}

