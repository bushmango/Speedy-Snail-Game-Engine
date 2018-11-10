import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'

import { MenuInputControl } from 'engine/input/MenuInputControl'
import { MenuGeneric } from 'engine/menus/MenuGeneric'

export class MenuAbout {
  sge: SimpleGameEngine
  container: PIXI.Container

  menu: MenuGeneric = new MenuGeneric()

  modeName = 'about'

  init(sge: SimpleGameEngine) {
    this.sge = sge
    this.container = new PIXI.Container()

    this.menu.init(sge, this.container, 'About')

    this.menu.addButtonSimple('Back').onClick = () => {
      this.menu.changeModeTo('title')
    }

    this.update(null)
  }

  update(menuInput: MenuInputControl) {
    this.menu.update(menuInput)
  }
}
