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

    this.menu.addButtonSimple('Made in 72 hours').onClick = () => {

    }
    this.menu.addButtonSimple('For Ludum Dare 40 (ldjam.com)').onClick = () => {

    }
    this.menu.addOptionSimple('Art / programming / design / levelsdw', 'stevie',
      [
        { label: 'Stevie B.', value: 'Stevie B.' },
      ]
    )
    this.menu.addOptionSimple('Design / testing / levels', 'brenden', [
      { label: 'Brenden B.', value: 'Brenden B.' },
    ]
    )
    this.menu.addOptionSimple('Music / Sfx / Design', 'casey', [
      { label: 'Casey B.', value: 'Casey B.' },
    ]
    )

    this.update(null)
  }

  update(menuInput: MenuInputControl) {
    this.menu.update(menuInput)
  }



}