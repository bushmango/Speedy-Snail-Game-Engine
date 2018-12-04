import { _ } from 'engine/importsEngine'
import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { getContext } from '../GameContext'
import * as cameras from 'engine/camera/cameras'
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

let engineId,
  engineState = false

function initEngine() {
  engineId = soundsGeneric.playOn(soundsGeneric.getEngineSprite(), 'engine001')
  soundsGeneric
    .getEngineSprite()
    .loop(true, engineId)
    .once(
      'stop',
      () => {
        engineId = null
      },
      engineId
    )
}
function updateEngine() {
  if (!engineId) {
    initEngine()
  }

  updateEngineRate()
  updateEngineState()
}
function updateEngineRate() {
  const rate = _getVelocity(),
    volume = _engineRateToVolume(rate)

  soundsGeneric
    .getEngineSprite()
    .rate(rate, engineId)
    .volume(volume, engineId)
}
function updateEngineState() {
  const oldState = engineState,
    velocity = _getVelocity()

  if (velocity > 0) {
    engineState = true
  } else {
    engineState = false
  }

  if (engineState == oldState) {
    return
  }

  const sprite = soundsGeneric.getEngineSprite()

  const from = engineState ? 0 : 0.33,
    to = engineState ? sprite.volume(engineId) : 0

  sprite.fade(from, to, 0.33, engineId)
}
function _getVelocity() {
  return getContext().stats.getCurrentStats().speed
}
function _engineRateToVolume(rate) {
  const initial = 0.33
  return rate < 1 ? initial : initial / Math.sqrt(rate)
}

let goatId = null
export function playGoatFloating() {
  stopGoatFloating()

  const sprite = soundsGeneric.getSoundSprite()

  goatId = soundsGeneric.play('goat001')

  sprite.loop(true, goatId).volume(1, goatId)
  // sprite.on(
  //   'end',
  //   () => {
  //     let volume = sprite.volume(goatId)

  //     if (volume > 0.25) {
  //       volume *= 0.5
  //       sprite.volume(volume, goatId)
  //     }
  //   },
  //   goatId
  // )

  return goatId
}
export function stopGoatFloating() {
  if (goatId) {
    soundsGeneric.stop(goatId)
    goatId = null
  }
}

export function playGoatRescued() {
  // need new!
  // soundsGeneric.play('pickup001')
  stopGoatFloating()

  playWithRandomRate('phew')
}

export function playGoatPickedUp() {
  soundsGeneric.play('goat')

  //playWithRandomRate('goat')
}

export function playCatRescued() {
  playWithRandomRate('phew')
}

export function playSnailRescued() {
  playWithRandomRate('phew')
}

// const slowdownCause = []
// let slowdownInit = false
// let slowdownSprite = null
let slowdownId = null
export function playSlowdown() {
  stopSlowdown()
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
  playWithRandomRate('smash001')
}

export function playPartConnected() {
  // need new!
  playWithRandomRate('hurt001')
}

export function playClick() {
  //soundsGeneric.play('hurt001')
  soundsGeneric.play('button')
}

export function playLaser() {
  // need new!
  playWithRandomRate('lazer')
}

export function updateAll() {
  updateEngine()
  updateSlowdown()
}

function updateSlowdown() {
  const ctx = getContext()

  if (!cameras.getIsSlowed(ctx.camera)) {
    ctx.sfx.stopSlowdown()
  }
}

function applyRate(id, rate: number) {
  soundsGeneric.getSoundSprite().rate(rate, id)
}
function applyRandomRate(id, rate: number = 1, variance: number = 0.125) {
  rate += _.random(-variance, variance, true)
  applyRate(id, rate)
}
function playWithRate(name, rate: number = 1) {
  const id = soundsGeneric.play(name)
  applyRate(id, rate)
  return id
}
function playWithRandomRate(name, rate?: number, variance?: number) {
  const id = soundsGeneric.play(name)
  applyRandomRate(id, rate, variance)
  return playWithRate(name, rate)
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
