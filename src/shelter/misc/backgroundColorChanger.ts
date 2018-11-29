

import { getContext } from '../GameContext'

let col

export function backgroundColorChanger() {
  let ctx = getContext()
  ctx.sge.renderer.backgroundColor = 0xff333333
}