import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from 'engine/log'
import * as spriteUtil from 'engine/anim/spriteUtil'
import * as anim from 'engine/anim/anim'
import * as numeral from 'numeral'

import * as goalPieces from './../actors/goalPieces'
import * as shipParts from './../actors/shipParts'
import * as coreSpawner from './../actors/coreSpawner'
import * as goats from './../actors/goats'

interface IGoalPieceMarker {
  anim: anim.IAnim
}
let item: IGoalPieceMarker = null
var animDefault: anim.IAnimData = {
  frames: spriteUtil.frame32runH(11, 3, 2),
  frameTime: 10 / 60,
  loop: true,
}

let ui = {
  textSpeed: null as PIXI.extras.BitmapText,
  textMass: null as PIXI.extras.BitmapText,
}

export function create() {
  let ctx = getContext()

  log.x('create ui goal ui')

  ui.textSpeed = new PIXI.extras.BitmapText(`Speed: xyz`, {
    font: '20px defaultfont',
    align: 'left',
  })
  ui.textSpeed.anchor = new PIXI.Point(0, 0)
  ctx.layerUi.addChild(ui.textSpeed)
  ui.textSpeed.x = 200
  ui.textSpeed.y = 0

  ui.textMass = new PIXI.extras.BitmapText(`Mass: xyz`, {
    font: '20px defaultfont',
    align: 'left',
  })
  ui.textMass.anchor = new PIXI.Point(0, 0)
  ctx.layerUi.addChild(ui.textMass)
  ui.textMass.x = 400
  ui.textMass.y = 0

  log.x('create goal pieces')

  for (let i = 0; i < 20; i++) {
    let c = goalPieces.create()
    if (i % 5 === 0) {
      anim.playAnim(c.anim, goalPieces.animAsteroid)
    }
  }

  let cs = goalPieces.getAll()
  anim.playAnim(cs[0].anim, goalPieces.animPlanet)
  anim.playAnim(cs[cs.length - 1].anim, goalPieces.animFlag)

  log.x('create goal piece marker')
  item = {
    anim: anim.create(),
  }
  item.anim.sprite = ctx.createSprite(
    'ship-001',
    animDefault.frames[0],
    0.5,
    0.5,
    2
  )
  ctx.layerUi.addChild(item.anim.sprite)
  anim.playAnim(item.anim, animDefault)
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()
  let view = ctx.sge.getViewSize()

  updateGoalPosition(elapsedTimeSec)
  let stats = ctx.stats.getCurrentStats()

  let percentage = stats.distancePercentage

  let y = 35

  let margin = 30
  let num = goalPieces.getAll().length
  let goalLength = view.width - margin * 2
  let spacing = goalLength / (num - 1)
  _.forEach(goalPieces.getAll(), (c, cIdx) => {
    c.anim.sprite.x = cIdx * spacing + margin
    c.anim.sprite.y = y
  })

  item.anim.sprite.y = y + 10
  item.anim.sprite.x = margin + goalLength * percentage
  anim.update(item.anim, elapsedTimeSec)

  // Display stats
  ui.textMass.text = 'Mass: ' + numeral(stats.mass).format('0.0') + ' tons'
  ui.textSpeed.text = 'Speed: ' + numeral(stats.speed).format('0.00') + ' ly/s'
}

function updateGoalPosition(elapsedTimeSec) {
  let ctx = getContext()
  let mass = 0
  let engines = 0
  let hasCore = false
  _.forEach(shipParts.getAll(), (c) => {
    if (!c.isFree && !c.isDead) {
      // Count engines
      if (c.isCore) {
        hasCore = true
      }
      if (c.data.enginePower) {
        engines += c.data.enginePower
      }
      // Count parts
      mass += c.data.mass
    }
  })

  let speed = (engines * 5) / (mass || 1)

  if (speed === 0) {
    speed = -1 // Penalty
  }
  if (!hasCore) {
    speed = -5 // Big penalty
    // Try to launch new core
    coreSpawner.launch()
  }
  if (goats.getItem().isFree) {
    speed = -5 // Big penalty
  }

  let cur = ctx.stats.getCurrentStats()
  let d = cur.distance
  d += speed * elapsedTimeSec
  if (d <= 0) {
    d = 0
    speed = 0
  }
  if (d >= cur.distanceMax) {
    d = cur.distanceMax
    // TODO: do win condition
  }
  let p = d / cur.distanceMax

  ctx.stats.updateStats({
    speed: speed,
    mass: mass,
    distance: d,
    distancePercentage: p,
  })
}
