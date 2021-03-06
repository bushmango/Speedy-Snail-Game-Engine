// import { _ } from './importsLodashsServer'
import * as _ from 'lodash'

const delay = (ms) => new Promise((res) => setTimeout(res, ms))
const fastServer = false

import { IMessage, IClientMesssage, IMove, ITileSpawn } from './IMessage'

import {
  ICard,
  ICardAndDir,
  standardDeck,
  deadHand,
  zombieHand,
  wizardDeck,
  pirateDeck,
  catDeck,
  robotDeck,
  ninjaDeck,
} from './CardInfo'

export interface IMapSpot {
  x: number
  y: number
  t: number
  //player: IPlayer
  hasSomething: boolean
}

export interface IPlayer {
  id: number
  hand: ICard[]
  deck: ICard[]
  discard: ICard[]
  chosenCards: ICardAndDir[]
  isAlive: boolean
  x: number
  y: number
  isBot: boolean
  socket: any
  noInputCounter: number
}

export interface IBullet {
  id: number
  x: number
  y: number
  dir: number
  isAlive: boolean
  idx: number
}

export interface IPowerup {
  id: number
  x: number
  y: number
  isAlive: boolean
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
  bullets: IBullet[] = []
  powerups: IPowerup[] = []

  continueRunning = true
  tickDelay = 750
  turnTimer = 5000

  nextPlayerId = 100

