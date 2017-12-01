import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'

import { MenuButton } from './MenuButton'
import { MenuButtonSimple } from './MenuButtonSimple'
import { MenuOption } from './MenuOption'
import { MenuOptionSimple } from './MenuOptionSimple'

import { MenuInputControl } from 'engine/input/MenuInputControl'

import * as pubSub from 'engine/common/pubSub'
import * as math from 'engine/common/math'

export class MenuGeneric {

  sge: SimpleGameEngine
  container: PIXI.Container

  textTitle: PIXI.extras.BitmapText

  menuButtons: any[] = []
  activeButtonIndex: number = 0

  currentItemX = 0
  currentItemY = 0

  init(sge: SimpleGameEngine, container, menuTitle) {

    this.sge = sge
    this.container = container

    this.textTitle = new PIXI.extras.BitmapText(`${menuTitle}`, { font: '48px defaultfont', align: 'left' })
    this.textTitle.anchor = new PIXI.Point(0, 0)
    this.container.addChild(this.textTitle)
  }

  changeModeTo(newMode: string) {
    this.activeButtonIndex = 0 // Reset
    pubSub.emit('menu:change-mode', { menuMode: newMode })
  }

  // addButton(text) {
  //   let button = new MenuButton()
  //   button.init(this.sge, text)
  //   this.menuButtons.push(button)
  //   this.container.addChild(button.container)
  //   return button
  // }

  addButtonSimple(text) {
    let button = new MenuButtonSimple()
    button.init(this.sge, text)

    button.onOver = (btn) => {
      this.activeButtonIndex = _.findIndex(this.menuButtons, (c) => c === btn)
    }

    this.menuButtons.push(button)
    this.container.addChild(button.container)
    return button
  }

  // addOption(text, options, getSettingFunc, setSettingFunc, settingKey) {
  //   let button = new MenuOption()
  //   button.init(this.sge, text, options, getSettingFunc, setSettingFunc, settingKey)
  //   this.menuButtons.push(button)
  //   this.container.addChild(button.container)
  //   return button
  // }

  addOptionSimple(text: string, settingKey: string, options) {
    let button = new MenuOptionSimple()
    button.init(this.sge, text, settingKey, options)
    this.menuButtons.push(button)
    this.container.addChild(button.container)
    return button
  }

  update(menuInput: MenuInputControl) {


    let numButtons = 0
    _.forEach(this.menuButtons, (menuButton, idx) => {
      if (menuButton.container.visible) {
        numButtons++
      }
    })
    this.activeButtonIndex = math.wrapRange(this.activeButtonIndex, 0, numButtons)

    this.textTitle.x = 50
    this.textTitle.y = 50

    let x = 50 + 50

    let y = 50 + 50 + 20

    if (menuInput) {
      let input = menuInput.input

      if (input.combinedOk.justPressed) {

      } else {
        // Move menu item
        let { dir, lastDir } = input
        if (dir !== lastDir) {
          if (dir === 2 || dir === 1) {
            this.activeButtonIndex++
          }
          if (dir === 3 || dir === 0) {
            this.activeButtonIndex--
          }
        }

        if (input.keyUp.justPressed) {
          this.activeButtonIndex--
        }
        if (input.keyDown.justPressed) {
          this.activeButtonIndex++
        }

      }

      let idxCount = -1
      _.forEach(this.menuButtons, (menuButton, idx) => {
        if (menuButton.container.visible) {
          idxCount++

          let isActive = idxCount === this.activeButtonIndex

          menuButton.setActive(isActive)

          if (idxCount === this.activeButtonIndex) {
            // Select menu item
            if (input.combinedOk.justPressed) {
              // Select menu item
              menuButton.doClick()
            }
          }

          menuButton.update(x - 100, y)

          if (isActive) {
            this.currentItemX = x
            this.currentItemY = y
          }

          y += 50 + 20



        } else {
          menuButton.setActive(false)
        }
      })


    }





  }
}
