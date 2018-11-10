import { SimpleGameEngine } from 'engine/SimpleGameEngine'

export function create16_sprite(sge: SimpleGameEngine, textureKey, y, x) {
  const blockSize = 16
  let texture = sge.getTexture(textureKey)
  let sprite = new PIXI.Sprite(new PIXI.Texture(texture.baseTexture))
  let rectangle = new PIXI.Rectangle(
    blockSize * x,
    blockSize * y,
    blockSize,
    blockSize
  )
  sprite.texture.frame = rectangle
  return sprite
}

export function create16_frameHRun(y, x, num) {
  const blockSize = 16
  let rects = []
  for (let i = 0; i < num; i++) {
    rects.push(
      new PIXI.Rectangle(
        blockSize * (x + i),
        blockSize * y,
        blockSize,
        blockSize
      )
    )
  }
  return rects
}

export function create16_frame(y, x) {
  const blockSize = 16
  return new PIXI.Rectangle(blockSize * x, blockSize * y, blockSize, blockSize)
}
