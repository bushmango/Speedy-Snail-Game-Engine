import * as howler from 'howler'
import * as log from 'engine/log'
let devMute = false

import * as pubSub from 'engine/common/pubSub'

import * as settingsGeneric from 'engine/misc/settingsGeneric'

const muteState = {
  music: false,
  sound: false,
}

let soundSprite = null
let musicSprite = null

export function getMusicSprite() {
  return musicSprite
}

export function getSoundSprite() {
  return soundSprite
}

export function load(jsonAudioSprite, callbackOnLoaded) {
  soundSprite = new howler.Howl({
    src: jsonAudioSprite.urls,
    sprite: jsonAudioSprite.sprite,
  })
  soundSprite.once('load', () => {
    callbackOnLoaded()
  })
  soundSprite.on('loaderror', (id, err) => {
    // console.log('howl', 'loaderror', id, err)
  })
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
    volume: 0.5,
    mute: muteState.music,
  })

  //musicSprite.once('load', () => {
  //musicSprite.play()
  //})
  musicSprite.on('loaderror', (id, err) => {
    // console.log('howl', 'loaderror', id, err)
  })
  if (cb) {
    musicSprite.on('end', () => {
      cb()
    })
  }
}

export function play(soundKey) {
  if (devMute || muteState.sound) {
    return
  }

  log.x('play', soundKey)
  return soundSprite.play(soundKey)
}

export function stop(soundKey) {
  soundSprite.stop(soundKey)
}

export function stopAllSounds() {
  if (soundSprite) {
    soundSprite.stop()
  }
}

function updateMusicMute() {
  if (!musicSprite) {
    return
  }

  musicSprite.mute(muteState.music)
}

pubSub.on('settings:update', (settings) => {
  if (settings.muteMusic != muteState.music) {
    muteState.music = settings.muteMusic
    updateMusicMute()
  }

  if (settings.muteSound != muteState.sound) {
    muteState.sound = settings.muteSound

    if (muteState.sound) {
      stopAllSounds()
    }
  }
})
