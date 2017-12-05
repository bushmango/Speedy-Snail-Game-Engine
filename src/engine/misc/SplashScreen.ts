import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine';

const isActive = true

export class SplashScreen {

  frame = 0

  sprite: PIXI.Sprite
  container: PIXI.Container = new PIXI.Container()

  sge: SimpleGameEngine

  onDone: () => void

  init(sge, texName, onDone) {
    this.onDone = onDone
    this.sge = sge
    let texture = sge.getTexture(texName)
    let size = 32
    this.sprite = new PIXI.Sprite(texture)
    this.sprite.anchor.set(0.5, 0.5)
    this.container.addChild(this.sprite)
  }


  update() {


    this.frame++

    let maxTime = 120
    let thirdTime = maxTime / 3

    if (!isActive) {
      this.frame = maxTime
    }

    if (this.frame < maxTime) {
      let { width, height } = this.sge.getViewSize()

      let opacity = 1
      if (this.frame < thirdTime) {
        opacity = this.frame / thirdTime
      }
      if (this.frame > 2 * thirdTime) {
        opacity = (maxTime - this.frame) / thirdTime
      }

      this.sprite.alpha = opacity

      this.sprite.x = width / 2
      this.sprite.y = height / 2

      let scale1 = Math.floor(width / this.sprite.texture.width)
      let scale2 = Math.floor(height / this.sprite.texture.height)
      let scale = scale1
      if (scale2 < scale) { scale = scale2 }
      this.sprite.scale.set(scale)

    } else {
      this.sprite.visible = false
      if (this.onDone) {
        this.onDone()
        this.onDone = null
      }
    }



  }


}