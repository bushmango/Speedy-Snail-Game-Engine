import * as assert from 'engine/common/assert'
import { _, numeral } from 'engine/importsEngine'
import { Keyboard } from 'engine/input/Keyboard'
import * as mouse from 'engine/input/mouse'
// import {keyboard} from 'pixi-keyboard'

// Add PIXI plugins
// declare global {
//   namespace PIXI {
//     const keyboardManager: any
//   }
// }

import isElectron from 'is-electron'

import * as log from './log'

export class SimpleGameEngine {
  pixiMode = 'unknown'
  renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer = null
  stage: PIXI.Container = null
  loader: PIXI.loaders.Loader = null

  loadingMessage: PIXI.Text
  frameRateText: PIXI.extras.BitmapText

  keyboard = new Keyboard()

  _defaultFont = '16px defaultfont'
  _frameMode = 'full'

  init(defaultFont = '16px defaultfont', frameMode = 'full') {
    log.x('starting SGE')

    this._defaultFont = defaultFont
    this._frameMode = frameMode

    let type = 'WebGL'
    if (!PIXI.utils.isWebGLSupported()) {
      type = 'canvas'
    }

    PIXI.utils.sayHello(type)

    this.keyboard.init()

    log.x('started SGE')
  }

  resize() {
    if (this.renderer) {
      let w = window
      let d = document
      let e = d.documentElement
      let g = d.getElementsByTagName('body')[0]
      let width = w.innerWidth || e.clientWidth || g.clientWidth
      let height = w.innerHeight || e.clientHeight || g.clientHeight

      this.renderer.resize(width, height)
      if (this.onResize) {
        this.onResize()
      }
    }
  }
  onResize = () => {}

  createRenderer() {
    // Create the renderer
    let renderer = (this.renderer = PIXI.autoDetectRenderer(256, 256, {
      antialias: false,
      transparent: false,
      resolution: 1,
    }))

    if (this.renderer instanceof PIXI.CanvasRenderer) {
      this.pixiMode = 'canvas'
    } else {
      this.pixiMode = 'openGl'
    }

    // renderer.backgroundColor = 0x061639
    renderer.view.style.position = 'absolute'
    renderer.view.style.display = 'block'
    renderer.autoResize = true
    renderer.resize(window.innerWidth, window.innerHeight)

    let el = document.getElementById('game-root')
    if (el) {
      el.appendChild(renderer.view)
    } else {
      document.body.appendChild(renderer.view)
    }

    let stage = (this.stage = new PIXI.Container())
    renderer.render(stage)

    return renderer
  }

  getViewSize() {
    let { width, height } = this.renderer
    return { width, height }
  }

  addGroup(group) {
    this.stage.addChild(group)
  }

  // Preloading
  _preloadBitmapFonts = []
  preloadBitmapFonts(files) {
    _.forEach(files, (c) => {
      this._preloadBitmapFonts.push(c)
    })
  }
  _preloadSprites = []
  preloadSprites(files) {
    _.forEach(files, (c) => {
      this._preloadSprites.push(c)
    })
  }
  _preloadSpritesheets = []
  preloadSpriteSheets(files) {
    _.forEach(files, (c) => {
      this._preloadSpritesheets.push(c)
    })
  }
  _preloadTiledMaps = []
  preloadTiledMaps(files) {
    _.forEach(files, (c) => {
      this._preloadTiledMaps.push(c)
    })
  }
  _preloadAudioSprites = []
  preloadAudioSprites(files) {
    _.forEach(files, (c) => {
      this._preloadAudioSprites.push(c)
    })
  }
  _preloadPackedSprites = []
  preloadPackedSprites(files) {
    _.forEach(files, (c) => {
      this._preloadPackedSprites.push(c)
    })
  }

