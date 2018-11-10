import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'

import { MenuInputControl } from 'engine/input/MenuInputControl'
import { MenuGeneric } from 'engine/menus/MenuGeneric'

import * as pubSub from 'engine/common/pubSub'

export class MenuSoundOptions {
  sge: SimpleGameEngine
  container: PIXI.Container

  menu: MenuGeneric = new MenuGeneric()

  modeName = 'sound-options'

  init(sge: SimpleGameEngine) {
    this.sge = sge
    this.container = new PIXI.Container()

    this.menu.init(sge, this.container, 'Sound Options')

    this.menu.addOptionSimple(
      'Sounds',
      'muteSound',
      [{ label: 'on', value: false }, { label: 'off', value: true }]
    ).onClick = () => {
      pubSub.emit('gui:toggle-sounds')
    }

    this.menu.addOptionSimple(
      'Music',
      'muteMusic',
      [{ label: 'on', value: false }, { label: 'off', value: true }]
    ).onClick = () => {
      pubSub.emit('gui:toggle-music')
    }

    this.menu.addButtonSimple('Back').onClick = () => {
      this.menu.changeModeTo('title')
    }

    this.update(null)
  }

  update(menuInput: MenuInputControl) {
    this.menu.update(menuInput)
  }
}
