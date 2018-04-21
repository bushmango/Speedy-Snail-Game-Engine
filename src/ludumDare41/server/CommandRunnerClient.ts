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

  resetMap = (message: IMessage) => {
    this.context.ninjas.clear()
  }
  spawn = (message: IMessage) => {
    let ninja = this.context.ninjas.createAt(message.x, message.y)
    ninja.id = message.id
  }
  dealt = (message: IMessage) => {
    // console.log('cards', message.cards)

    this.context.cards.setHand(message.cards)

  }
  moves = (message: IMessage) => {
    log('moves', message.moves)

    _.forEach(message.moves, c => {
      let ninja = _.find(this.context.ninjas.items, d => d.id === c.id)

      if (ninja) {
        ninja.moveTo(c.x, c.y)
      } else {
        logError('cant find ninja', c.id)
      }

    })

  }

}