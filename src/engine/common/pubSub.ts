// Basic pub/sub signaling
// see: https://github.com/arqex/freezer
import { Freezer } from 'engine/importsEngine'

const pubSubFreezer = new Freezer({})
const pubSubHub = pubSubFreezer.getEventHub()

export function emit(actionName, data?: any) {
  pubSubHub.emit(actionName, data)
}

export function on(actionName, cb: (data?: any) => any) {
  pubSubHub.on(actionName, cb)
}
