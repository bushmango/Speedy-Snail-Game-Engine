import { SimpleGameEngine } from 'engine/SimpleGameEngine'

let textures = []

let useGraphics = false

function loadTexFrame(sge: SimpleGameEngine, packed, name) {
  // let tex = new PIXI.Texture(sge.getTexture(packed).baseTexture)
  let json = sge.getJson(packed + '-json')
  let info = json.frames[name]
  let { frame } = info

  // console.log('load tex frame', name, json, info, frame)

  return new PIXI.Rectangle(frame.x, frame.y, frame.w, frame.h)
}
function loadTexPivot(sge: SimpleGameEngine, packed, name) {
  // let tex = new PIXI.Texture(sge.getTexture(packed).baseTexture)
  let json = sge.getJson(packed + '-json')
  let info = json.frames[name]
  let { pivot } = info

  // console.log('load tex pivot', name, json, info, pivot)

  return pivot
}

function loadTexAnchor(sge: SimpleGameEngine, packed, name) {
  // let tex = new PIXI.Texture(sge.getTexture(packed).baseTexture)
  let json = sge.getJson(packed + '-json')
  let info = json.frames[name]
  let { spriteSourceSize, sourceSize } = info

  // console.log('load tex anchor', name, json, info, spriteSourceSize, sourceSize)
  //.sprite2.anchor.x = -174/26
  //this.sprite2.anchor.y = -29/21
  return [
    -spriteSourceSize.x / spriteSourceSize.w,
    -spriteSourceSize.y / spriteSourceSize.h,
  ]
}

function loadGuiTexFrame(sge, name) {
  return loadTexFrame(sge, 'gui', name)
}
function loadGuiTexPivot(sge, name) {
  return loadTexPivot(sge, 'gui', name)
}
function loadGuiTexAnchor(sge, name) {
  return loadTexAnchor(sge, 'gui', name)
}
function loadGuiTex(sge) {
  return new PIXI.Texture(sge.getTexture('gui').baseTexture)
}

let defaultFrames = []

export class MenuButton {
  sge: SimpleGameEngine
  container: PIXI.Container
  graphics: PIXI.Graphics

  text: PIXI.extras.BitmapText
  sprite: PIXI.Sprite
  sprite2: PIXI.Sprite

  state = 0
  frames = []

  isActive = false

  onClick: () => any

  doClick() {
    if (this.onClick) {
      this.onClick()
    }
  }

  init(sge: SimpleGameEngine, text) {
    this.sge = sge
    this.container = new PIXI.Container()

    // Load shared
    if (defaultFrames.length === 0) {
      defaultFrames = [
        loadGuiTexFrame(this.sge, 'button-001-n'),
        loadGuiTexFrame(this.sge, 'button-001-h'),
        loadGuiTexFrame(this.sge, 'button-001-d'),
      ]
    }
    this.frames = defaultFrames

    if (useGraphics) {
      this.graphics = new PIXI.Graphics()
      this.graphics.clear()
      this.graphics.lineStyle(2, 0xff00ff, 1)
      this.graphics.beginFill(0xff00bb, 0.25)
      this.graphics.drawRoundedRect(0, 0, 200, 50, 6)
      this.graphics.endFill()
      this.container.addChild(this.graphics)
    }

    //let texture = loadGuiTex('button-001-n')
    this.sprite = new PIXI.Sprite(loadGuiTex(sge))
    this.sprite.texture.frame = this.frames[0]
    this.container.addChild(this.sprite)

    this.sprite2 = new PIXI.Sprite(loadGuiTex(sge))
    this.sprite2.texture.frame = loadGuiTexFrame(sge, 'test')
    //let p = loadGuiTexPivot(sge, 'test')
    //this.sprite2.pivot.set(p.x, p.y)
    let a = loadGuiTexAnchor(sge, 'test')
    this.sprite2.anchor.set(a[0], a[1])

    // this.sprite2.x = 174
    //this.sprite2.anchor.x = -174/26
    //this.sprite2.anchor.y = -29/21
    //this.sprite2.y = 29

    this.container.addChild(this.sprite2)

    this.text = new PIXI.extras.BitmapText(`${text}`, {
      font: '24px defaultfont',
      align: 'center',
    })
    this.text.anchor = new PIXI.Point(0.5, 0)
    this.container.addChild(this.text)

    // Set button mode
    this.container.buttonMode = true
    this.container.interactive = true

    this.container.on('mouseover', () => {
      this.state = 1
      this.sprite.texture.frame = this.frames[this.state]
    })
    this.container.on('mouseout', () => {
      this.state = 0
      this.sprite.texture.frame = this.frames[this.state]
    })
    this.container.on('mousedown', () => {
      this.state = 2
      this.sprite.texture.frame = this.frames[this.state]
    })
    this.container.on('mouseup', () => {
      this.state = 1
      this.sprite.texture.frame = this.frames[this.state]
      this.doClick()
    })
    // this.container.cursor = 'pointer'

    this.container.hitArea = new PIXI.Rectangle(0, 0, 200, 50)
  }

  setActive(isActive) {
    this.isActive = isActive
  }

  update(x, y) {
    this.container.x = x
    if (this.isActive) {
      this.container.x += 20
    }

    this.container.y = y
    //this.container.width = 200
    //this.container.height = 50

    this.text.x = 100

    this.text.y = 14 + (2 - this.state) - 3

    this.sprite.position.set(0, 2 - this.state)

    if (useGraphics) {
      this.graphics.x = 0
      this.graphics.y = 0
    }
  }
}
