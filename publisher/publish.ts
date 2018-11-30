#!/usr/bin/env ts-node

import * as _ from 'lodash'
import * as publish_ld43 from './publish_ld43'

import { log, logJson } from './deployerLogger'

import * as terminal from 'terminal-kit'
const term = terminal.terminal

interface IMenuItem {
  label: string
  action: () => Promise<any>
}
async function menu(title, items: IMenuItem[]) {
  term.cyan(title + '\n')

  let compiledItems = _.map(items, (c, cIdx) => {
    return cIdx + 1 + ' - ' + c.label
  })

  let result = await term.singleColumnMenu(compiledItems, {
    exitOnUnexpectedKey: true,
  }).promise

  let i = -1
  if (result.unexpectedKey) {
    let key = parseInt(result.unexpectedKey, 10)
    if (!_.isNaN(key)) {
      i = key - 1
    }
  } else {
    i = result.selectedIndex
  }
  if (_.isNaN(i) || i < 0 || i >= items.length) {
    log('what where you thinking? - ', i)
    process.exit()
  } else {
    log(items[i].label)
    await items[i].action()
  }
}

async function run() {
  // await publisherSuperWordCat.install_superWordCat(false, false)

  for (let i = 0; i < 100; i++) {
    try {
      await menu('Publish SuperWordCat!', [
        {
          label: 'exit',
          action: async () => {
            process.exit()
          },
        },

        {
          label: 'build client prod',
          action: async () => {
            await publish_ld43.build_client()
          },
        },
        {
          label: 'deploy client',
          action: async () => {
            await publish_ld43.deploy()
          },
        },
        {
          label: 'deploy client assets / big files',
          action: async () => {
            await publish_ld43.deploy_assets()
          },
        },
        {
          label: 'deploy website',
          action: async () => {
            await publish_ld43.deploy_website()
          },
        },
      ])
    } catch (err) {
      if (err) {
        console.log('FAILED')
        process.exit()
      }
    }
  }

  process.exit()
}
run()
