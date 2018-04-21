// import { _ } from './importsLodashsServer'
import * as _ from 'lodash'

const delay = ms => new Promise(res => setTimeout(res, ms))

import { IMessage, IClientMesssage, IMove } from './IMessage'

import { ICard, ICardAndDir, standardDeck } from './CardInfo'

export interface IMapSpot {
  x: number
  y: number
  t: number
  player: IPlayer
}

export interface IPlayer {
  id: number,
  hand: ICard[],
  deck: ICard[],
  discard: ICard[],
  chosenCards: ICardAndDir[],
  isAlive: boolean,
  x: number
  y: number
  isBot: boolean
  socket: any
}

export function log(...message) {
  console.log('S>', ...message)
}
export function logWarn(...message) {
  console.warn('S>', ...message)
}
export function logError(...message) {
  console.error('S>', ...message)
}

export class Server {

  players: IPlayer[] = []

  continueRunning = true
  tickDelay = 100
  turnTimer = 3000

  nextPlayerId = 100

  lavaX = 1
  lavaY = 1
  mapWidth = 22
  mapHeight = 22
  map = [] as IMapSpot[]
  getMap(x, y) {
    return this.map[x + y * this.mapWidth]
  }
  getMapSafe(x, y) {
    if (x < 0 || x >= this.mapWidth || y < 0 || y >= this.mapHeight) {
      return null
    }
    return this.map[x + y * this.mapWidth]
  }
  gameState = 'wait'
  onLocalMessage: (message: IMessage) => void = null
  onSendToAllPlayers: (message: IMessage) => void = null
  onSendToPlayer: (player: IPlayer, message: IMessage) => void = null
  localPlayer: IPlayer = null

  init = (isLocal) => {
    log('starting server')
    this.tickDelay = isLocal ? 100 : 250
    this.tick()
  }

