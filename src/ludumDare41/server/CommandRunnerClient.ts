
import { IMessage } from './IMessage'
import { LudumDare41Context } from 'ludumDare41/LudumDare41Context';

export class CommandRunnerClient {
  context: LudumDare41Context
  init(context: LudumDare41Context) {
    this.context = context
  }

  run(message: IMessage) {
    console.log('message', message.command, message)
    if (this[message.command]) {
      this[message.command](message)
    } else {
      console.error('unknown message', message.command)
    }
  }

  resetMap = (message) => {
    this.context.ninjas.clear()
  }
  spawn = (message) => {
    this.context.ninjas.createAt(message.x, message.y)
  }
  dealt = (message) => {
    console.log('cards', message.cards)

    this.context.cards.setHand(message.cards)

  }

}