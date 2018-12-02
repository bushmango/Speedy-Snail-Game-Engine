import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as soundsGeneric from 'engine/sounds/soundGeneric'
import * as pubSub from 'engine/common/pubSub'

let doPlayLoaded = false
let soundTest = false
const musicDir = '/public/ludumDare43/music/'

import * as log from 'engine/log'

export function load(sge: SimpleGameEngine) {
  soundsGeneric.load(sge.getJson('audioSprite'), () => {
    if (doPlayLoaded) {
      playLoaded()
    }

    if (soundTest) {
      setInterval(() => {
        playLoaded()
      }, 500)
    }
  })
  playMusic1()
}

// TODO: replace all of these

export function playMusic1() {
  // need new!
  soundsGeneric.playMusic(musicDir + 'dungeon1')
}
export function playMusicMenu() {
  // need new!
  soundsGeneric.playMusic(musicDir + 'menu1')
}
export function playMusicDie() {
  // need new!
  soundsGeneric.playMusic(musicDir + 'dead1', false, () => {
    soundsGeneric.playMusic(musicDir + 'theme1')
  })
}
export function playMusicDungeon() {
  // need new!
  soundsGeneric.playMusic(musicDir + 'dungeon1')
}
export function playMusicBoss() {
  // need new!
  soundsGeneric.playMusic(musicDir + 'boss1')
}
export function playMusicWin() {
  // need new!
  soundsGeneric.playMusic(musicDir + 'winner1', false, () => {
    soundsGeneric.playMusic(musicDir + 'theme1')
  })
}

export function playLoaded() {
  // need new!
  // soundsGeneric.play('pickup001')
  soundsGeneric.play('smash001')
}
// export function playJump() {
//   // need new!
//   // soundsGeneric.play('pickup001')
//   soundsGeneric.play('jump001')
// }
// export function playMetal() {
//   // need new!
//   // soundsGeneric.play('pickup001')
//   soundsGeneric.play('invinc001')
// }

// export function playPickup() {
//   // need new!
//   let pickup = ['pickup002', 'pickup003'] // pickup001
//   soundsGeneric.play(_.sample(pickup))
// }

// export function playExplode() {
//   // need new!
//   log.x('play explode')
//   soundsGeneric.play('hurt001')
// }

export function playGoatFloating() {
  return soundsGeneric.play('goat001')
}

const slowdownCause = []
let slowdownInit = false

export function playSlowdown(cause) {
  const id = 'slowdown001',
        sprite = soundsGeneric.getSoundSprite()

  // XXX: There has to be a better way
  if (!slowdownInit) {
    slowdownInit = true
    sprite.on('end', () => {
      slowdownCause.shift()
    }, id)
  }

  if (slowdownCause.includes(cause)) {
    return
  }

  slowdownCause.push(cause)
  soundsGeneric.play(id)
}

export function stopSlowdown() {
  const sprite = soundsGeneric.getSoundSprite()

  sprite.stop('slowdown001')
}

export function playPartDestroyed() {
  // need new!
  soundsGeneric.play('smash001')
}

export function playPartConnected() {
  // need new!
  soundsGeneric.play('hurt001')
}

export function playClick() {
  // need new!
  soundsGeneric.play('hurt001')
}

// export function playSmash() {
//   // need new!
//   soundsGeneric.play('smash001')
// }
// export function playThrowHat() {
//   // need new!
//   soundsGeneric.play('hatthrow001')
// }

// Links to other systems
pubSub.on('gui:click-button', () => {
  playClick()
})
