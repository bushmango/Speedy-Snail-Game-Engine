import { _ } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as log from '../../engine/log'
import * as spriteUtil from '../../engine/anim/spriteUtil'
import * as anim from '../../engine/anim/anim'

import * as placeSwitcher from './placeSwitcher'

export interface IMenuButton {
  anim: anim.IAnim
  textSprite: PIXI.Sprite
  container: PIXI.Container
  onOver?: (c: IMenuButton) => void
  onClick?: (c: IMenuButton) => void
  state: number
  text: PIXI.extras.BitmapText
  placeSwitcher: placeSwitcher.IPlaceSwitcher
}

var animDefault: anim.IAnimData = {
  frames: [spriteUtil.frame32(1, 1, 4, 1)],
}
var animHover: anim.IAnimData = {
  frames: [spriteUtil.frame32(3, 1, 4, 1)],
}
var animDown: anim.IAnimData = {
  frames: [spriteUtil.frame32(2, 1, 4, 1)],
}

let items: IMenuButton[] = []

export function create(text: string = '') {
  let ctx = getContext()

  log.x('create button')

  let item: IMenuButton = {
    anim: anim.create(),
    container: new PIXI.Container(),
    state: 0,
    text: null,
    textSprite: null,
    placeSwitcher: null,
  }

  // Set button mode
  item.container.buttonMode = true
  item.container.interactive = true

  item.container.on('mouseover', () => {
    item.state = 1
    anim.playAnim(item.anim, animHover)
    if (item.onOver) {
      item.onOver(item)
    }
  })
  item.container.on('mousemove', () => {
    if (item.state > 0 && item.onOver) {
      item.onOver(item)
    }
  })
  item.container.on('mouseout', () => {
    anim.playAnim(item.anim, animDefault)
    item.state = 0
  })
  item.container.on('mousedown', () => {
    anim.playAnim(item.anim, animDown)
    item.state = 2
  })
  item.container.on('mouseup', () => {
    anim.playAnim(item.anim, animHover)
    item.state = 1
    item.onClick(item)
  })

  let sprite = ctx.createSprite('512-32-gui', animDefault.frames[0], 0, 0, 1)
  item.container.addChild(sprite)
  ctx.layerUi.addChild(item.container)
  item.anim.sprite = sprite
  items.push(item)
  anim.playAnim(item.anim, animDefault)

  item.textSprite = ctx.createSprite(
    '512-32-gui',
    spriteUtil.frame32(1, 5, 5, 1),
    0,
    0,
    1
  )
  item.container.addChild(item.textSprite)

  item.text = new PIXI.extras.BitmapText(`${text}`, {
    font: '24px defaultfont',
    align: 'left',
  })
  item.text.anchor = new PIXI.Point(0, 0)
  item.container.addChild(item.text)

  item.container.position.set(100, 100)

  return item
}

export function updateAll(elapsedTimeSec) {
  let ctx = getContext()

  _.forEach(items, (c) => {
    anim.update(c.anim, elapsedTimeSec)

    if (c.placeSwitcher) {
      placeSwitcher.update(c.placeSwitcher, c.container, elapsedTimeSec)
    }

    c.textSprite.x = 0
    c.textSprite.y = 0
    if (c.state === 1) {
      c.textSprite.y = -2
    }
    if (c.state === 2) {
      c.textSprite.y = 1
    }
  })
}
