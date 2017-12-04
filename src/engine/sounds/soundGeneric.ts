
import * as howler from 'howler'

let devMute = false

import * as settingsGeneric from 'engine/misc/settingsGeneric'

let soundSprite = null
let musicSprite = null
export function load(jsonAudioSprite, callbackOnLoaded) {
  soundSprite = new howler.Howl({
    src: jsonAudioSprite.urls,
    sprite: jsonAudioSprite.sprite,
  })
  soundSprite.once('load', () => {
    callbackOnLoaded()
  })
  soundSprite.on('loaderror', (id, err) => {
    console.log('howl', 'loaderror', id, err)
  })

  soundSprite.mute(settingsGeneric.getSettings().muteSound)
}

export function playMusic(song, loop = true, cb: () => void = null) {
  if (musicSprite) {
    musicSprite.stop()
    musicSprite = null
  }
  musicSprite = new howler.Howl({
    src: [song + '.ogg', song + 'mp3'],
    autoplay: true,
    loop: loop,
    volume: 0.75,
  })

  if (settingsGeneric.getSettings().muteMusic) {
    musicSprite.mute(true)
  }
  //musicSprite.once('load', () => {
  //musicSprite.play()
  //})
  musicSprite.on('loaderror', (id, err) => {
    console.log('howl', 'loaderror', id, err)
  })
  if (cb) {
    musicSprite.on('end', () => {
      cb()
    })
  }
}

export function play(soundKey) {
  if (!devMute && !settingsGeneric.getSettings().muteSound) {
    soundSprite.play(soundKey)
  }

}

