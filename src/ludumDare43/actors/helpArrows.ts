import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'
import { KeyCodes, Keyboard } from 'engine/input/Keyboard'

import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'
import * as tween from '../../engine/anim/tween'

import * as goats from './goats'
import * as shipParts from './shipParts'
import * as cameras from 'engine/camera/cameras'

interface IHelpArrow {
  anim: anim.IAnim
  text: PIXI.extras.BitmapText
  target: any
}
//let items: IGoat[] = []
let items: IHelpArrow[] = []

var animDefault: anim.IAnimData = {
  frames: spriteUtil.frame32runH(13, 1, 3),
  frameTime: 10 / 60,
  loop: true,
}

let helpGoat: IHelpArrow = null
let helpCore: IHelpArrow = null
let helpEngine: IHelpArrow = null

export function createAll() {
  helpGoat = create()
  helpGoat.text.text = 'This is you. A goat. In space.'

  helpCore = create()
  helpCore.text.text = 'CORE'

  helpEngine = create()
  helpEngine.text.text = 'ENGINE'
}

export function create() {
  let ctx = getContext()

  log.x('create help arrow goat')
  let item: IHelpArrow = {
    anim: anim.create(),
    text: null,
    target: null,
  }
  item.text = new PIXI.extras.BitmapText(`helper arrow`, {
    font: '20px defaultfont',
    align: 'left',
  })
  item.text.anchor = new PIXI.Point(0, 0.5)
  item.text.scale.set(0.5)

  ctx.layerGoat.addChild(item.text)

  let sprite = ctx.createSprite(
    'ship-001',
    animDefault.frames[0],
    0.5,
    0.5,
    0.5
  )
  item.anim.sprite = sprite
  anim.playAnim(item.anim, animDefault)

  ctx.layerGoat.addChild(item.anim.sprite)

  items.push(item)
  return item

  return item
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()
  let curStats = ctx.stats.getCurrentStats()

  let goat = goats.getItem()
  if (goat.isFree) {
    if (goat.isPickedUp) {
    } else {
    }
    setTarget(helpGoat, goat.anim.sprite)
  } else {
    setTarget(helpGoat, null)
  }

  let core = _.find(shipParts.getAll(), (c) => c.isCore)
  if (core) {
    if (goats.getItem().isFree) {
      helpCore.text.text = 'This is your core. Drag your goat here.'
      setTarget(helpCore, core.anim.sprite)
    } else {
      helpCore.text.text = 'Protect your core!'

      if (curStats.speed <= 0) {
        helpCore.text.text = 'Add an engine!'
        setTarget(helpCore, core.anim.sprite)
      } else if (curStats.mass <= 3) {
        helpCore.text.text = 'Protect your core!'
        setTarget(helpCore, core.anim.sprite)
      } else {
        setTarget(helpCore, null)
      }
    }
  } else {
    setTarget(helpCore, null)
  }

  setTarget(helpEngine, null)
  if (curStats.speed <= 0) {
    let engine = _.find(
      shipParts.getAll(),
      (c: shipParts.IShipPart) =>
        c.isFree && !c.isDead && c.data.enginePower > 0
    )
    if (engine && !goats.getItem().isFree) {
      helpEngine.text.text = 'Drag this [ENGINE] to your ship!'
      setTarget(helpEngine, engine.anim.sprite)
    }
  }

  _.forEach(items, (c) => {
    anim.update(c.anim, elapsedTimeSec)
  })
}

function setTarget(c: IHelpArrow, target: any) {
  c.target = target

  if (c.target) {
    let ctx = getContext()
    let view = ctx.sge.getViewSize()
    let wxy = cameras.cameraToXY(ctx.camera, target)
    if (wxy.y < 200) {
      setTargetBelow(c, target)
    } else if (wxy.y > view.height - 200) {
      setTargetAbove(c, target)
    } else {
      setTargetLeft(c, target)
    }
    //let cameraView = cameras.getCameraView(view)
  } else {
    c.text.visible = false
    c.anim.sprite.visible = false
  }
}

function setTargetLeft(c: IHelpArrow, target: any) {
  c.target = target

  if (c.target) {
    c.anim.sprite.rotation = 0
    c.anim.sprite.x = c.target.x + 24
    c.anim.sprite.y = c.target.y
    c.text.x = c.anim.sprite.x + 16
    c.text.y = c.anim.sprite.y
    c.text.visible = true
    c.anim.sprite.visible = true
  } else {
    c.text.visible = false
    c.anim.sprite.visible = false
  }
}

function setTargetBelow(c: IHelpArrow, target: any) {
  c.target = target
  if (c.target) {
    c.anim.sprite.rotation = Math.PI * 0.5
    c.anim.sprite.x = c.target.x
    c.anim.sprite.y = c.target.y + 24
    c.text.x = c.anim.sprite.x + 16
    c.text.y = c.anim.sprite.y
    c.text.visible = true
    c.anim.sprite.visible = true
  } else {
    c.text.visible = false
    c.anim.sprite.visible = false
  }
}

function setTargetAbove(c: IHelpArrow, target: any) {
  c.target = target
  if (c.target) {
    c.anim.sprite.rotation = -Math.PI * 0.5
    c.anim.sprite.x = c.target.x
    c.anim.sprite.y = c.target.y - 24
    c.text.x = c.anim.sprite.x + 16
    c.text.y = c.anim.sprite.y
    c.text.visible = true
    c.anim.sprite.visible = true
  } else {
    c.text.visible = false
    c.anim.sprite.visible = false
  }
}
