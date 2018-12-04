import { log, logJson } from './deployerLogger'

import * as _ from 'lodash'
import * as moment from 'moment'

import * as path from 'path'
import * as node_ssh from 'node-ssh'
const ssh = new node_ssh()

import * as PromiseBluebird from 'bluebird'

import * as publishLib from './publish_lib'
import * as fs from 'fs'
import * as fse from 'fs-extra'

export async function build_client() {
  log('build_client')

  try {
    let src = `C:\\dev\\Speedy-Snail-Game-Engine\\src-website\\jams`

    let template = fs.readFileSync(src + '/ludum-dare-43-template.html', 'utf8')
    template = publishLib.replaceAll(
      template,
      '${cacheBreaker}',
      moment().format('X')
    )
    fs.writeFileSync(src + '/ludum-dare-43.html', template, 'utf8')
    await publishLib.npmRun(
      //'build-prod-shelter',
      'build-prod-ld43',
      'C:\\dev\\Speedy-Snail-Game-Engine\\'
    )

    log('OK')
  } catch (err) {
    log('FAILED')
    throw new Error('build_client failed')
  }
}

export async function deploy() {
  log('deploy')
  await publishLib.connectToServer()
  let src = `C:\\dev\\Speedy-Snail-Game-Engine\\dist\\src-deploy\\public\\`
  let wwwDir = `/var/www/jams/public`
  await publishLib.putDirectory(src, wwwDir)
}

export async function deploy_website() {
  log('deploy_website')
  await publishLib.connectToServer()
  let src = `C:\\dev\\Speedy-Snail-Game-Engine\\src-website\\jams\\`
  let wwwDir = `/var/www/jams/`
  await publishLib.putDirectory(src, wwwDir)
}

export async function deploy_assets() {
  log('deploy_assets')
  await publishLib.connectToServer()
  let src = `C:\\dev\\Speedy-Snail-Game-Engine\\src-deploy\\public\\ludumDare43\\`
  let wwwDir = `/var/www/jams/public/ludumDare43/`
  //let src = `C:\\dev\\Speedy-Snail-Game-Engine\\src-deploy\\public\\shelter\\`
  //let wwwDir = `/var/www/jams/public/shelter/`
  await publishLib.putDirectory(src, wwwDir)
}

let rootDir = 'C:\\dev\\Speedy-Snail-Game-Engine'
let gameDir = 'ludumDare43'
let electronDir = `${rootDir}\\electron\\electron-${gameDir}`
export async function deploy_to_electron() {
  let src = `${rootDir}\\src-deploy\\public\\${gameDir}\\`
  let dest = path.join(electronDir, `web\\public\\${gameDir}\\`)
  //let src = `C:\\dev\\Speedy-Snail-Game-Engine\\src-deploy\\public\\shelter\\`
  //let wwwDir = `/var/www/jams/public/shelter/`
  // await publishLib.putDirectory(src, dest)
  await localCopyDir(src, dest)

  let src2 = `${rootDir}\\dist\\src-deploy\\public\\js\\${gameDir}\\`
  let dest2 = path.join(electronDir, `web\\public\\js\\${gameDir}\\`)

  await localCopyDir(src2, dest2)
}

import * as copydir from 'copy-dir'
import * as util from 'util'
const copydirPromise = util.promisify(copydir)

async function localCopyDir(src, dest) {
  try {
    await copydirPromise(src, dest, (stat, filepath, filename) => {
      console.log('->', filename, filepath, stat)
      return true
    })
    console.error('sucess')
  } catch (err) {
    console.error('couldnt copy directory')
  }
}

export async function run_electron() {
  await publishLib.npmRun(
    //'build-prod-shelter',
    'start',
    electronDir
  )
}
