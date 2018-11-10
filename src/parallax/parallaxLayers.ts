import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { ParallaxContext } from './ParallaxContext'

import { KeyCodes, Keyboard } from 'engine/input/Keyboard'

const isActive = true

interface IParallaxLayer {
  sprites: PIXI.Sprite[]
  positionXScale: number
  endX: number
  //sizeScale: number
}
let parallaxLayers: IParallaxLayer[] = []

var framesBuildings = [
  new PIXI.Rectangle(16 * 2, 16 * 2, 16 * 2, 16 * 3),
  new PIXI.Rectangle(16 * 6, 16 * 2, 16 * 2, 16 * 3),
  new PIXI.Rectangle(16 * 10, 16 * 2, 16 * 2, 16 * 3),
]

var framesMountains = [new PIXI.Rectangle(16 * 2, 16 * 8, 16 * 8, 16 * 5)]

export { framesBuildings, framesMountains }

export function create(
  ctx: ParallaxContext,
  container: PIXI.Container,
  positionXScale: number,
  sizeScale: number,
  y: number,
  frames: PIXI.Rectangle[]
) {
  let item: IParallaxLayer = {
    sprites: [],
    positionXScale,
    endX: 0,
  }

  let baseTex = ctx.sge.getTexture('parallax-buildings')

  var texs = _.map(frames, (c) => new PIXI.Texture(baseTex.baseTexture, c))

  var tex0 = texs[0]

  let numSprites =
    Math.ceil(ctx.sge.getViewSize().width / (tex0.width * sizeScale)) + 1
  for (let i = 0; i < numSprites; i++) {
    let sprite = new PIXI.Sprite(_.sample(texs))
    sprite.anchor.set(0, 0)
    sprite.y = y
    sprite.x = i * sprite.width * sizeScale
    item.endX += sprite.width * sizeScale
    sprite.scale.set(sizeScale)
    item.sprites.push(sprite)
    container.addChild(sprite)
  }

  parallaxLayers.push(item)

  return item
}

import { InputControl } from 'engine/gamepad/InputControl'
export function updateLayers(ctx: ParallaxContext) {
  let kb = ctx.sge.keyboard

  let adj = -10
  if (kb.isPressed(KeyCodes.arrowRight)) {
    adj = 20
  }
  if (kb.isPressed(KeyCodes.arrowLeft)) {
    adj = -20
  }

  let boundLeft = 0
  let boundRight = 600

  _.forEach(parallaxLayers, (c) => {
    _.forEach(c.sprites, (sprite) => {
      sprite.x += adj * c.positionXScale
    })
    _.forEach(c.sprites, (sprite) => {
      if (sprite.x + sprite.width < boundLeft) {
        // move to the end
        let maxRight = 0
        _.forEach(c.sprites, (d) => {
          let r = d.x + d.width
          if (r > maxRight) {
            maxRight = r
          }
        })

        sprite.x = maxRight
      }
      // if (sprite.x > boundRight) {
      //   sprite.x = boundLeft;
      // }
    })
  })
}
