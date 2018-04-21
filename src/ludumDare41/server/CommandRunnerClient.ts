import { _ } from './importsLodashsServer'
import { IMessage } from './IMessage'
import { LudumDare41Context } from 'ludumDare41/LudumDare41Context';

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

  resetMap = async (message: IMessage) => {
    this.context.ninjas.clear()
    this.context.gameMap.reset()
    for (let i = 0; i < message.tileSpawns.length; i++) {
      let c = message.tileSpawns[i]
      this.context.gameMap.setTile(c.x, c.y, c.t)
      await delay(25)
    }

    _.forEach(message.tileSpawns)
  }
  spawn = (message: IMessage) => {
    let ninja = this.context.ninjas.createAt(message.x, message.y)
    ninja.id = message.id
  }
  dealt = (message: IMessage) => {
    // console.log('cards', message.cards)

    this.context.cards.setHand(message.cards)

  }
  moves = async (message: IMessage) => {
    log('moves', message.moves)

    for (let i = 0; i < message.moves.length; i++) {
      let c = message.moves[i]
      let ninja = _.find(this.context.ninjas.items, d => d.id === c.id)

      if (ninja) {
        ninja.moveTo(c.x, c.y)
        await delay(100)
      } else {
        logError('cant find ninja', c.id)
      }
    }

  }

  lava = (message: IMessage) => {
    this.context.gameMap.setLava(message.x, message.y)
  }

}