  preload(rootDirectory, onLoadedCallback: () => void) {
    let loadingMessage = (this.loadingMessage = new PIXI.Text('Loading...', {
      fontFamily: 'Arial',
      fontSize: 64,
      fill: 'white',
    }))

    console.log('electron?', isElectron())
    if (isElectron) {
      rootDirectory = '.' + rootDirectory
    }

    let loader = (this.loader = new PIXI.loaders.Loader())
    loader.on('progress', (loader, resource) => {
      this.onloaderProgress(loader, resource)
    })

    _.forEach(this._preloadAudioSprites, (c) => {
      loader.add(c, rootDirectory + '/sounds/' + c + '.json') //'.txt')
    })
    _.forEach(this._preloadBitmapFonts, (c) => {
      loader.add(c + '-font', rootDirectory + '/fonts/' + c + '.txt')
      loader.add(c, rootDirectory + '/fonts/' + c + '.png')
    })
    _.forEach(this._preloadSprites, (c) => {
      loader.add(c, rootDirectory + '/images/' + c + '.png')
    })
    _.forEach(this._preloadSpritesheets, (c) => {
      loader.add(c, rootDirectory + '/images/' + c + '.png')
    })
    _.forEach(this._preloadTiledMaps, (c) => {
      loader.add(c, rootDirectory + '/maps/' + c + '.json')
    })
    _.forEach(this._preloadPackedSprites, (c) => {
      loader.add(c + '-json', rootDirectory + '/images-packed/' + c + '.json')
      loader.add(c, rootDirectory + '/images-packed/' + c + '.png')
    })

    loader
      // .add('SourceSansPro', "public/fonts/source-sans-pro.fnt.xml")
      // .add("public/fonts/source-sans-pro.png")
      // .add("public/images/test-ship.png")
      // .add("public/images/test-tileset.png")
      // .add("public/images/gui-tileset.png")
      // .add("public/images/space-512-8.png")
      // .add("public/maps/tiled-test.json")
      // .add("public/sounds/audioSprite.json")
      .load(() => {
        _.forEach(this._preloadSpritesheets, (c) => {
          // Pixel mode!
          this.loader.resources[c].texture.baseTexture.scaleMode =
            PIXI.SCALE_MODES.NEAREST
        })

        _.forEach(this._preloadBitmapFonts, (c) => {
          let xml = this.getXml(c + '-font')
          let tex = this.getTexture(c)
          PIXI.extras.BitmapText.registerFont(xml, tex)
        })

        this.loadingMessage.visible = false
        let frameRateText = (this.frameRateText = new PIXI.extras.BitmapText(
          '',
          { font: this._defaultFont }
        ))
        frameRateText.position.set(0, 2)
        this.stage.addChild(frameRateText)

        onLoadedCallback()
      })
  }
  onloaderProgress(loader, resource) {
    let text = Math.floor(loader.progress) + '%' + ' - ' + resource.url
    // console.log('loading', text)
    this.loadingMessage.text = text
    this.renderer.render(this.stage)
  }

  getJson(key: string) {
    // console.log('get json', key)
    let res = this.loader.resources[key]
    assert.exists(res, `json not loaded ${key}`)
    assert.exists(res.data, `is not json ${key}`)

    //let json = JSON.parse(res.data)
    // TODO: cache?

    return res.data
  }

  getXml(key: string) {
    // console.log('get json', key)
    let res = this.loader.resources[key]
    // console.log(key, res)
    // console.log(key, res.data)
    assert.exists(res, `xml not loaded ${key}`)
    assert.exists(res.data, `is not xml ${key}`)

    let parser = new DOMParser()
    let xmlDoc = parser.parseFromString(res.data, 'text/xml')

    return xmlDoc
  }

  getTexture(key: string) {
    let res = this.loader.resources[key]
    assert.exists(res, `tex not loaded ${key}`)
    assert.exists(res.texture, `is not tex ${key}`)
    return res.texture
  }

  getMousePosition(): { x: number; y: number } {
    var mouseposition = this.renderer.plugins.interaction.mouse.global
    return mouseposition
  }
  getMouse() {
    return mouse.getMouse()
  }

  fpsLimit = 30
  fpsLimit_previousDelta = 0

  startGameLoop() {
    this.frameRateStart = new Date().getTime()
    requestAnimationFrame(() => {
      this.gameLoop()
    })
  }
  frameNum = 0
  frameNumThisInterval = 0
  frameRateStart
  framesPerSecond = null

