import { log, logJson } from './deployerLogger'

import * as _ from 'lodash'
import * as path from 'path'
import * as node_ssh from 'node-ssh'
const ssh = new node_ssh()

import * as PromiseBluebird from 'bluebird'

const ppkPath = path.join(__dirname, './ssh/ssh-private.ppk')
export async function connectToServer() {
  log('SSH connecting')
  await ssh.connect({
    host: '138.197.37.71',
    username: 'root',
    privateKey: ppkPath,
  })
  log('SSH connected')
}

export async function putDirectory(src, dest, recursive = true) {
  let start = Date.now()
  await mkdir(dest)
  log(`SSH putting directory ${src} > ${dest}`)
  try {
    const failed = []
    const successful = []
    let result = await ssh.putDirectory(src, dest, {
      recursive: recursive,
      concurrency: 10,
      validate: (itemPath) => {
        const baseName = path.basename(itemPath)
        if (baseName.substr(0, 1) === '.') return false
        if (_.endsWith(itemPath, '.map')) return false
        // if (baseName === 'node_modules') return false
        // if (baseName === 'images') return false
        return true
      },
      tick: (localPath, remotePath, error) => {
        if (error) {
          log('BAD', localPath)
          failed.push(localPath)
        } else {
          log('---', localPath)
          successful.push(localPath)
        }
      },
    })

    log('failed transfers', failed.length)
    log('successful transfers', successful.length)
  } catch (err) {
    log('ERR|', err)
  }
  let time = Date.now() - start
  log(time + ' ms')
}

export async function mkdir(dest) {
  await runCommand('/', `mkdir -p ${dest}`)
}

export async function runCommand(cwd, command) {
  log(`SSH running ${cwd} > ${command}`)
  try {
    let result = await ssh.exec(command, [], {
      cwd: cwd,
      onStdout(chunk) {
        //log(chunk.toString('utf8'))
        log('O>', chunk.toString('utf8'))
      },
      onStderr(chunk) {
        log('E>', chunk.toString('utf8'))
      },
    })
  } catch (err) {
    log('ERR|', err)
  }
}

export async function putFile(src, dest) {
  log(`SSH putting file ${src} > ${dest}`)
  // await mkdir(dest)
  try {
    let result = await ssh.putFile(src, dest)
  } catch (err) {
    log('ERR|', err)
  }
}

export function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}
export function replaceAll(str, toReplace, replaceWith) {
  var re = new RegExp(escapeRegExp(toReplace), 'g')
  str = str.replace(re, replaceWith)
  return str
}

import * as child_process from 'child-process-promise'
const { exec } = child_process

export async function npmRun(command, cwd) {
  //console.log(process.env)

  let env = _.cloneDeep(process.env)
  env.FORCE_COLOR = '1'

  log('running npm command ', command, cwd)
  let promise = exec('npm run ' + command + ' --colors', {
    cwd: cwd,
    env,
  })
  var childProcess = promise.childProcess
  log('[spawn] childProcess.pid: ', childProcess.pid)
  childProcess.stdout.on('data', (chunk) => {
    console.log('[spawn] stdout: ', chunk.toString('utf8'))
  })
  childProcess.stderr.on('data', (chunk) => {
    console.log('[spawn] stderr: ', chunk.toString('utf8'))
  })

  let result = await promise
  log(result.stdout)
  log(result.stderr)
}
