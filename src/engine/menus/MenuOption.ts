import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { _ } from 'engine/importsEngine'

import { MenuButton } from './MenuButton'

export class MenuOption {
  sge: SimpleGameEngine
  container: PIXI.Container

  text: PIXI.extras.BitmapText

  button: MenuButton
  isActive: boolean = false

  intiialText
  options
  getSettingFunc
  setSettingFunc
  settingKey

  init(
    sge: SimpleGameEngine,
    text,
    options,
    getSettingFunc,
    setSettingFunc,
    settingKey
  ) {
    this.sge = sge
    this.container = new PIXI.Container()

    this.options = options
    this.getSettingFunc = getSettingFunc
    this.setSettingFunc = setSettingFunc
    this.settingKey = settingKey

    this.button = new MenuButton()
    this.button.init(sge, text)
    this.intiialText = text
    this.container.addChild(this.button.container)

    this.button.onClick = () => {
      console.log('change option', settingKey)
      let setting = this.getSettingFunc(this.settingKey)

      let idx = _.findIndex(this.options, (c, cIdx) => c === setting) + 1
      if (idx >= this.options.length) {
        idx = 0
      }

      this.setSettingFunc(this.settingKey, this.options[idx])
    }
  }

  doClick() {
    this.button.doClick()
  }

  setActive(isActive) {
    this.isActive = isActive
  }

  update(x, y) {
    this.button.text.text =
      this.intiialText + ': ' + this.getSettingFunc(this.settingKey)

    this.button.setActive(this.isActive)
    this.button.update(x, y)
  }
}
