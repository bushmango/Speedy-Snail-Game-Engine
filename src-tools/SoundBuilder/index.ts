#!/usr/bin/env ts-node

// install instructions:
// install ffmpeg
// run npm i

// See:
// http://stackoverflow.com/questions/12742082/nodejs-require-inside-typescript-file
// https://github.com/TypeStrong/ts-node
// https://developer.atlassian.com/blog/2015/11/scripting-with-node/

import * as _ from 'lodash'

declare var process: any

declare function require(name: string)
const fs: any = require('fs')
const chokidar: any = require('chokidar')
const chalk: any = require('chalk')
const program: any = require('commander')
const path = require('path')
const exec = require('child_process').exec

console.log(chalk.bold.cyan('-.-'))
console.log(chalk.bold.green('~Stevie Bushman Presents~'))
console.log('Sounds Builder - watch and convert sounds - v0.0.3')

// print args
process.argv.forEach((val, index, array) => {
  console.log(index + ': ' + val)
})

// let watchPath = `C:/dev/stevieweb/SimpleGameEngine/src-resources/sounds/sprite1/`
// let outPath = `C:/dev/stevieweb/SimpleGameEngine/src-deploy/public/sounds/`

let dir = process.argv[2] || 'ludumDareStart'
process.title = 'Sfx:' + dir

let folder = dir

let basePath = __dirname
console.log('__dirname', __dirname)
basePath = path.join(basePath, '../../')
console.log('basePath', basePath)
console.log('dir', dir)

let watchPath =
  path.join(basePath, 'src-resources', dir, 'sounds', 'sprite1') + '\\'
let outPath = path.join(basePath, 'src-deploy', 'public', dir, 'sounds') + '\\'
//let watchPath = `C:\\dev\\Speedy-Snail-Game-Engine\\src-resources\\${folder}\\sounds\\sprite1\\`
//let outPath = `C:\\dev\\Speedy-Snail-Game-Engine\\src-deploy\\public\\${folder}\\sounds\\`

// let watchPath = `C:\\dev\\Speedy-Snail-Game-Engine\\src-resources\\${folder}\\sounds\\sprite1\\`
// let outPath = `C:\\dev\\Speedy-Snail-Game-Engine\\src-deploy\\public\\${folder}\\sounds\\`

let watchPathMusic = path.join(basePath, 'src-resources', dir, 'music') + '\\'
let outPathMusic =
  path.join(basePath, 'src-deploy', 'public', dir, 'music') + '\\'

// let watchPathMusic = `C:\\dev\\Speedy-Snail-Game-Engine\\src-resources\\${folder}\\music\\`
// let outPathMusic = `C:\\dev\\Speedy-Snail-Game-Engine\\src-deploy\\public\\${folder}\\music\\`

let verbose = false

let mode = 'sprite'

// let basePath = __dirname
// let ffmpegPath = 'C:/dev/tools/ffmpeg-3.3.3-win64-static/bin/ffmpeg.exe'
let ffmpegPath = path.join(__dirname, 'ffmpeg', 'bin', 'ffmpeg.exe')
let watchGlob = watchPath + '**/*.wav'
let watchGlobMusic = watchPathMusic + '*.wav'

function run() {
  // TODO: command line args
  program
    .arguments('<file>')
    .option('-n, --narm <narm>', 'Your name')
    .action(function(file, options) {})
    .parse(process.argv)

  // Stuff that is always done
  watch(watchGlob)
  console.log('Watching sounds : ', watchGlob)

  watchMusic(watchGlobMusic)
  console.log('Watching music : ', watchGlobMusic)

  console.log('ffmpegPath', ffmpegPath)
}

function watch(glob: string) {
  // Initialize watcher.
  let watcher = chokidar.watch(glob, {
    persistent: true,
  })

  // Something to use when events are received.
  let log = console.log.bind(console)

  // Add event listeners.
  watcher
    .on('add', (loc) => onWatchEvent(loc, 'added', false))
    .on('change', (loc) => onWatchEvent(loc, 'changed', false))
}

function watchMusic(glob: string) {
  // Initialize watcher.
  let watcher = chokidar.watch(glob, {
    persistent: true,
    ignoreInitial: false,
  })

  // Something to use when events are received.
  let log = console.log.bind(console)
  // Add event listeners.
  watcher
    .on('add', (loc) => onWatchEvent(loc, 'added', true))
    .on('change', (loc) => onWatchEvent(loc, 'changed', true))
}

function onWatchEvent(loc, type, isMusic) {
  console.log('=>', type, loc, isMusic)
  if (mode === 'convert' || isMusic) {
    let originalFilePath = loc
    let originalFilePathWithoutExtension = loc.slice(
      0,
      -path.extname(loc).length
    )
    let fileName = path.basename(originalFilePathWithoutExtension)

    let filePath = path.join(isMusic ? outPathMusic : outPath, fileName)

    // let args1 = `-y -i "${originalFilePath}" -acodec libmp3lame "${filePath}.mp3"`
    let args1 = `-y -i "${originalFilePath}" -c:a aac -b:a 160k "${filePath}.aac"`
    let args2 = `-y -i "${originalFilePath}" -acodec libvorbis -aq 4 "${filePath}.ogg"`

    runCommand(ffmpegPath, args1, 'to aac', filePath)
    runCommand(ffmpegPath, args2, 'to ogg', filePath)
  }
  if (mode === 'sprite' && !isMusic) {
    _throttled_createSprite()
  }
}

function runCommand(pathToProgram, args, prefix, friendlyName) {
  let cmd = pathToProgram + ' ' + args
  console.log('start', prefix, friendlyName)
  console.log('exe', cmd)
  if (verbose) {
    console.log('exe', cmd)
  }
  exec(cmd, function(error, stdout, stderr) {
    // command output is in stdout
    if (error) {
      console.log('error =>', error)
    }
    if (verbose) {
      console.log(prefix + ' => ', stdout, stderr)
    }
    console.log('done ', prefix, friendlyName)
  })
}

function createSprite() {
  // Audiosprite test
  console.log('creating sprite')
  let path = watchPath

  let files = []
  fs.readdir(path, (err, items) => {
    for (let i = 0; i < items.length; i++) {
      let file = path + items[i]
      if (/.wav$/.test(file.toLowerCase())) {
        console.log('+', file)
        files.push(file)
      }

      // fs.stat(file, function (f) {
      //   return function (err, stats) {
      //     console.log(f);
      //     console.log(stats["size"]);
      //   }
      // }(file));
    }

    let opts = {
      output: outPath + 'audioSprite',
      format: 'howler',
    }
    const audiosprite = require('audiosprite')

    console.log('creating autiosprite')
    audiosprite(files, opts, (err, obj) => {
      if (err) {
        console.error(err)
        return
      }

      // console.log(JSON.stringify(obj, null, 2))
      obj.urls = [
        `public/${folder}/sounds/audioSprite.ogg`,
        `public/${folder}/sounds/audioSprite.m4a`,
        `public/${folder}/sounds/audioSprite.mp3`,
        `public/${folder}/sounds/audioSprite.ac3`,
      ]
      if (verbose) {
        //console.log(JSON.stringify(obj, null, 2))
      }

      let jsonfile = require('jsonfile')

      let file = outPath + 'audioSprite.json' // 'audioSprite.txt' 
      console.log('write', file)
      jsonfile.writeFileSync(file, obj, { spaces: 2 })
    })
  })
}

const _throttled_createSprite = _.throttle(createSprite, 500, {
  leading: false,
  trailing: true,
})

run()
