import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as soundsGeneric from 'engine/sounds/soundGeneric'
import * as pubSub from 'engine/common/pubSub'

let soundTest = false
const musicDir = '/public/shelter/music/'

import * as log from 'engine/log'

export function load(sge: SimpleGameEngine) {
  soundsGeneric.load(sge.getJson('audioSprite'), () => {
    playLoaded()

    if (soundTest) {
      setInterval(() => {
        playLoaded()
      }, 500)
    }
  })
  // playMusic1()
}

export function playMusic1() {
  soundsGeneric.playMusic(musicDir + 'theme1')
}
export function playMusicMenu() {
  soundsGeneric.playMusic(musicDir + 'menu1')
}
export function playMusicDie() {
  soundsGeneric.playMusic(musicDir + 'dead1', false, () => {
    soundsGeneric.playMusic(musicDir + 'theme1')
  })
}
export function playMusicDungeon() {
  soundsGeneric.playMusic(musicDir + 'dungeon1')
}
export function playMusicBoss() {
  soundsGeneric.playMusic(musicDir + 'boss1')
}
export function playMusicWin() {
  soundsGeneric.playMusic(musicDir + 'winner1', false, () => {
    soundsGeneric.playMusic(musicDir + 'theme1')
  })
}

export function playLoaded() {
  // soundsGeneric.play('pickup001')
  soundsGeneric.play('smash001')
}
export function playJump() {
  // soundsGeneric.play('pickup001')
  soundsGeneric.play('jump001')
}
export function playMetal() {
  // soundsGeneric.play('pickup001')
  soundsGeneric.play('invinc001')
}

export function playPickup() {
  let pickup = ['pickup002', 'pickup003'] // pickup001
  soundsGeneric.play(_.sample(pickup))
}

export function playExplode() {
  log.x('play explode')
  soundsGeneric.play('hurt001')
}

export function playSmash() {
  soundsGeneric.play('smash001')
}
export function playThrowHat() {
  soundsGeneric.play('hatthrow001')
}

// Links to other systems
pubSub.on('gui:click-button', () => {
  playExplode()
})

pubSub.on('gui:toggle-music', () => {
  playMusic1()
})
