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
import * as debris from './../actors/debris'
import * as enemyShips from './../actors/enemyShips'

import * as chroma from 'chroma-js'

import * as zones from './../actors/zones'

interface IGoalPieceMarker {
  anim: anim.IAnim
}
let item: IGoalPieceMarker = null
var animDefault: anim.IAnimData = {
  frames: [
    spriteUtil.frame32(11, 3, 2),
    spriteUtil.frame32(11, 5, 2),
    spriteUtil.frame32(11, 7, 2),
    spriteUtil.frame32(11, 9, 2),
  ], // spriteUtil.frame32runH(11, 3, 2),
  frameTime: 10 / 60,
  loop: true,
}

let ui = {
  //textSpeed: null as PIXI.extras.BitmapText,
  //textMass: null as PIXI.extras.BitmapText,
  statSpeed: null as IStatUI,
  statMass: null as IStatUI,
  statDist: null as IStatUI,

  textGameName: null as PIXI.extras.BitmapText,
  textTip: null as PIXI.extras.BitmapText,

  containerVictory: new PIXI.Container(),
  spriteVictory: null as PIXI.Sprite,
  textRescuedCats: null as PIXI.extras.BitmapText,
  textRescuedSnails: null as PIXI.extras.BitmapText,
  textRescuedChickens: null as PIXI.extras.BitmapText,
  textRescuedBabies: null as PIXI.extras.BitmapText,
  textScore: null as PIXI.extras.BitmapText,
  textBlocksDestroyed: null as PIXI.extras.BitmapText,
  textTime: null as PIXI.extras.BitmapText,
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

  ui.statDist = createStatUi(850, 13, 6, 4, 13, 10, 1)

  ui.textGameName = new PIXI.extras.BitmapText(`Space Goat - Coast to Coast`, {
    font: '24px tahoma24',
    align: 'left',
  })
  ui.textGameName.anchor = new PIXI.Point(0, 0)
  ctx.layerUi.addChild(ui.textGameName)
  ui.textGameName.x = 620
  ui.textGameName.y = 3

  ui.textTip = new PIXI.extras.BitmapText(`TIPZ`, {
    font: '24px tahoma24',
    align: 'left',
  })
  ui.textTip.anchor = new PIXI.Point(0, 0)
  ctx.layerUi.addChild(ui.textTip)
  ui.textTip.x = 50
  ui.textTip.y = 500

  ui.spriteVictory = ctx.createSprite(
    'victory',
    null, //spriteUtil.frame32(8, 6, 8),
    0,
    0,
    1
  )

  let y = 400
  let size = 24
  ui.textRescuedCats = new PIXI.extras.BitmapText(`Cats`, {
    font: '20px tahoma20',
    align: 'left',
  })
  ui.textRescuedCats.y = y
  y += size
  ui.textRescuedSnails = new PIXI.extras.BitmapText(`Snails`, {
    font: '20px tahoma20',
    align: 'left',
  })
  ui.textRescuedSnails.y = y
  y += size
  ui.textRescuedChickens = new PIXI.extras.BitmapText(`Chickens`, {
    font: '20px tahoma20',
    align: 'left',
  })
  ui.textRescuedChickens.y = y
  y += size
  ui.textRescuedBabies = new PIXI.extras.BitmapText(`Babies`, {
    font: '20px tahoma20',
    align: 'left',
  })
  ui.textRescuedBabies.y = y

  y += size
  ui.textBlocksDestroyed = new PIXI.extras.BitmapText(`Blocks Destroyed`, {
    font: '20px tahoma20',
    align: 'left',
  })
  ui.textBlocksDestroyed.y = y
  y += size
  ui.textTime = new PIXI.extras.BitmapText(`Time`, {
    font: '20px tahoma20',
    align: 'left',
  })
  ui.textTime.y = y
  y += size
  ui.textScore = new PIXI.extras.BitmapText(`Score`, {
    font: '20px tahoma20',
    align: 'left',
  })
  ui.textScore.y = y
  y += size

  ui.containerVictory.addChild(ui.spriteVictory)

  ui.containerVictory.addChild(ui.textRescuedCats)
  ui.containerVictory.addChild(ui.textRescuedSnails)
  ui.containerVictory.addChild(ui.textRescuedChickens)
  ui.containerVictory.addChild(ui.textRescuedBabies)
  ui.containerVictory.addChild(ui.textBlocksDestroyed)
  ui.containerVictory.addChild(ui.textScore)
  ui.containerVictory.addChild(ui.textTime)

  ctx.layerUi.addChild(ui.containerVictory)
  //em.spriteBackground.tint = chroma('#8CE381').num()

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

  zones.setCurrentZoneSet(ctx.stats.getCurrentStats().difficulty)

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

  ui.statDist.text.text = numeral(stats.distance).format('0.00')
}

