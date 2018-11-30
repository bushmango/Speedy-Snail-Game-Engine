import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as pubSub from 'engine/common/pubSub'

let textures = []

let useGraphics = false

export class MenuButtonSimple {
  sge: SimpleGameEngine
  container: PIXI.Container
  graphics: PIXI.Graphics

  text: PIXI.extras.BitmapText

  isActive = false
  state = 0

  onClick: () => any
  onOver: (btn: MenuButtonSimple) => any

  doClick() {
    if (this.onClick) {
      this.onClick()
    }

    pubSub.emit('gui:click-button')
  }

  init(sge: SimpleGameEngine, text) {
    this.sge = sge
    this.container = new PIXI.Container()

    if (useGraphics) {
      this.graphics = new PIXI.Graphics()
      this.graphics.clear()
      this.graphics.lineStyle(2, 0xff00ff, 1)
      this.graphics.beginFill(0xff00bb, 0.25)
      this.graphics.drawRoundedRect(0, 0, 200, 50, 6)
      this.graphics.endFill()
      this.container.addChild(this.graphics)
    }

    this.text = new PIXI.extras.BitmapText(`${text}`, {
      font: '24px defaultfont',
      align: 'left',
    })
    this.text.anchor = new PIXI.Point(0, 0)
    this.container.addChild(this.text)

    // Set button mode
    this.container.buttonMode = true
    this.container.interactive = true

    this.container.on('mouseover', () => {
      this.state = 1
      if (this.onOver) {
        this.onOver(this)
      }
    })
    this.container.on('mousemove', () => {
      if (this.state > 0 && this.onOver) {
        this.onOver(this)
      }
    })
    this.container.on('mouseout', () => {
      this.state = 0
    })
    this.container.on('mousedown', () => {
      this.state = 2
    })
    this.container.on('mouseup', () => {
      this.state = 1
      this.doClick()
    })

    this.container.hitArea = new PIXI.Rectangle(0, 0, 400, 50)
  }

  setActive(isActive) {
    this.isActive = isActive
  }

  update(x, y) {
    this.container.x = x
    if (this.isActive) {
      // this.container.x += 10
    }

    this.container.y = y
    //this.container.width = 200
    //this.container.height = 50

    this.text.x = 100

    // this.text.y = 14 + (2 - this.state) - 3
    this.text.y = 14

    if (useGraphics) {
      this.graphics.x = 0
      this.graphics.y = 0
    }
  }
}
