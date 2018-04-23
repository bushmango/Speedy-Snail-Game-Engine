//import { _ } from './importsLodashsServer'
import * as _ from 'lodash'
import { IMessage } from './IMessage'
import { LudumDare41Context } from 'ludumDare41/LudumDare41Context';
import { NinjaManager } from 'ludumDare41/entities/Ninja';

export function log(...message) {
  console.log('S>', ...message)
}
export function logWarn(...message) {
  console.warn('S>', ...message)
}
export function logError(...message) {
  console.error('S>', ...message)
}
const delay = ms => new Promise(res => setTimeout(res, ms))

const fastSpawn = true

export class CommandRunnerClient {
  context: LudumDare41Context
  init(context: LudumDare41Context) {
    this.context = context
  }

  run(message: IMessage) {
    log('message', message.command, message)
    if (this[message.command]) {
      this[message.command](message)
    } else {
      logError('unknown message', message.command)
    }
  }

  welcome = (message: IMessage) => {
    this.context.playerId = message.id
  }

  resetMap = async (message: IMessage) => {
    this.context.ninjas.clear()
    this.context.bullets.clear()
    this.context.powerups.clear()
    this.context.gameMap.reset()

    for (let i = 0; i < message.tileSpawns.length; i++) {
      let c = message.tileSpawns[i]
      this.context.gameMap.setTile(c.x, c.y, c.t)

      if (!fastSpawn) {
        await delay(25)
      }
    }

    _.forEach(message.tileSpawns)
  }
  spawn = (message: IMessage) => {
    let ninja = this.context.ninjas.createAt(message.x, message.y)
    ninja.id = message.id
    ninja.isBot = message.isBot
    ninja.isAlive = message.isAlive
   
  }

  replaceSpawn = (message: IMessage) => {
    let ninja = _.find(this.context.ninjas.items, c => c.id === message.id)
    if (ninja) {
      ninja.isBot = message.isBot
      ninja.isAlive = message.isAlive     
    }
  }

  dealt = (message: IMessage) => {
    // console.log('cards', message.cards)

    this.context.cards.setHand(message.cards)

  }

  spawnBullet = (message: IMessage) => {
    let bullet = this.context.bullets.createAt(message.x, message.y, message.dir, message.idx)
    bullet.id = message.id
  }

  spawnPowerup = (message: IMessage) => {
    let powerup = this.context.powerups.createAt(message.x, message.y)
    powerup.id = message.id
  }
  killPowerup = (message: IMessage) => {
    let powerup = _.find(this.context.powerups.items, d => d.id === message.id)
    powerup.destroy()
  }

  moves = async (message: IMessage) => {
    log('moves', message.moves)

    for (let i = 0; i < message.moves.length; i++) {
      let c = message.moves[i]
      let ninja = _.find(this.context.ninjas.items, d => d.id === c.id)

      if(c.message) {
        this.run(c.message)
      }
      else if (c.bounce) {

      }
      else if (c.bullet) {
        let bullet = _.find(this.context.bullets.items, d => d.id === c.id)
        if (bullet) {
          if (c.kill) {
            bullet.isReadyToBeDestroyed = true
          } else {
            bullet.moveTo(c.x, c.y)
          }
        } else {
          console.warn('cant find bullet', c.id)
        }
      }
      else if (c.kill) {
        if (ninja) {
          ninja.isAlive = false
        }
        await delay(10)
      }
      else if (c.attack) {
        // Add anim
        //await delay(10)
        this.context.effects.createAt(c.x, c.y)
      }
      else if (c.changeTile) {
        this.context.gameMap.setTile(c.x, c.y, c.t)
        await delay(10)
      }
      else if (c.destroyTree) {
        this.context.gameMap.setTile(c.x, c.y, 0)
        await delay(10)
      }
      else if (c.lava) {
        console.debug('lavad', ninja.id)
        if (ninja) {
          ninja.moveTo(c.x, c.y)
          // debugger
          ninja.isAlive = false
        }
        await delay(10)
      }
      else if (c.move) {
        if (ninja) {
          ninja.moveTo(c.x, c.y)
        }
        await delay(10)
      }
    }

  }

  lava = (message: IMessage) => {
    this.context.gameMap.setLava(message.x, message.y)
  }

  mode = (message: IMessage) => {

    let aliveHumans = _.reduce(this.context.ninjas.items, (sum, c) => sum + ((c.isAlive && !c.isBot) ? 1 : 0), 0)
    let aliveBots = _.reduce(this.context.ninjas.items, (sum, c) => sum + ((c.isAlive && c.isBot) ? 1 : 0), 0)
    let text = `${aliveHumans} humans + ${aliveBots} bots`

    this.context.textMode.text = '' //message.message
    this.context.textAlive.text = text

    this.context.modeBar.setMode(message.message, message.percent)

    // special actions
    if (message.lockHand) {
      this.context.cards.lockHand()
    }
    if (message.discardHand) {
      this.context.cards.discardHand()
    }

  }



}