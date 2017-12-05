import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare40/util/spriteCreator'
import { KeyCodes } from 'engine/input/Keyboard';

const turn = Math.PI * 2

import { hats } from './hats'
import { HatStack } from 'ludumDare40/entities/HatStack';
import { LudumDare40Context } from 'ludumDare40/LudumDare40Context';
import { Bounds } from 'ludumDare40/entities/Bounds';
import { PlayerController } from 'ludumDare40/entities/PlayerController';

import * as sounds from 'ludumDare40/sounds/ldSounds'

let headDead = spriteCreator.create16_frame(0, 6)
let headGood = spriteCreator.create16_frame(1, 2)

let frameFall = spriteCreator.create16_frame(1, 0)
let frameNormal = spriteCreator.create16_frame(1, 1)
let frameJump = spriteCreator.create16_frame(2, 0)


export class Player {

  context: LudumDare40Context
  container = new PIXI.Container()

  body: PIXI.Sprite
  head: PIXI.Sprite

  isDying = false
  dyingFrames = 0

  hats = new HatStack()

  bounds = new Bounds()
  controller = new PlayerController()

  pastPositions = []
  followers: PIXI.Sprite[] = []

  init(cx: LudumDare40Context) {
    this.context = cx

    this.body = spriteCreator.create16_sprite(this.context.sge, 'ase-512-16', 1, 1)
    this.body.anchor.set(0.5, 1)
    this.head = spriteCreator.create16_sprite(this.context.sge, 'ase-512-16', 1, 2)
    this.head.anchor.set(0.5, 1)

    this.bounds.airDrag = 0
    this.bounds.groundDrag = 0

    this.hats.init(this.context.sge)

    this.container.addChild(this.body)
    this.container.addChild(this.head)
    this.container.addChild(this.hats.container)

    for (let i = 0; i < 1; i++) {
      this.addFollower()
    }
    // for (let i = 0; i < 20; i++) {
    //   this.hats.addHat()
    // }

  }

  reset() {
    this.bounds.reset()
    this.hats.clear()
    this.pastPositions = []
    this.isDying = false
  }

  moveTo(x, y) {
    this.bounds.moveTo(x, y)
  }

  addFollower() {

    // let x = _.random(3, 5, false)

    let entries = [3, 5]
    let x = _.sample(entries)

    let item = spriteCreator.create16_sprite(this.context.sge, 'ase-512-16', 1, x)
    item.anchor.set(0.5, 1)

    this.followers.push(item)
    this.container.addChild(item)
  }
  clearFollowers() {
    _.forEach(this.followers, (c) => {
      this.container.removeChild(c)
    })
    this.followers = []
    this.addFollower()
  }

  die() {
    if (!this.isDying) {

      this.context.achievements.addAchievement('You died!')
      sounds.playMusicDie()

      this.isDying = true
      this.dyingFrames = 0
      this.bounds.reset()
      this.bounds.isGhost = true
      this.bounds.jump()

    }
  }

  update() {


    // controls
    this.bounds.width = 8
    this.bounds.height = 14
    //if (!this.isDying) {
    if (this.context.menuManager.getMode() === 'game') {
      this.controller.update(this.context.sge.keyboard, this.bounds, this.isDying)
    }
    //}
    this.bounds.update(this.context)


    this.pastPositions.unshift([this.bounds.x, this.bounds.y, this.bounds.facingRight])
    if (this.pastPositions.length > 300) {
      this.pastPositions.pop()
    }
    for (let idxFollower = 0; idxFollower < this.followers.length; idxFollower++) {
      let f = this.followers[idxFollower]
      let adj = idxFollower * 5 + 5
      if (this.pastPositions.length > adj) {
        let pp = this.pastPositions[adj]
        f.position.set(pp[0] - this.bounds.x, pp[1] - this.bounds.y)
        f.scale.x = pp[2] ? 1 : -1
      } else {
        f.position.set(0, 0)
      }

    }

    // Attack with hats!
    let kb = this.context.sge.keyboard
    if (kb.justPressed(KeyCodes.space)) {

      if (this.hats.hats.length > 0) {
        this.context.sounds.playThrowHat()
        let protoHat = this.hats.removeBottomHat()

        this.context.achievements.addAchievement('Hats off to you!')

        console.log('throw a hat!')

        let hat = this.context.hats.createAt(this.bounds.x, this.bounds.y - 16 - 8)
        hat.body.texture.frame = protoHat.texture.frame
        hat.bounds.maxVy = 16
        let speed = 1000
        if (!this.bounds.facingRight) {
          speed = -speed
        }
        hat.bounds.vx = speed

      }



    }

    this.container.position.set(this.bounds.x, this.bounds.y)

    this.body.position.set(0, 0)

    if (this.bounds.isFalling) {
      this.body.texture.frame = frameFall
    } else {
      if (this.bounds.isJumping) {
        this.body.texture.frame = frameJump
      } else {
        this.body.texture.frame = frameNormal
      }

    }

    this.head.position.set(0, 0 - 16)

    this.head.scale.x = this.bounds.facingRight ? 1 : -1

    if (this.bounds.isTouchingFatal) {
      if (!this.isDying) {
        this.die()
      }
    }
    if (this.isDying) {
      this.dyingFrames++
    }

    this.head.texture.frame = this.isDying ? headDead : headGood

    this.hats.x = 0
    this.hats.y = -16 - 8
    this.hats.facingRight = this.bounds.facingRight
    this.hats.update()

  }


}
