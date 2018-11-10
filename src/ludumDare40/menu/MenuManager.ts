import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { MenuManagerGeneric } from 'engine/menus/MenuManagerGeneric'

import { MenuTitle } from './MenuTitle'
import { MenuAbout } from './MenuAbout'
import { MenuGame } from './MenuGame'
import { MenuSoundOptions } from './MenuSoundOptions'

import { KeyCodes } from 'engine/input/Keyboard'

import * as ldSounds from 'ludumDare40/sounds/ldSounds'
import * as spriteCreator from 'ludumDare40/util/spriteCreator'

export class MenuManager {
  sge: SimpleGameEngine

  container: PIXI.Container

  menuManager: MenuManagerGeneric

  currentItemIndicator: PIXI.Sprite

  menuTitle: MenuTitle
  menuAbout: MenuAbout
  menuGame: MenuGame
  menuSoundOptions: MenuSoundOptions
  currentMenu = null
  menus: any[] = []

  init(sge: SimpleGameEngine) {
    this.sge = sge

    this.container = new PIXI.Container()
    this.container.visible = false

    this.menuManager = new MenuManagerGeneric()
    this.menuManager.init(sge, 'ludum-dare-settings-v001')

    this.menuTitle = this.addMenu(new MenuTitle())
    this.menuAbout = this.addMenu(new MenuAbout())
    this.menuGame = this.addMenu(new MenuGame())
    this.menuSoundOptions = this.addMenu(new MenuSoundOptions())

    this.currentItemIndicator = spriteCreator.create16_sprite(
      sge,
      'ase-512-16',
      2,
      2
    )
    this.currentItemIndicator.anchor.set(0.5, 9 / 16)
    this.currentItemIndicator.scale.set(4)
    this.container.addChild(this.currentItemIndicator)

    this.menuManager.loadSettings()

    // this.sge.keyboard.listenFor(KeyCodes.escape)
  }

  addMenu(menu) {
    menu.init(this.sge)
    this.menuManager.addMenu(menu)
    return menu
  }

  getMode() {
    return this.menuManager.getMode()
  }

  update() {
    if (this.sge.keyboard.justPressed(KeyCodes.escape)) {
      this.menuManager.changeMode('title')
      ldSounds.playMusicMenu()
    }

    this.menuManager.update()

    this.container.visible = this.menuManager.getMode() !== 'game'
    this.currentItemIndicator.visible = true // this.menuManager.getMode() !== 'game'
    this.currentItemIndicator.x = this.menuManager.currentItemX
    this.currentItemIndicator.y = this.menuManager.currentItemY
  }
}