  lavaX = 1
  lavaY = 1
  lavaPerTurn = (22 - 2) / 2
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
    this.tickDelay = fastServer ? 100 : 500 //isLocal ? 500 : 500
    this.tick()
  }

  _replacePlayer = (isBot: boolean, socket: any = null) => {
    let replacement: IPlayer = null

    _.forEach(_.shuffle(this.players), (c) => {
      if (c.isBot && c.isAlive) {
        c.isBot = isBot
        c.socket = socket
        c.noInputCounter = 0
        replacement = c
        return false
      }
    })

    if (replacement) {
      this._switchDeck(replacement, standardDeck)
      this.sendToAllPlayers({
        command: 'replaceSpawn',
        id: replacement.id,
        isBot: isBot,
        isAlive: replacement.isAlive,
      })
      return replacement
    }
  }

  _changeToBot = (player: IPlayer) => {
    player.isBot = true
    player.socket = false
    this.sendToAllPlayers({
      command: 'replaceSpawn',
      id: player.id,
      isBot: true,
      isAlive: player.isAlive,
    })
  }

  addPlayer(isBot: boolean, socket: any = null, tryReplace = false) {
    // this.numPlayers++

    if (tryReplace) {
      let replacement = this._replacePlayer(isBot, socket)
      if (replacement) {
        return replacement
      }
    }

    // Need a new player
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
      noInputCounter: 0,
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
      while (_.every(this.players, (c) => c.isBot)) {
        await this.wait()
      }

      log('we have players')

      await this.spawnMap()
      await this.spawnPlayers()

      while (_.some(this.players, (c) => c.isAlive)) {
        log('some alive players')
        await this.addLava()
        await this.dealCards()
        await this.waitForCards()
        //await this.resolveDodges()
        await this.resolveRespawns()
        await this.resolveMoves(false)
        await this.resoveAttacks()
        await this.resolveBullets()
        await this.resolveBullets()
        await this.resolveBullets()
        await this.wait()
        await this.resolveMoves(true)
        let numAlive = await this.checkVictory()
        if (numAlive === 0) {
          // no one wins?
          break
        }
        if (numAlive === 1) {
          // chicken dinner!
          break
        }
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
    if (player.isBot) {
      return
    }

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
      let card = _.find(player.hand, (c) => c.name === clientMessage.cardName)
      if (card) {
        player.chosenCards = [
          {
            card,
            dir: clientMessage.direction,
          },
        ]
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
  findOpenSpace(checkPlayers = false) {
    for (let i = 0; i < this.mapHeight * this.mapWidth * 4; i++) {
      let x = _.random(1, this.mapWidth - 2, false)
      let y = _.random(1, this.mapHeight - 2, false)

      let gs = this.getMap(x, y)
      if (gs.t === 0 && gs.hasSomething === false) {
        if (checkPlayers) {
          if (
            _.some(this.players, (c) => {
              return c.x === x && c.y === y
            })
          ) {
            continue
          }
        }

        return { x, y, gs }
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
          hasSomething: false,
          t: 0,
        }
        this.map.push(gs)
      }
    }

    let tileSpawns = []

    for (let i = 1; i < this.lavaPerTurn + 1; i++) {
      this.setTileSpawn(tileSpawns, i, 1, 1)
    }
    for (let i = 0; i < this.mapWidth; i++) {
      this.setTileSpawn(tileSpawns, i, 0, 1)
      this.setTileSpawn(
        tileSpawns,
        this.mapWidth - i - 1,
        this.mapHeight - 1,
        1
      )
    }
    for (let i = 1; i < this.mapHeight - 1; i++) {
      this.setTileSpawn(tileSpawns, 0, i, 1)
      this.setTileSpawn(
        tileSpawns,
        this.mapWidth - 1,
        this.mapHeight - i - 1,
        1
      )
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
    let numTreasure = 0 // _.random(5, 10, false)
    for (let i = 0; i < numTreasure; i++) {
      this.setRandomTileSpawn(tileSpawns, 4)
    }

    this.sendToAllPlayers({
      command: 'resetMap',
      tileSpawns: tileSpawns,
    })

    _.forEach(this.players, (c) => {
      this._switchDeck(c, standardDeck)
    })

    // Add some test bullets
    this.bullets = []
    let numBullets = 0
    for (let i = 0; i < numBullets; i++) {
      let space = this.findOpenSpace()
      if (space) {
        // this._addBullet(space.x, space.y, _.random(0, 4 - 1, false))
      }
    }

    // Add some test powerups
    this.powerups = []
    let numPowerups = 10
    for (let i = 0; i < numPowerups; i++) {
      let space = this.findOpenSpace()
      if (space) {
        space.gs.hasSomething = true
        this._addPowerup(space.x, space.y)
      }
    }

    await this.wait()
  }

  spawnPlayers = async () => {
    log('spawnPlayers')

    // add bots
    let numBots = 100 - this.players.length
    for (let i = 0; i < numBots; i++) {
      this.addPlayer(true)
    }

    _.forEach(this.players, (c) => {
      let space = this.findOpenSpace(true)
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
          isAlive: c.isAlive,
        })
      } else {
        logError('no space for player')
      }
    })

    await this.wait()
  }

  sendMapTo = (player: IPlayer) => {
    // Send map
    let tileSpawns = [] as ITileSpawn[]
    _.forEach(this.map, (c) => {
      if (c.t !== 0) {
        tileSpawns.push({
          x: c.x,
          y: c.y,
          t: c.t,
        })
      }
    })
    this.sendToPlayer(player, {
      command: 'resetMap',
      tileSpawns: tileSpawns,
    })
    // Send player spawns
    _.forEach(this.players, (c) => {
      this.sendToPlayer(player, {
        command: 'spawn',
        id: c.id,
        x: c.x,
        y: c.y,
        isBot: c.isBot,
        isAlive: c.isAlive,
      })
    })

    // Send bullet spawns
    _.forEach(this.bullets, (c) => {
      if (c.isAlive) {
        this.sendToPlayer(player, {
          command: 'spawnBullet',
          id: c.id,
          x: c.x,
          y: c.y,
          dir: c.dir,
          idx: c.idx,
        })
      }
    })

    // Send powerup spawns
    _.forEach(this.powerups, (c) => {
      if (c.isAlive) {
        this.sendToPlayer(player, {
          command: 'spawnPowerup',
          id: c.id,
          x: c.x,
          y: c.y,
        })
      }
    })
  }

  _switchDeck = (player, newDeck) => {
    player.deck = _.cloneDeep(newDeck)
    player.discard = []
    player.hand = []
    player.chosenCards = []
  }

  dealCards = async () => {
    this.sendToAllPlayers({
      command: 'mode',
      message: 'Dealing',
    })
    log('dealCards')

    _.forEach(this.players, (c) => {
      if (c.isBot) {
        c.hand = zombieHand
      }

      if (!c.isBot && !c.isAlive) {
        c.hand = _.cloneDeep(deadHand)
        c.deck = c.hand
        this.sendToPlayer(c, {
          command: 'dealt',
          cards: c.hand,
        })
      }

      if (!c.isBot && c.isAlive) {
        // Discard hand
        c.chosenCards = []
        _.forEach(c.hand, (d) => {
          c.discard.push(d)
        })
        c.hand = []

        //if (c.isAlive) {
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

        this.sendToPlayer(c, {
          command: 'dealt',
          cards: _.cloneDeep(c.hand),
        })
      }
    })

    await this.wait()
  }

  waitForCards = async () => {
    this.sendToAllPlayers({
      command: 'mode',
      message: 'Pick your move',
    })
    log('waitForCards')

    // calculate moves for vots
    _.forEach(this.players, (c) => {
      if (!c.isBot || !c.isAlive) {
        return
      }
      c.chosenCards = [
        {
          card: c.hand[0],
          dir: _.random(0, 4 - 1, false),
        },
      ]
    })

    let numTicks = 10
    for (let iTicks = 0; iTicks < numTicks; iTicks++) {
      this.sendToAllPlayers({
        command: 'mode',
        percent: (iTicks + 1) / numTicks,
      })

      await this.waitFor(this.turnTimer / numTicks)
      log('.')

      if (this.localPlayer && this.localPlayer.chosenCards.length > 0) {
        log('cards chosen (local)!')
        break
      } else {
        let doWait = _.some(
          this.players,
          (c) => c.isAlive && !c.isBot && c.chosenCards.length === 0
        )
        if (!doWait) {
          log('cards chosen (server)!')
          break
        }
      }
    }

    _.forEach(this.players, (c) => {
      if (c.isAlive && !c.isBot && c.chosenCards.length === 0) {
        //afk
        c.noInputCounter++
      } else {
        c.noInputCounter = 0
      }
    })

    log('timeup!')
  }

  // resolveDodges = async () => {
  //   this.sendToAllPlayers({
  //     command: 'mode',
  //     // message: 'Dodging',
  //     lockHand: true,
  //   })
  //   log('resolveDodges')
  //   // await this.wait()
  // }

  resolveRespawns = async () => {
    this.sendToAllPlayers({
      command: 'mode',
      // message: 'Respawning',
      lockHand: true,
    })
    log('resolveRespawns')

    _.forEach(this.players, (c) => {
      if (!c.isBot && !c.isAlive && c.chosenCards.length > 0) {
        let cardAndDir = c.chosenCards[0]
        let card = cardAndDir.card
        let dir = cardAndDir.dir

        if (card && card.type === 'respawn') {
          for (
            let iCardCaction = 0;
            iCardCaction < card.actions.length;
            iCardCaction++
          ) {
            let action = card.actions[iCardCaction]

            if (action && action.type === 'respawn') {
              // Find a target
              if (c.socket) {
                let replacement = this._replacePlayer(false, c.socket)
                if (replacement) {
                  this._changeToBot(c)
                  this.sendToPlayer(replacement, {
                    command: 'welcome',
                    id: replacement.id,
                  })
                }
              }
            }
          }
        }
      }
    })

    // await this.wait()
  }

  resoveAttacks = async () => {
    this.sendToAllPlayers({
      command: 'mode',
      message: 'Attacking',
    })
    log('resoveAttacks')

    let moves = [] as IMove[]
    _.forEach(this.players, (c) => {
      if (c.isAlive && c.chosenCards.length > 0) {
        let cardAndDir = c.chosenCards[0]
        let card = cardAndDir.card
        let dir = cardAndDir.dir

        if (card && card.type === 'attack') {
          for (
            let iCardCaction = 0;
            iCardCaction < card.actions.length;
            iCardCaction++
          ) {
            let action = card.actions[iCardCaction]

            if (c.isAlive && action && action.type === 'shoot') {
              let correctedDir = dir
              if (action.dir) {
                correctedDir += action.dir
              }

              let { xo, yo } = this.convertDirToOffsets(correctedDir)
              let xp = c.x + xo
              let yp = c.y + yo

              let gs = this.getMapSafe(xp, yp)
              if (gs) {
                this._addBullet(xp, yp, correctedDir, action.idx)
              }
            }

            if (c.isAlive && action.type === 'attack') {
              let correctedDir = dir
              if (action.dir) {
                correctedDir += action.dir
              }

              let { xo, yo } = this.convertDirToOffsets(correctedDir)
              let xp = c.x + xo
              let yp = c.y + yo

              let gs = this.getMapSafe(xp, yp)
              if (gs) {
                moves.push({
                  x: gs.x,
                  y: gs.y,
                  attack: true,
                })

                if (gs.t === 2) {
                  // Tree
                  gs.t = 0
                  moves.push({
                    x: gs.x,
                    y: gs.y,
                    changeTile: true,
                    t: 0,
                  })
                }

                // Anyone here
                _.forEach(this.players, (d) => {
                  if (d.isAlive) {
                    // Hurt here
                    if (d.x === gs.x && d.y === gs.y) {
                      d.isAlive = false
                      moves.push({
                        id: d.id,
                        x: gs.x,
                        y: gs.y,
                        kill: true,
                      })
                    }
                  }
                })
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

    // let waitMs = 12 * moves.length
    // console.log('wait for ', moves.length, waitMs)
    // await this.waitFor(waitMs)

    await this.wait()
  }

  resolveMoves = async (forBots: boolean) => {
    this.sendToAllPlayers({
      command: 'mode',
      message: forBots ? 'Zombie moves' : 'Moving',
    })
    log('resolveMoves')

    this.players = _.sortBy(this.players, (c) => c.x + c.y * this.mapWidth)

    // sort by x/y position
    // process one at a time
    let moves = [] as IMove[]
    _.forEach(this.players, (c) => {
      if (c.isBot === forBots && c.isAlive && c.chosenCards.length > 0) {
        let cardAndDir = c.chosenCards[0]
        let card = cardAndDir.card
        let dir = cardAndDir.dir

        if (card && card.type === 'move') {
          for (
            let iCardCaction = 0;
            iCardCaction < card.actions.length;
            iCardCaction++
          ) {
            let action = card.actions[iCardCaction]

            if (action && c.isAlive && action.type === 'move') {
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

    let waitMs = 12 * moves.length
    console.log('wait for ', moves.length, waitMs)
    await this.waitFor(waitMs)

    await this.wait()
  }

  _move_killPlayer(moves: IMove[], player: IPlayer) {
    player.isAlive = false
    moves.push({
      id: player.id,
      kill: true,
      x: player.x,
      y: player.y,
    })
  }
  _move_killTree(moves: IMove[], x, y) {
    let gs = this.getMapSafe(x, y)
    if (gs && gs.t === 2) {
      gs.t = 0
      moves.push({
        changeTile: true,
        x: x,
        y: y,
        t: 0,
      })
    }
  }
  _move_killStone(moves: IMove[], x, y) {
    let gs = this.getMapSafe(x, y)
    if (gs && gs.t === 1) {
      // Dont break outside barrier
      if (
        x !== 0 &&
        y !== 0 &&
        x !== this.mapWidth - 1 &&
        y !== this.mapHeight - 1
      ) {
        gs.t = 0
        moves.push({
          changeTile: true,
          x: x,
          y: y,
          t: 0,
        })
      }
    }
  }
  _checkBulletSpace = (c: IBullet, moves: IMove[]) => {
    // Search for player
    let killBullet = false
    let gs = this.getMapSafe(c.x, c.y)
    if (gs) {
      if (gs.t === 2) {
        // Tree
        killBullet = true
        this._move_killTree(moves, c.x, c.y)
      } else if (gs.t === 1) {
        // Stone
        killBullet = true
        if (c.idx === 3) {
          this._move_killStone(moves, c.x, c.y)
        }
      } else {
        // Search for player
        _.forEach(this.players, (d) => {
          if (d.isAlive) {
            if (c.x === d.x && c.y === d.y) {
              killBullet = true
              this._move_killPlayer(moves, d)
              return false
            }
          }
        })
      }
    }

    return killBullet
  }

  resolveBullets = async () => {
    log('resolveBullets')
    this.sendToAllPlayers({
      command: 'mode',
      message: 'Bullets',
      discardHand: true,
    })

    // Testing
    let { x, y } = this.findOpenSpace()

    // this._addBullet(x, y, _.random(0, 4 - 1, false))

    let moves = [] as IMove[]

    _.forEach(this.bullets, (c) => {
      log('bullet', c)

      let killBullet = false
      if (c.isAlive && !killBullet) {
        killBullet = this._checkBulletSpace(c, moves)
      }

      if (c.isAlive && !killBullet) {
        // Try to move this bullet
        let { xo, yo } = this.convertDirToOffsets(c.dir)
        let xp = c.x + xo
        let yp = c.y + yo

        let gs = this.getMapSafe(xp, yp)

        if (gs) {
          // Move bullet
          c.x = xp
          c.y = yp
          moves.push({
            bullet: true,
            id: c.id,
            x: c.x,
            y: c.y,
          })

          // check again
          killBullet = this._checkBulletSpace(c, moves)
        } else {
          killBullet = true
        }
      }

      if (killBullet) {
        // Invalid move
        moves.push({
          bullet: true,
          kill: true,
          id: c.id,
        })
        c.isAlive = false
      }
    })

    if (moves.length > 0) {
      this.sendToAllPlayers({
        command: 'moves',
        moves: moves,
      })
    }

    // await this.wait()
  }

  _addBullet = (x, y, dir, idx) => {
    let bullet: IBullet = {
      id: this.nextPlayerId++,
      x: x,
      y: y,
      dir: dir,
      isAlive: true,
      idx: idx,
    }
    this.bullets.push(bullet)
    this.sendToAllPlayers({
      command: 'spawnBullet',
      id: bullet.id,
      x: bullet.x,
      y: bullet.y,
      dir: bullet.dir,
      idx: bullet.idx,
    })
  }

  _addPowerup = (x, y) => {
    let powerup: IPowerup = {
      id: this.nextPlayerId++,
      x: x,
      y: y,
      isAlive: true,
    }
    this.powerups.push(powerup)
    this.sendToAllPlayers({
      command: 'spawnPowerup',
      id: powerup.id,
      x: powerup.x,
      y: powerup.y,
    })
  }

  checkVictory = async () => {
    log('checkVictory')

    let aliveHumans = _.reduce(
      this.players,
      (sum, c) => sum + (c.isAlive && !c.isBot ? 1 : 0),
      0
    )
    let aliveBots = _.reduce(
      this.players,
      (sum, c) => sum + (c.isAlive && c.isBot ? 1 : 0),
      0
    )
    log(aliveHumans, 'humans', aliveBots, 'bots')
    if (!aliveHumans) {
      // Kill everything
      log('no more alive humans')
      _.forEach(this.players, (c) => {
        c.isAlive = false
      })
    }

    await this.wait()

    return aliveHumans + aliveBots
  }

  _addLavaAt = async (x, y) => {
    let gs = this.getMap(x, y)
    if (gs.t !== 3) {
      gs.t = 3
      // if(gs.pl)
      this.sendToAllPlayers({
        command: 'lava',
        x: x,
        y: y,
      })
    }
    await this.waitFor(50)
  }

  addLava = async () => {
    this.sendToAllPlayers({
      command: 'mode',
      message: 'Increasing heat',
      discardHand: true,
    })
    log('addLava')

    // Kill afk
    _.forEach(this.players, (c) => {
      if (c.isAlive && c.noInputCounter >= 3) {
        this._addLavaAt(c.x, c.y)
      }
    })

    // Advance lava
    for (let i = 0; i < this.lavaPerTurn; i++) {
      await this._addLavaAt(this.lavaX, this.lavaY)
      this.lavaX++
      if (this.lavaX > this.mapWidth - 2) {
        this.lavaX = 1
        this.lavaY++
        if (this.lavaY > this.mapHeight - 2) {
          this.lavaY = 1
        }
      }
    }

    // Check for lava deaths
    let moves = [] as IMove[]
    _.forEach(this.players, (c) => {
      if (c.isAlive) {
        let gs = this.getMapSafe(c.x, c.y)
        if (gs && gs.t === 3) {
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

    if (dir < 0) {
      dir += 4
    }
    if (dir >= 4) {
      dir -= 4
    }

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

  _checkSpotForPowerup(moves: IMove[], player: IPlayer) {
    if (!player.isAlive || player.isBot) {
      return
    }
    _.forEach(this.powerups, (powerup) => {
      if (powerup.isAlive && powerup.x === player.x && powerup.y === player.y) {
        // There's a powerup here!
        powerup.isAlive = false
        moves.push({
          message: {
            command: 'killPowerup',
            id: powerup.id,
            x: powerup.x,
            y: powerup.y,
          },
        })

        let classes = [
          {
            name: 'wizard',
            deck: wizardDeck,
          },
          {
            name: 'pirate',
            deck: pirateDeck,
          },
          {
            name: 'cat',
            deck: catDeck,
          },
          {
            name: 'robot',
            deck: robotDeck,
          },
          {
            name: 'ninja',
            deck: ninjaDeck,
          },
        ]
        let randomClass = _.sample(classes)

        // TODO: change player deck + appearence
        // Reset player deck
        this._switchDeck(player, randomClass.deck)
        moves.push({
          message: {
            command: 'changeClass',
            id: player.id,
            className: randomClass.name,
          },
        })

        return false
      }
    })
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
    for (
      let iOtherPlayer = 0;
      iOtherPlayer < this.players.length;
      iOtherPlayer++
    ) {
      let otherPlayer = this.players[iOtherPlayer]
      if (otherPlayer.isAlive && otherPlayer.x === xp && otherPlayer.y == yp) {
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

      this._checkSpotForPowerup(moves, player)
    }
    return isValid
  }
}
