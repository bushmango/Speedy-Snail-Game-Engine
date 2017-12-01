import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { MenuManagerGeneric } from 'engine/menus/MenuManagerGeneric'

import { MenuTitle } from './MenuTitle'
import { MenuAbout } from './MenuAbout'
import { MenuGame } from './MenuGame'
import { MenuSoundOptions } from './MenuSoundOptions'

import { KeyCodes } from 'engine/input/Keyboard'

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

    let texture = this.sge.getTexture("test-tileset")
    let size = 32
    let rectangle = new PIXI.Rectangle(size * 3, size * 2, size, size)
    texture.frame = rectangle
    this.currentItemIndicator = new PIXI.Sprite(texture)
    this.currentItemIndicator.anchor.set(0.5, 0.5)

    this.container.addChild(this.currentItemIndicator)

    this.menuManager = new MenuManagerGeneric()
    this.menuManager.init(sge, 'ludum-dare-settings-v001')

    this.menuTitle = this.addMenu(new MenuTitle())
    this.menuAbout = this.addMenu(new MenuAbout())
    this.menuGame = this.addMenu(new MenuGame())
    this.menuSoundOptions = this.addMenu(new MenuSoundOptions())

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
    }

    this.menuManager.update()

    this.currentItemIndicator.visible = this.menuManager.getMode() !== 'game'
    this.currentItemIndicator.x = this.menuManager.currentItemX
    this.currentItemIndicator.y = this.menuManager.currentItemY


  }

}

