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
  soundsGeneric.playMusic(musicDir + 'loop')
}
export function playMusicMenu() {
  // need new!
  soundsGeneric.playMusic(musicDir + 'loop')
}
export function playMusicDie() {
  // need new!
  // soundsGeneric.playMusic(musicDir + 'dead1', false, () => {
  //   soundsGeneric.playMusic(musicDir + 'theme1')
  // })
}

export function playMusicBoss() {
  // need new!
  //soundsGeneric.playMusic(musicDir + 'boss1')
}
export function playMusicWin() {
  // need new!
  // soundsGeneric.playMusic(musicDir + 'winner1', false, () => {
  //   soundsGeneric.playMusic(musicDir + 'theme1')
  // })
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

let goatId = null
export function playGoatFloating() {
  goatId = soundsGeneric.play('goat001')
  return goatId
}
export function stopGoatFloating() {
  if (goatId) {
    soundsGeneric.stop(goatId)
    goatId = null
  }
}

// const slowdownCause = []
// let slowdownInit = false
// let slowdownSprite = null
let slowdownId = null
export function playSlowdown() {
  stopSlowdown
  slowdownId = soundsGeneric.play('slowdown001')
  return slowdownId
}
export function stopSlowdown() {
  if (slowdownId) {
    soundsGeneric.stop(slowdownId)
    // Possibly fade out volue
    slowdownId = null
  }
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
