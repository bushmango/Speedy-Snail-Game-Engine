import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'

import { MenuInputControl } from 'engine/input/MenuInputControl'
import { MenuGeneric } from 'engine/menus/MenuGeneric'

import * as pubSub from 'engine/common/pubSub'

export class MenuGame {

  sge: SimpleGameEngine
  container: PIXI.Container

  modeName = 'game'

  init(sge: SimpleGameEngine) {

    this.sge = sge
    this.container = new PIXI.Container()

    this.update(null)
  }

  update(menuInput: MenuInputControl) {
   
  }

}