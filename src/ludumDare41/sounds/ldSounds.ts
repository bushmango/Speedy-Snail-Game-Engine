import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import * as soundsGeneric from 'engine/sounds/soundGeneric'
import * as pubSub from 'engine/common/pubSub'

let soundTest = false

export function load(sge: SimpleGameEngine) {
  soundsGeneric.load(sge.getJson('audioSprite'), () => {
    playLoaded()

    if (soundTest) {
      setInterval(() => {
        playLoaded()
      }, 500)
    }

  })
  playMusic1()
}

export function playMusic1() {
  soundsGeneric.playMusic('/public/ludumDareStart/music/music')
}

export function playLoaded() {
  // soundsGeneric.play('pickup001')
}

export function playPickup() {
  soundsGeneric.play('pickup001')
}

export function playExplode() {
  soundsGeneric.play('hurt001')
}

// Links to other systems
pubSub.on('gui:click-button', () => {
  playExplode()
})

pubSub.on('gui:toggle-music', () => {
  playMusic1()
})


