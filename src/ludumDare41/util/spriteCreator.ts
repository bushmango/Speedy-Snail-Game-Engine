import { SimpleGameEngine } from 'engine/SimpleGameEngine'

export function create8_sprite(sge: SimpleGameEngine, textureKey, y, x) {
  const blockSize = 8
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

export function create_loose_sprite(
  sge: SimpleGameEngine,
  textureKey,
  y,
  x,
  w,
  h
) {
  let texture = sge.getTexture(textureKey)
  let sprite = new PIXI.Sprite(new PIXI.Texture(texture.baseTexture))
  let rectangle = new PIXI.Rectangle(x, y, w, h)
  sprite.texture.frame = rectangle
  return sprite
}
export function create_loose_sprite2(
  sge: SimpleGameEngine,
  textureKey,
  rectangle: PIXI.Rectangle
) {
  let texture = sge.getTexture(textureKey)
  let sprite = new PIXI.Sprite(new PIXI.Texture(texture.baseTexture))
  sprite.texture.frame = rectangle
  return sprite
}

export function create_card_frame(x) {
  let rectangle = new PIXI.Rectangle(8 * 4 + x * 8 * 2, 7 * 8, 8 * 2, 8 * 2)
  return rectangle
}

export function create_cardBack_frame(y) {
  let rectangle = new PIXI.Rectangle(8 * 1, 6 * 8 + y * 8 * 3, 8 * 3, 8 * 3)
  return rectangle
}

export function create8_frameHRun(y, x, num) {
  const blockSize = 8
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

export function create8_frame(y, x) {
  const blockSize = 8
  return new PIXI.Rectangle(blockSize * x, blockSize * y, blockSize, blockSize)
}
