import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as sounds from 'ludumDare40/sounds/ldSounds'
import { MenuInputControl } from 'engine/input/MenuInputControl'
import { MenuGeneric } from 'engine/menus/MenuGeneric'
import { create16_sprite } from 'ludumDare40/util/spriteCreator'

export class MenuTitle {
  sge: SimpleGameEngine
  container: PIXI.Container

  sprite: PIXI.Sprite

  menu: MenuGeneric = new MenuGeneric()

  modeName = 'title'

  init(sge: SimpleGameEngine) {
    this.sge = sge
    this.container = new PIXI.Container()

    this.menu.init(sge, this.container, 'Hatformer! (ludum dare 40)')

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

    this.sprite = create16_sprite(this.sge, 'ase-512-16', 2, 1)
    this.sprite.scale.set(8)
    this.sprite.anchor.set(0.5, 11 / 16)
    this.sprite.position.set(65, 60)
    this.container.addChild(this.sprite)
    this.sprite.rotation = Math.PI * 2 * -0.08

    this.update(null)
  }

  update(menuInput: MenuInputControl) {
    this.menu.update(menuInput)
  }
}
