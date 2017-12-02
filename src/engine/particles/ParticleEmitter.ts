
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { _ } from 'engine/importsEngine'

export interface IParticle {
  sprite: PIXI.Sprite
  vx: number
  vy: number
  vr: number
  framesStart: number
  framesLeft: number
  alpha1: number
  alpha2: number
  scale1: number
  scale2: number
}

export class ParticleEmitter {

  maxParticles = 200
  sge: SimpleGameEngine
  particles: IParticle[] = []
  textureKey: string
  textureRects: any[]
  container: PIXI.Container

  init(sge: SimpleGameEngine, textureKey: string, rects: Array<Array<number>>) {
    this.sge = sge
    this.textureKey = textureKey
    this.container = new PIXI.Container()

    this.textureRects = _.map(rects, (c) => new PIXI.Rectangle(c[0], c[1], c[2], c[3]))

  }

  getNextSprite() {
    // Get first unused sprite
    for (let i = 0; i < this.particles.length; i++) {
      let p: IParticle = this.particles[i]
      if (!p.sprite.visible) {
        return p
      }
    }
    if (this.particles.length < this.maxParticles) {
      let texture = this.sge.getTexture(this.textureKey)
      let sprite = new PIXI.Sprite(new PIXI.Texture(texture.baseTexture))
      sprite.texture.frame = this.textureRects[0]
      this.container.addChild(sprite)
      let p: IParticle = {
        sprite: sprite,
        vx: 0,
        vy: 0,
        vr: 0,
        alpha1: 1,
        alpha2: 0,
        scale1: 2,
        scale2: 1,
        framesStart: 100,
        framesLeft: 100,
      }
      this.particles.push(p)
      return p
    }
    return null // No more to add! // TODO: kill oldest?
  }

  update() {
    for (let i = 0; i < this.particles.length; i++) {
      let p: IParticle = this.particles[i]
      if (!p.sprite.visible) { continue }

      p.sprite.x += p.vx
      p.sprite.y += p.vy
      p.sprite.rotation += p.vr
      p.framesLeft--

      let t = 1 - (p.framesLeft / p.framesStart)
      p.sprite.alpha = (1 - t) * p.alpha1 + t * p.alpha2
      p.sprite.scale.set((1 - t) * p.scale1 + t * p.scale2)

      if (p.framesLeft <= 0) {
        p.sprite.visible = false
      }
    }
  }

  emit(x, y, options?: {
    numMin?: number,
    numMax?: number,
    vMax?: number,
    rMin?: number,
    rMax?: number,
    framesMin?: number,
    framesMax?: number,
    rects?: PIXI.Rectangle[],
  }) {

    let num = 1
    let vMax = options.vMax
    let rMin = 0
    let rMax = 0
    let framesMin = 60
    let framesMax = 60
    if (options) {
      num = _.random((options.numMin || 1), (options.numMax || 1) + 1, false)
      if (options.rMin) {
        rMin = options.rMin
      }
      if (options.rMax) {
        rMax = options.rMax
      }
      framesMin = options.framesMin || framesMin
      framesMax = options.framesMax || framesMax
    }
    for (let i = 0; i < num; i++) {
      let p = this.getNextSprite()
      if (!p) { break } // Out of sprites

      if(options && options.rects) {
        p.sprite.texture.frame = _.sample(options.rects)
        
      } else {
        p.sprite.texture.frame = _.sample(this.textureRects)        
      }
     
      p.sprite.visible = true
      p.sprite.position.x = x
      p.sprite.position.y = y

      p.vx = _.random(-vMax, vMax, true)
      p.vy = _.random(-vMax, vMax, true)
      p.vr = _.random(rMin, rMax, false)

      p.alpha1 = 1
      p.alpha2 = 0

      p.scale1 = 2
      p.scale2 = 0.25

      p.framesStart = p.framesLeft = _.random(framesMin, framesMax, false)
    }

  }
}