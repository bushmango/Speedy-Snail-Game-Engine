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
}

export function create(sprite: PIXI.Sprite = null): IAnim {
  return {
    sprite,
    frameIndex: 0,
    frameTimeLeft: 0,
    currentAnimation: null,
    done: true,
  }
}

export function playAnim(anim: IAnim, animData: IAnimData, force = false) {
  if (!animData.textures) {
    animData.textures = _.map(animData.frames, (c) => {
      return new PIXI.Texture(anim.sprite.texture.baseTexture, c)
    })
  }

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

export function update(anim: IAnim, elapsedTime: number) {
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