  addPlayer(isBot: boolean, socket: any = null) {
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
      isBot,
      socket,
    }
    // log('player deck', player.deck)
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
        log('some alive players')
        await this.addLava()
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
    if (this.onSendToAllPlayers) {
      this.onSendToAllPlayers(message)
    }
    // TODO: send via sockets or somesuch
  }
  sendToPlayer(player: IPlayer, message: IMessage) {
    if (player.isBot) { return }

    if (this.onLocalMessage) {
      if (player === this.localPlayer) {
        this.onLocalMessage(message)
      }
    }
    if (this.onSendToPlayer) {
      this.onSendToPlayer(player, message)
    }
    // TODO: send via sockets or somesuch
  }
  receiveLocal(clientMessage: IClientMesssage) {
    if (this.localPlayer) {
      this.receive(this.localPlayer, clientMessage)
    }
  }
  receive(player: IPlayer, clientMessage: IClientMesssage) {
    if (!player) {
      logWarn('player is null')
      return
    }
    if (clientMessage.command === 'play') {

      let card = _.find(player.hand, c => c.name === clientMessage.cardName)
      if (card) {
        player.chosenCards = [{
          card,
          dir: clientMessage.direction,
        }]
        log('card chosen', player.id)
      } else {
        logWarn('dont have card', clientMessage.cardName)
      }

    } else {
      logWarn('unknown client message', clientMessage.command)
    }
  }

  setTileSpawn(tileSpawns, x, y, t) {
    tileSpawns.push({
      x: x,
      y: y,
      t: t,
    })
    let gs = this.getMap(x, y)
    gs.t = t
  }

  setRandomTileSpawn(tileSpawns, t) {
    let space = this.findOpenSpace()
    if (space) {
      tileSpawns.push({
        x: space.x,
        y: space.y,
        t: t,
      })
      let gs = this.getMap(space.x, space.y)
      gs.t = t
    }
  }

  findRandomSpace() {
    let x = _.random(2, this.mapWidth - 4, false)
    let y = _.random(2, this.mapHeight - 4, false)
    return { x, y }
  }
  findOpenSpace() {
    for (let i = 0; i < this.mapHeight * this.mapWidth * 4; i++) {
      let x = _.random(2, this.mapWidth - 4, false)
      let y = _.random(2, this.mapHeight - 4, false)

      let gs = this.getMap(x, y)
      if (gs.t === 0) {
        return { x, y }
      }
    }

    return null
  }

  spawnMap = async () => {
    log('spawnMap')
    this.lavaX = 1
    this.lavaY = 1

    this.map = []
    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        let gs: IMapSpot = {
          x,
          y,
          player: null,
          t: 0
        }
        this.map.push(gs)
      }
    }

    let tileSpawns = []
    for (let i = 0; i < this.mapWidth; i++) {
      this.setTileSpawn(tileSpawns, i, 0, 1)
      this.setTileSpawn(tileSpawns, this.mapWidth - i - 1, this.mapHeight - 1, 1)
    }
    for (let i = 1; i < this.mapHeight - 1; i++) {
      this.setTileSpawn(tileSpawns, 0, i, 1)
      this.setTileSpawn(tileSpawns, this.mapWidth - 1, this.mapHeight - i - 1, 1)
    }



    let numLava = _.random(5, 25, false)
    for (let i = 0; i < numLava; i++) {
      this.setRandomTileSpawn(tileSpawns, 3)
    }
    let numRocks = _.random(5, 25, false)
    for (let i = 0; i < numRocks; i++) {
      this.setRandomTileSpawn(tileSpawns, 1)
    }
    let numTrees = _.random(5, 50, false)
    for (let i = 0; i < numTrees; i++) {
      this.setRandomTileSpawn(tileSpawns, 2)
    }
    let numTreasure = _.random(5, 10, false)
    for (let i = 0; i < numTreasure; i++) {
      this.setRandomTileSpawn(tileSpawns, 4)
    }

    this.sendToAllPlayers({
      command: 'resetMap',
      tileSpawns: tileSpawns,
    })
    await this.wait()
  }

  spawnPlayers = async () => {
    log('spawnPlayers')

    // add bots
    let numBots = 10
    for (let i = 0; i < numBots; i++) {
      this.addPlayer(true)
    }


    _.forEach(this.players, c => {

      let space = this.findOpenSpace()
      if (space) {

        c.isAlive = true
        c.x = space.x
        c.y = space.y

        this.sendToAllPlayers({
          command: 'spawn',
          id: c.id,
          x: c.x,
          y: c.y,
          isBot: c.isBot,
        })
      } else {
        logError('no space for player')
      }

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

      // log('player', c)

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
        log('cards chosen (local)!')
        break
      } else {
        let doWait = _.some(this.players, c => c.isAlive && !c.isBot && c.chosenCards.length === 0)
        if (!doWait) {
          log('cards chosen (server)!')
          break
        }
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
    let moves = [] as IMove[]
    _.forEach(this.players, c => {

      if (c.isAlive && c.chosenCards.length > 0) {
        let cardAndDir = c.chosenCards[0]
        let card = cardAndDir.card
        let dir = cardAndDir.dir

        if (card.type === 'move') {

          for (let iCardCaction = 0; iCardCaction < card.actions.length; iCardCaction++) {
            let action = card.actions[iCardCaction]

            if (c.isAlive && action.type === 'move') {

              let { xo, yo } = this.convertDirToOffsets(dir)

              // can we move here?
              if (!this.tryMovePlayer(moves, c, xo, yo)) {
                break
              }

              // continue
            }
          }
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

    let alivePlayers = _.some(this.players, c => c.isAlive && !c.isBot)
    if (!alivePlayers) {
      // Kill everything
      log('no more alive humans')
      _.forEach(this.players, c => {
        c.isAlive = false
      }
      )
    }

    await this.wait()
  }

  addLava = async () => {
    log('addLava')


    let gs = this.getMap(this.lavaX, this.lavaY)
    gs.t = 3
    // if(gs.pl)
    this.sendToAllPlayers({
      command: 'lava',
      x: this.lavaX,
      y: this.lavaY,
    })

    // Advance lava
    this.lavaX++
    if (this.lavaX > this.mapWidth - 2) {
      this.lavaX = 1
      this.lavaY++
      if (this.lavaY > this.mapHeight - 2) {
        this.lavaY = 1
      }
    }

    let moves = [] as IMove[]
    _.forEach(this.players, c => {
      if (c.isAlive) {
        let gs = this.getMapSafe(c.x, c.y)
        if (gs.t === 3) {
          c.isAlive = false
          moves.push({
            id: c.id,
            x: c.x,
            y: c.y,
            lava: true,
          })
        }

      }
    })
    if (moves.length > 0) {
      this.sendToAllPlayers({
        command: 'moves',
        moves: moves,
      })
    }

    await this.wait()
  }

  convertDirToOffsets(dir) {
    let xo = 0
    let yo = 0

    switch (dir) {
      case 0:
        yo = -1
        break
      case 1:
        xo = 1
        break
      case 2:
        yo = 1
        break
      case 3:
        xo = -1
        break
      default:
        logWarn('invalid dir', dir)
        break
    }
    return { xo, yo }
  }

  tryMovePlayer(moves: IMove[], player: IPlayer, xo: number, yo: number) {

    let xp = player.x + xo
    let yp = player.y + yo
    let gs = this.getMapSafe(xp, yp)

    if (!gs || gs.t == 1 || gs.t == 2) {
      moves.push({
        id: player.id,
        bounce: true,
      })
      if (gs.t == 2) {
        moves.push({
          id: player.id,
          destroyTree: true,
          x: xp,
          y: yp,
        })
        gs.t = 0
      }
      return false
    }

    if (gs.t == 3) {
      // Lava'd
      player.x = xp
      player.y = yp
      moves.push({
        id: player.id,
        lava: true,
        x: player.x,
        y: player.y,
      })
      player.isAlive = false
      return true
    }


    // Is there another player here?
    let isValid = true
    for (let iOtherPlayer = 0; iOtherPlayer < this.players.length; iOtherPlayer++) {
      let otherPlayer = this.players[iOtherPlayer]
      if (otherPlayer.x === xp && otherPlayer.y == yp) {
        // Uh oh, another player is here
        if (!this.tryMovePlayer(moves, otherPlayer, xo, yo)) {
          isValid = false
        }
      }
    }

    if (isValid) {
      player.x = xp
      player.y = yp
      moves.push({
        id: player.id,
        move: true,
        x: player.x,
        y: player.y,
      })
    }
    return isValid

  }
}
