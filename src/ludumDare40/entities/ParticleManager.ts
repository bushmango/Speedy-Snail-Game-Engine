// import { Ship } from './Ship'
import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { ParticleEmitter } from 'engine/particles/ParticleEmitter'
import * as spriteCreator from 'ludumDare40/util/spriteCreator'
import * as assert from 'engine/common/assert'
import { create16_frameHRun } from 'ludumDare40/util/spriteCreator'

export function splitSpriteIntoParticles(y, x, num) {
  let particles = []

  let size = 8 / num
  for (let i = 0; i < num; i++) {
    for (let j = 0; j < num; j++) {
      particles.push([x * 8 + i * size, y * 8 + j * size, size, size])
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
      particles.push(
        new PIXI.Rectangle(rect.x + i * size, rect.y + j * size, size, size)
      )
    }
  }
  return particles
}

export class ParticleManager {
  sge: SimpleGameEngine
  container: PIXI.Container
  particleEmitterBlob: ParticleEmitter
  particleEmitterDecor: ParticleEmitter
  emitters: ParticleEmitter[] = []

  init(sge: SimpleGameEngine) {
    this.sge = sge
    this.container = new PIXI.Container()

    //let particlesShip = splitSpriteIntoParticles(26, 9, 4)

    this.particleEmitterBlob = this.addEmitter()
    this.particleEmitterDecor = this.addEmitter()
  }

  addEmitter(frames = [[0, 0, 8, 8]]) {
    let emitter = new ParticleEmitter()
    emitter.init(this.sge, 'ase-512-16', frames)
    this.container.addChild(emitter.container)
    this.emitters.push(emitter)
    return emitter
  }

  emitDecorParts(frame, x, y) {
    // Split frameRect
    let particles = splitFrameIntoParticles(frame, 4)
    //let blobGreenFrames = create16_frameHRun(4, 3, 2)
    this.particleEmitterBlob.emit(x, y, {
      numMin: 4,
      numMax: 8,
      vMax: 20 / 60,
      ay: 0.02,
      rMin: (-Math.PI * 2) / 60,
      rMax: (Math.PI * 2) / 60,
      framesMin: 60,
      framesMax: 180,
      rects: particles,
    })
  }
  emitBlobParts(x, y) {
    // Split frameRect
    //let particles = splitFrameIntoParticles(frame, 4)
    let blobGreenFrames = create16_frameHRun(4, 3, 2)
    this.particleEmitterBlob.emit(x, y, {
      numMin: 1,
      numMax: 5,
      vMax: 20 / 60,
      ay: 0.02,
      rMin: (-Math.PI * 2) / 60,
      rMax: (Math.PI * 2) / 60,
      framesMin: 30,
      framesMax: 120,
      rects: blobGreenFrames,
    })
  }

  update() {
    _.forEach(this.emitters, (c) => {
      c.update(1 / 60)
    })
  }
}
