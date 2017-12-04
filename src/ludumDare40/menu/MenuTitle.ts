import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as sounds from 'ludumDare40/sounds/ldSounds'
import { MenuInputControl } from 'engine/input/MenuInputControl'
import { MenuGeneric } from 'engine/menus/MenuGeneric'

export class MenuTitle {

  sge: SimpleGameEngine
  container: PIXI.Container

  menu: MenuGeneric = new MenuGeneric()
  
  modeName = 'title'

  init(sge: SimpleGameEngine) {

    this.sge = sge
    this.container = new PIXI.Container()

    this.menu.init(sge, this.container, 'Ludum Dare 40 Menu')

    sounds.playMusicMenu()

    this.menu.addButtonSimple('Start Game').onClick = () => {
      this.menu.changeModeTo('game')
      sounds.playMusic1()
    }

    this.menu.addButtonSimple('Sound Options').onClick = () => {
      this.menu.changeModeTo('sound-options')
    }

    this.menu.addButtonSimple('About').onClick = () => {
      this.menu.changeModeTo('about')
    }

    this.update(null)
  }

  update(menuInput: MenuInputControl) {
    this.menu.update(menuInput)
  }



}