import { log, logJson } from './deployerLogger'

import * as _ from 'lodash'
import * as moment from 'moment'

import * as path from 'path'
import * as node_ssh from 'node-ssh'
const ssh = new node_ssh()

import * as PromiseBluebird from 'bluebird'

import * as publishLib from './publish_lib'
import * as fs from 'fs'

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
      'build-prod-shelter', // build-prod-ld43
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
  let src = `C:\\dev\\Speedy-Snail-Game-Engine\\src-deploy\\public\\shelter\\`
  let wwwDir = `/var/www/jams/public/shelter/`
  await publishLib.putDirectory(src, wwwDir)
}
