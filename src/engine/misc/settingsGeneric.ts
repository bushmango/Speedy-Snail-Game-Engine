import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'

import * as Lockr from 'lockr'

interface IBasicSettings {
  menuMode: string
  muteMusic: boolean
  muteSound: boolean
}
let settings = {
  menuMode: 'title',
  muteMusic: false,
  muteSound: false,

  stevie: 'Stevie B.',
  casey: 'Casey B.',
  brenden: 'Brenden B.',
}

let loaded = false
let settingsKey = null

export function load(savedSettingsKey) {
  settingsKey = savedSettingsKey

  // console.log('loading settings', savedSettingsKey)

  try {
    let loadedSettings = Lockr.get(savedSettingsKey)
    if (loadedSettings) {
      let json = JSON.parse(loadedSettings)
      _.merge(settings, json)
    }
  } catch (err) {
    // console.error('Error loading menu settings')
  }

  return settings
}
export function save() {
  // console.log('saving settings', settingsKey, settings)
  Lockr.set(settingsKey, JSON.stringify(settings))
}

export function getSettings() {
  return settings
}

export function updateSettings(newSettings: Partial<IBasicSettings>) {
  _.merge(settings, newSettings)
  save()
}
