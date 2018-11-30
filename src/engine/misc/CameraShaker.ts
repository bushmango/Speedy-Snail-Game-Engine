import { _ } from 'engine/importsEngine'

export class CameraShaker {
  shakeFramesLeft = 0
  shakeAmount = 0

  addShake(frames, shakeAmount) {
    if (this.shakeAmount < shakeAmount) {
      this.shakeAmount = shakeAmount
    }

    if (this.shakeFramesLeft < frames) {
      this.shakeFramesLeft = frames
    }
  }

  update(container: PIXI.Container) {
    if (this.shakeFramesLeft <= 0) {
      return
    }

    this.shakeFramesLeft--
    if (this.shakeFramesLeft <= 0) {
      this.shakeFramesLeft = 0

      container.x = 0
      container.y = 0

      return
    } else {
      container.x = _.random(-this.shakeAmount / 2, this.shakeAmount / 2)
      container.y = _.random(-this.shakeAmount / 2, this.shakeAmount / 2)
    }
  }
}
