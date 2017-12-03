import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as spriteCreator from 'ludumDare40/util/spriteCreator'
import { KeyCodes } from 'engine/input/Keyboard';

const turn = Math.PI * 2

import { hats } from './hats'
import { HatStack } from 'ludumDare40/entities/HatStack';
import { LudumDare40Context } from 'ludumDare40/LudumDare40Context';
import { Bounds, PlayerController } from 'ludumDare40/entities/Bounds';

export class Player {

  context: LudumDare40Context
  container = new PIXI.Container()

  body: PIXI.Sprite
  head: PIXI.Sprite

  hats = new HatStack()

  bounds = new Bounds()
  controller = new PlayerController()


  init(cx: LudumDare40Context) {
    this.context = cx

    this.body = spriteCreator.create16_sprite(this.context.sge, 'ase-512-16', 1, 1)
    this.body.anchor.set(0.5, 1)
    this.head = spriteCreator.create16_sprite(this.context.sge, 'ase-512-16', 1, 2)
    this.head.anchor.set(0.5, 1)

    this.hats.init(this.context.sge)

    this.container.addChild(this.body)
    this.container.addChild(this.head)
    this.container.addChild(this.hats.container)

  }

  moveTo(x, y) {
    this.bounds.moveTo(x, y)
  }


  update() {

    // controls
    this.bounds.width = 8
    this.bounds.height = 16
    this.controller.update(this.context.sge.keyboard, this.bounds)
    this.bounds.update(this.context)

    this.container.position.set(this.bounds.x, this.bounds.y)

    this.body.position.set(0, 0)
    this.head.position.set(0, 0 - 16)

    this.head.scale.set(this.bounds.facingRight ? 1 : -1, 1)

    this.hats.x = 0
    this.hats.y = -16 - 8
    this.hats.facingRight = this.bounds.facingRight
    this.hats.update()

  }


}
