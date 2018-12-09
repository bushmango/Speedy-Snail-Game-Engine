import * as _ from 'lodash'

export interface IAnimData {
  frames: PIXI.Rectangle[]
  textures?: PIXI.Texture[]
  frameTime?: number
  loop?: boolean
}

export interface IAnim {
  sprite: PIXI.Sprite
  frameIndex: number
  frameTimeLeft: number
  currentAnimation: IAnimData
  done: boolean
  isCustomFrame: boolean
  customFrameTexture: PIXI.Texture
}

export function create(sprite: PIXI.Sprite = null): IAnim {
  return {
    sprite,
    frameIndex: 0,
    frameTimeLeft: 0,
    currentAnimation: null,
    done: true,
    isCustomFrame: false,
    customFrameTexture: null,
  }
}

export function copyPosition(a: IAnim, b: IAnim) {
  a.sprite.x = b.sprite.x
  a.sprite.y = b.sprite.y
}

export function playAnim(anim: IAnim, animData: IAnimData, force = false) {
  if (!animData.textures) {
    animData.textures = _.map(animData.frames, (c) => {
      return new PIXI.Texture(anim.sprite.texture.baseTexture, c)
    })
  }

  anim.isCustomFrame = false

  // Continue playing current animation?
  if (!force && anim.currentAnimation === animData) {
    return
  }

  anim.currentAnimation = animData
  anim.sprite.texture = animData.textures[0]
  anim.frameIndex = 0
  anim.frameTimeLeft = animData.frameTime || 10 / 60
  anim.done = false
}

export function setFrame(anim: IAnim, frame: PIXI.Rectangle) {
  if (!anim.customFrameTexture) {
    anim.customFrameTexture = new PIXI.Texture(
      anim.sprite.texture.baseTexture,
      frame
    )
  } else {
    anim.customFrameTexture.frame = frame
  }
  anim.sprite.texture = anim.customFrameTexture

  anim.currentAnimation = null
  anim.isCustomFrame = true
  anim.done = true
}

export function update(anim: IAnim, elapsedTime: number) {
  if (anim.isCustomFrame) {
    return // Stuck here :)
  }

  if (anim.currentAnimation) {
    anim.frameTimeLeft -= elapsedTime
    if (anim.frameTimeLeft < 0) {
      anim.frameIndex++
      if (anim.frameIndex >= anim.currentAnimation.frames.length) {
        if (anim.currentAnimation.loop) {
          anim.frameIndex = 0
        } else {
          anim.done = true
        }
      }
      if (anim.frameIndex < anim.currentAnimation.textures.length) {
        anim.sprite.texture = anim.currentAnimation.textures[anim.frameIndex]
      }
      anim.frameTimeLeft = anim.currentAnimation.frameTime
    }
  }
}
