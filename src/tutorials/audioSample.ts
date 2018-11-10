// see: https://github.com/goldfire/howler.js#documentation

import { SimpleGameEngine } from 'engine/SimpleGameEngine'
import { _ } from 'engine/importsEngine'

import * as howler from 'howler'
// console.log(howler)

let sge = new SimpleGameEngine()

export function run() {
  console.log('Running audio sample')

  sge.init()
  sge.createRenderer()
  let stage = sge.stage
  let renderer = sge.renderer

  sge.preload('public/examples', () => {
    onLoaded()
  })

  function onLoaded() {
    test_simpleAudio()

    sge.onUpdateCallback = onUpdate
    sge.startGameLoop()
  }

  function test_simpleAudio() {
    let baseDir = '/public/sounds/'
    // let soundName = 'hurt001'
    // let sound = new howler.Howl({
    //   src: [baseDir + soundName + '.ogg', baseDir + soundName + '.aac']
    // })
    // sound.once('load', () => {
    //   sound.play()
    // })
    // sound.on('loaderror', (id, err) => {
    //   console.log('howl', 'loaderror', id, err)
    // })

    // soundName = 'pickup001'
    // let sound2 = new howler.Howl({
    //   src: [baseDir + soundName + '.ogg', baseDir + soundName + '.aac']
    // })
    // sound2.once('load', () => {
    //   sound2.play()
    // })
    // sound2.on('loaderror', (id, err) => {
    //   console.log('howl', 'loaderror', id, err)
    // })

    let soundSpriteName = 'audioSprite'
    console.log('loading')

    let jsonFilename = baseDir + soundSpriteName + '.json'
    var loader = new PIXI.loaders.Loader()
    loader.add(jsonFilename).load((a) => {
      let json = loader.resources[jsonFilename].data
      console.log('loaded', json)

      let soundSprite = new howler.Howl({
        src: json.urls,
        sprite: json.sprite,
      })
      soundSprite.once('load', () => {
        soundSprite.play('hurt001')
        _.delay(() => {
          soundSprite.play('pickup001')
        }, 1000)
        _.delay(() => {
          soundSprite.play('hurt001')
        }, 1500)
      })
      soundSprite.on('loaderror', (id, err) => {
        console.log('howl', 'loaderror', id, err)
      })
      // sound.on('playerror', () => {
      //   console.log('howl', 'playerror ')
      // })

      // let soundSprite = new howler.Howl({
      //   src: [baseDir + soundSpriteName + '.ogg', baseDir + soundSpriteName + '.m4a', baseDir + soundSpriteName + '.ac3', baseDir + soundSpriteName + '.mp3']
      // })
      // soundSprite.once('load', () => {
      //   soundSprite.play()
      // })
      // soundSprite.on('loaderror', (id, err) => {
      //   console.log('howl', 'loaderror', id, err)
      // })
      // sound.on('playerror', () => {
      //   console.log('howl', 'playerror ')
      // })
    })
  }

  function onUpdate() {}
}