  lastPerfStart = 0
  lastPerfMid = 0
  lastPerfEnd = 0
  perfStart = 0
  perfMid = 0
  perfEnd = 0

  frameLoads = []
  frameMaxLoad = 0
  frameAverageLoad = 0

  elapsedFrameStart = 0
  elapsedFrameEnd = 0
  elapsedTimeMs = 0
  elapsedTimeSec

  gameLoop() {
    this.elapsedFrameEnd = performance.now()
    this.elapsedTimeMs = 16.6
    if (this.elapsedFrameStart !== 0) {
      this.elapsedTimeMs = this.elapsedFrameEnd - this.elapsedFrameStart
    }
    this.elapsedTimeSec = this.elapsedTimeMs / 1000
    this.elapsedFrameStart = this.elapsedFrameEnd

    this.lastPerfStart = this.perfStart
    this.lastPerfMid = this.perfMid
    this.lastPerfEnd = this.perfEnd

    let lastTimeA = this.lastPerfMid - this.lastPerfStart
    let lastTimeB = this.lastPerfEnd - this.lastPerfStart
    let frameLoad = lastTimeB
    this.frameLoads.push(frameLoad)
    // ${lastTimeA}/${lastTimeB}/

    // Loop this function at ~60 frames per second (depending on monitor)
    requestAnimationFrame(() => {
      this.gameLoop()
    })

    this.perfStart = performance.now()

    // Update keyboard
    this.keyboard.onUpdate()

    // Update mouse
    let mousePosition = this.getMousePosition()
    mouse.scan(mousePosition.x, mousePosition.y)

    // Update the current game state:
    this.frameNum++
    this.frameNumThisInterval++
    const maxMsPerFrame = 16.6

    this.frameRateText.text = `${this.framesPerSecond || '--'} | ${numeral(
      this.frameAverageLoad / maxMsPerFrame
    ).format('0%')} | ${numeral(this.frameMaxLoad / maxMsPerFrame).format(
      '0%'
    )} | ${numeral(this.frameMaxLoad).format('0')}ms | ${this.frameNum % 60} ${
      this.frameMaxLoad / maxMsPerFrame > 0.5 ? 'WARNING' : ''
    } `

    if (this._frameMode === 'full') {
      this.frameRateText.text = `${this.framesPerSecond || '--'} | ${numeral(
        this.frameAverageLoad / maxMsPerFrame
      ).format('0%')} | ${numeral(this.frameMaxLoad / maxMsPerFrame).format(
        '0%'
      )} | ${numeral(this.frameMaxLoad).format('0')}ms | ${this.frameNum %
        60} ${this.frameMaxLoad / maxMsPerFrame > 0.5 ? 'WARNING' : ''} `
    } else if (this._frameMode === 'lite') {
      this.frameRateText.text = `${this.framesPerSecond || '--'} | ${numeral(
        this.frameAverageLoad / maxMsPerFrame
      ).format('0%')} | ${numeral(this.frameMaxLoad).format('0')}ms`
    } else {
      this.frameRateText.text = `${this.framesPerSecond || '--'}`
    }

    this.onUpdate()

    // FPS counter
    let fpsMultiplier = 2
    let now = new Date().getTime()
    if (now - this.frameRateStart >= 1000 * fpsMultiplier) {
      this.framesPerSecond = Math.floor(
        (this.frameNumThisInterval * (now - this.frameRateStart)) /
          1000 /
          fpsMultiplier /
          fpsMultiplier
      )
      this.frameNumThisInterval = 0
      this.frameRateStart = now

      this.frameMaxLoad = _.max(this.frameLoads)
      this.frameAverageLoad = _.mean(this.frameLoads)
      this.frameLoads = []
    }

    this.perfMid = performance.now()

    // Render the stage to see the animation
    this.renderer.render(this.stage)

    this.perfEnd = performance.now()
  }

  onUpdateCallback: () => void = null
  onUpdate() {
    if (this.onUpdateCallback) {
      this.onUpdateCallback()
    }
  }
}
