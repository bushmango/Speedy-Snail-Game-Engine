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

import * as chroma from 'chroma-js'

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
  //textSpeed: null as PIXI.extras.BitmapText,
  //textMass: null as PIXI.extras.BitmapText,
  statSpeed: null as IStatUI,
  statMass: null as IStatUI,
  textGameName: null as PIXI.extras.BitmapText,
}

interface IStatUI {
  container: PIXI.Container
  spriteBackground: PIXI.Sprite
  spriteUnits: PIXI.Sprite
  spriteLabel: PIXI.Sprite
  text: PIXI.extras.BitmapText
}

let statItems: IStatUI[] = []
function createStatUi(x, a, b, c, d, e, f) {
  let ctx = getContext()
  let item: IStatUI = {
    container: new PIXI.Container(),
    spriteBackground: null,
    spriteUnits: null,
    spriteLabel: null,
    text: null,
  }

  item.text = new PIXI.extras.BitmapText(`0.000`, {
    font: '16px tahoma16',
    align: 'left',
  })
  item.text.anchor = new PIXI.Point(0, 0)
  item.text.x = 120 - 5
  item.text.y = 6 + 2

  item.container.x = x
  item.container.y = 0

  item.spriteBackground = ctx.createSprite(
    '512-32-gui',
    spriteUtil.frame32(8, 6, 8),
    0,
    0,
    1
  )
  item.spriteBackground.tint = chroma('#8CE381').num()

  item.spriteLabel = ctx.createSprite(
    '512-32-gui',
    spriteUtil.frame32(a, b, c),
    0,
    0,
    1
  )
  item.spriteLabel.x = 10

  item.spriteUnits = ctx.createSprite(
    '512-32-gui',
    spriteUtil.frame32(d, e, f),
    1,
    0,
    1
  )
  item.spriteUnits.x = 210

  item.container.addChild(item.spriteBackground)
  item.container.addChild(item.spriteUnits)
  item.container.addChild(item.spriteLabel)
  item.container.addChild(item.text)

  ctx.layerUi.addChild(item.container)

  statItems.push(item)
  return item
}

export function create() {
  let ctx = getContext()

  log.x('create ui goal ui')

  ui.statSpeed = createStatUi(150, 6, 6, 3, 7, 9, 2)
  ui.statMass = createStatUi(530 - 150, 7, 6, 3, 6, 9, 2)

  ui.textGameName = new PIXI.extras.BitmapText(`Space Goat - Coast to Coast`, {
    font: '24px tahoma24',
    align: 'left',
  })
  ui.textGameName.anchor = new PIXI.Point(0, 0)
  ctx.layerUi.addChild(ui.textGameName)
  ui.textGameName.x = 620
  ui.textGameName.y = 3

  // ui.textMass = new PIXI.extras.BitmapText(`Mass: xyz`, {
  //   font: '20px defaultfont',
  //   align: 'left',
  // })
  // ui.textMass.anchor = new PIXI.Point(0, 0)
  // ctx.layerUi.addChild(ui.textMass)
  // ui.textMass.x = 600
  // ui.textMass.y = 0

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

  let y = 55

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
  // ui.textMass.text = 'Mass: ' + numeral(stats.mass).format('0.0') + ' tons'
  // ui.textSpeed.text = 'Speed: ' + numeral(stats.speed).format('0.00') + ' ly/s'
  // ui.textMass.text = 'Mass: ' + numeral(stats.mass).format('0.0') + ' tons'
  //ui.textSpeed.text = 'Speed: ' + numeral(stats.speed).format('0.00') + ' ly/s'
  ui.statMass.text.text = numeral(stats.mass).format('0.00')
  ui.statSpeed.text.text = numeral(stats.speed).format('0.00')
}

function updateGoalPosition(elapsedTimeSec) {
  let ctx = getContext()
  let mass = 0
  let engines = 0
  let hasCore = false
  _.forEach(shipParts.getAll(), (c) => {
    if (c.isAttached && !c.isDead) {
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

  _.forEach(statItems, (c) => {
    //c.u
    // update?
  })

  ctx.stats.updateStats({
    speed: speed,
    mass: mass,
    distance: d,
    distancePercentage: p,
  })
}
