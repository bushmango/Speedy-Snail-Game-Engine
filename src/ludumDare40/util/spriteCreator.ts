import { SimpleGameEngine } from 'engine/SimpleGameEngine'

export function createSprite16(sge: SimpleGameEngine, textureKey, y, x) {
  const blockSize = 16
  let texture = sge.getTexture(textureKey)
  let sprite = new PIXI.Sprite(new PIXI.Texture(texture.baseTexture))
  let rectangle = new PIXI.Rectangle(blockSize * x, blockSize * y, blockSize, blockSize)
  sprite.texture.frame = rectangle
  return sprite
}