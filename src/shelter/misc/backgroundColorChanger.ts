import { getContext } from '../GameContext'
import * as chroma from 'chroma-js'
import * as log from 'engine/log'

let bgColor = chroma.random()

let frame = 0
let colorScale = chroma.scale(['lightyellow', 'navy']).mode('lab')
//.domain([1, 100000], 7, 'log')

export function setRandom() {
  setBackgroundColor(chroma.random())
}

export function cycleColor(elapsedTime) {
  frame += elapsedTime
  let x = Math.abs(Math.sin(frame))
  // log.x(frame, x)
  setBackgroundColor(colorScale(x))
}

export function setBackgroundColor(color) {
  let ctx = getContext()

  if (!color.num) {
    color = chroma(color)
  }
  bgColor = color
  // log.x('change color to', bgColor.hex())
  ctx.sge.renderer.backgroundColor = bgColor.num()
}