function updateGoalPosition(elapsedTimeSec) {
  let ctx = getContext()
  let cv = ctx.getCameraView()
  let view = ctx.sge.getViewSize()
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
    speed = -5 // Penalty
  }
  if (!hasCore) {
    speed = -10 // Big penalty
    // Try to launch new core
    coreSpawner.launch()
  }
  if (goats.getItem().isFree) {
    speed = -10 // Big penalty
  }

  let zi = zones.getZoneInfo()
  if (
    speed > 0.01 &&
    enemyShips.getAll().length > 0 &&
    zi.currentZone.bossSpawn
  ) {
    // Slow down while fighting boss
    speed = 0.01
  }

  let cur = ctx.stats.getCurrentStats()

  if (cur.isResetting) {
    speed = -50
  }

  let d = cur.distance
  d += speed * elapsedTimeSec
  if (d <= 0) {
    d = 0
    speed = 0
    if (cur.isResetting) {
      ctx.stats.updateStats({ isResetting: false })
    }
  }

  ui.textTip.text = zi.currentZone.tip ? zi.currentZone.tip : ''
  ui.textTip.y = view.height - 70

  if (d >= zi.currentZoneSet.maxDistance) {
    d = zi.currentZoneSet.maxDistance
    // TODO: do win condition

    ctx.stats.updateStats({ victory: true })
  } else {
    ctx.stats.updateStats({ victory: false })
  }
  let p = d / zi.currentZoneSet.maxDistance

  // _.forEach(statItems, (c) => {
  //   //c.u
  //   // update?
  // })

  // Get our current zone
  zones.updateCurrentZone(d, speed)

  let curZone = zones.getCurrentZone()
  ui.textGameName.text = curZone.name // + ' - ' + numeral(d).format('0.00') + ' lightyears'

  ui.containerVictory.x =
    view.width -
    ui.spriteVictory.texture.width +
    (zi.currentZoneSet.maxDistance - d) * 500
  ui.containerVictory.y = 75

  // log.x('left: ', zi.currentZoneSet.maxDistance - d)

  ui.containerVictory.visible = ui.containerVictory.x < view.width

  if (ui.containerVictory.visible) {
    let curStats = ctx.stats.getCurrentStats()

    let numChickens = 0
    let numSnails = 0
    let numBabies = 0
    let numCats = 0
    _.forEach(debris.getAll(), (c) => {
      if (c.type === 'cat') {
        numCats++
      }
      if (c.type === 'snail') {
        numSnails++
      }
      if (c.type === 'baby') {
        numBabies++
      }
      if (c.type === 'chicken') {
        numChickens++
      }
    })
    ui.textRescuedCats.text = `${numCats} cats rescued`
    ui.textRescuedChickens.text = `${numChickens} chickens rescued`
    ui.textRescuedSnails.text = `${numSnails} snails rescued`
    ui.textRescuedBabies.text = `${numBabies} babies rescued`
    ui.textBlocksDestroyed.text = `${curStats.blocksDestroyed} blocks destroyed`
    ui.textTime.text = `${numeral(curStats.totalTime).format(
      '0.0'
    )} seconds flown`

    let score =
      (numCats + numSnails + numBabies + numChickens) * 500 +
      curStats.blocksDestroyed

    ui.textScore.text = `Score: ${score}`
  }

  ctx.stats.updateStats({
    speed: speed,
    mass: mass,
    distance: d,
    distancePercentage: p,
  })
}
