import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { _ } from 'engine/importsEngine'

import { MenuButtonSimple } from './MenuButtonSimple'

import * as settingsGeneric from 'engine/misc/settingsGeneric'

export interface IOption {
  label?: string
  value: any
}

export class MenuOptionSimple {
  sge: SimpleGameEngine
  container: PIXI.Container

  text: PIXI.extras.BitmapText

  button: MenuButtonSimple
  isActive: boolean = false

  intiialText: string
  options: IOption[]
  settingKey: string

  onClick: () => void
  onOver: (btn: MenuOptionSimple) => any

  init(sge: SimpleGameEngine, text, settingKey: string, options: IOption[]) {
    this.sge = sge
    this.container = new PIXI.Container()

    this.options = options
    this.settingKey = settingKey

    this.button = new MenuButtonSimple()
    this.button.init(sge, text)
    this.intiialText = text
    this.container.addChild(this.button.container)

    this.container.buttonMode = true
    this.container.interactive = true
    this.container.on('mouseover', () => {
      if (this.onOver) {
        this.onOver(this)
      }
    })
    // this.container.on('mouseover', () => {
    //   if (this.state > 0 && this.onOver) {
    //     this.onOver(this)
    //   }
    // })

    this.button.onClick = () => {
      console.log('change option', settingKey)

      let setting = settingsGeneric.getSettings()[this.settingKey]

      let idx = _.findIndex(this.options, (c, cIdx) => c.value === setting) + 1
      if (idx >= this.options.length) {
        idx = 0
      }

      console.log('change option to', this.options[idx].value)

      // find the value of this option
      settingsGeneric.updateSettings({
        [this.settingKey]: this.options[idx].value,
      })

      if (this.onClick) {
        this.onClick()
      }
    }
  }

  findOption(options, val) {
    let option = _.find(options, (c) => c === val || c.value === val)
    return option
  }

  doClick() {
    this.button.doClick()
  }

  setActive(isActive) {
    this.isActive = isActive
  }

  update(x, y) {
    let optionsText = this.getOptionsText()
    this.button.text.text = this.intiialText + ':   ' + optionsText

    this.button.setActive(this.isActive)
    this.button.update(x, y)
  }

  getOptionsText() {
    let currentVal = settingsGeneric.getSettings()[this.settingKey]
    let text = ''

    _.forEach(this.options, (c) => {
      if (c.value === currentVal) {
        text += '[' + c.label + ']  '
      } else {
        text += ' ' + c.label + '   '
      }
    })

    return text
  }
}
