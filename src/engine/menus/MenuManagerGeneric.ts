import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'

import * as pubSub from 'engine/common/pubSub'

import { MenuInputControl } from 'engine/input/MenuInputControl'
let menuInputControl = new MenuInputControl()

import * as settingsGeneric from 'engine/misc/settingsGeneric'

export class MenuManagerGeneric {

  sge: SimpleGameEngine
  container: PIXI.Container

  currentMenu = null
  menus: any[] = []

  currentItemX = 0
  currentItemY = 0


  init(sge: SimpleGameEngine, savedSettingsKey: string) {
    this.sge = sge

    this.container = new PIXI.Container()
    menuInputControl.init(sge)
  }

  addMenu(menu) {
    this.menus.push(menu)
  }

  loadSettings() {
    this.changeMode(settingsGeneric.getSettings().menuMode)
    this.update()

    pubSub.on('menu:change-mode', (data) => {
      this.changeMode(data.menuMode)
    })
  }

  getMode() {
    return settingsGeneric.getSettings().menuMode
  }

  changeMode(newMode) {

    console.log('new menu mode', newMode)

    this.container.removeChildren()

    settingsGeneric.updateSettings({ menuMode: newMode })

    this.currentMenu = _.find(this.menus, (c) => c.modeName === newMode) || this.menus[0]

    console.log('mode found', this.currentMenu.modeName, this.menus)

    this.container.addChild(this.currentMenu.container)

  }

  update() {

    menuInputControl.update()
    this.currentMenu.update(menuInputControl)

    if (this.currentMenu.menu) {
      this.currentItemX = (this.currentMenu.menu.currentItemX || 1) - 20
      this.currentItemY = (this.currentMenu.menu.currentItemY || 1) + 25
    }
  }

}

