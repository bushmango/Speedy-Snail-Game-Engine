// import { Ship } from './Ship'
import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { ParticleEmitter } from 'engine/particles/ParticleEmitter'
import * as spriteCreator from 'ludumDare40/util/spriteCreator'
import * as assert from 'engine/common/assert'

export function splitSpriteIntoParticles(y, x, num) {

  let particles = []

  let size = 8 / num
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      particles.push([
        x * 8 + i * size,
        y * 8 + j * size,
        size,
        size,
      ])
    }
  }
  return particles

}

export function splitFrameIntoParticles(rect: PIXI.Rectangle, num) {
  let particles = [] as PIXI.Rectangle[]

  let blockSize = 16

  let size = blockSize / num
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      particles.push(new PIXI.Rectangle(
        rect.x + i * size,
        rect.y + j * size,
        size,
        size,
      ))
    }
  }
  return particles
}

export class ParticleManager {

  sge: SimpleGameEngine
  container: PIXI.Container
  particleEmitterBlob: ParticleEmitter

  emitters: ParticleEmitter[] = []

  init(sge: SimpleGameEngine) {
    this.sge = sge
    this.container = new PIXI.Container()

    //let particlesShip = splitSpriteIntoParticles(26, 9, 4)

    this.particleEmitterBlob = this.addEmitter()

  }

  addEmitter(frames = [[0, 0, 8, 8]]) {
    let emitter = new ParticleEmitter()
    emitter.init(this.sge, 'ase-512-16', frames)
    this.container.addChild(emitter.container)
    this.emitters.push(emitter)
    return emitter
  }


  emitBlobParts(frame: PIXI.Rectangle, x, y) {
    // Split frameRect
    let particles = splitFrameIntoParticles(frame, 4)

    this.particleEmitterBlob.emit(
      x,
      y,
      {
        numMin: 1,
        numMax: 5,
        vMax: 20 / 60,
        rMin: -Math.PI * 2 / 60,
        rMax: Math.PI * 2 / 60,
        framesMin: 30,
        framesMax: 120,
        rects: particles,
      }
    )
  }

  update() {

    _.forEach(this.emitters, (c) => {
      c.update()
    })

  }

}
