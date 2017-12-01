// import { _ } from 'engine/importsLodash'

export function fail(reason = 'unknown reason') {
  throw new Error(reason)
}

export function failIf(condition, reason) {
  if(condition) {
    fail(reason)
  } 
}

export function failIfNot(condition, reason) {
  if(!condition) {
    fail(reason)
  }
}

export function is(condition, reason) {
  if(!condition) {
    fail(reason)
  }
}

export function exists(condition, reason) {
  if(condition === null || condition === undefined) {
    fail(reason)
  }
}

export function allExists(...objs) {
  for(let i = 0; i < objs.length; i++) {
    exists(objs[i], 'all exists failed')
  }
}

export function notImplemented(reason) {
  fail(reason || 'this feature is not implemented yet')
}
