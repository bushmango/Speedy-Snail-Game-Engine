import { _, numeral } from 'engine/importsEngine'
import { getContext } from '../GameContext'
import * as wallPieces from './wallPieces'
import * as wallStacks from './wallStacks'
import * as wallPiecesData from './wallPiecesData'
import * as log from 'engine/log'

import * as sectionLoader from './../map/sectionLoader'
import * as tilesLoader from './../map/tilesLoader'

let bHeight = 10

let item = {
  minGap: bHeight - 3,
  top: 1,
  bottom: 1,
  lastTop: 1,
  lastGap: 8,
}

export interface ISectionData {
  key: string
  mapKeys: string[]
  maps: any[]
}
let allMapKeys: string[] = ['tiles-s16-512']
export function getAllMapKeys() {
  return allMapKeys
}

function createSection(key, num) {
  let item: ISectionData = {
    key: key,
    mapKeys: [],
    maps: null,
  }
  for (let i = 0; i < num; i++) {
    let mk = 's-' + key + '-' + numeral(i + 1).format('000')
    item.mapKeys.push(mk)
    allMapKeys.push(mk)
  }
  return item
}

let section1 = createSection('001', 1)
let section2 = createSection('002', 2)
let jsonTiles = null
export function generate() {
  // Load station

  let ctx = getContext()

  jsonTiles = ctx.sge.getJson('tiles-s16-512')
  tilesLoader.load(jsonTiles)
  // mapLoader.load(mk, jsonTiles, json)

  // Load everything

  // Just a test generation
  loadInSection(0, section1)
  loadInSection(10, section2)
  loadInSection(20, section2)
  loadInSection(30, section2)
  loadInSection(40, section2)
}

export function loadInSection(bx, section) {
  let ctx = getContext()

  for (let i = 0; i < 10; i++) {
    addAStack(i)
  }

  let mk = _.sample(section.mapKeys)
  let jsonMap = ctx.sge.getJson(mk)

  sectionLoader.load(jsonTiles, jsonMap, bx)
}

export function addAStack(bx) {
  let s = wallStacks.create(bx)

  for (let j = 0; j < 10; j++) {
    let p = wallPieces.create()
    wallPieces.moveTo(p, s.bx, j)
    wallPieces.setData(p, wallPiecesData.DataB)
    s.items.push(p)
  }
}

export function setBack(bx, by, t, tx, ty) {
  let stacks = wallStacks.getAll()
  let lastStack = stacks[stacks.length - 1]
  //lastStack.items[0].

  let b = getAt(bx, by)
  if (b) {
    let td = wallPiecesData.tileDatas
    let d = td[t]
    log.x(bx, by, d)

    if (d) {
      wallPieces.setData(b, d)
    }
  }
}

export function setCollision(bx, by, t, tx, ty) {
  let stacks = wallStacks.getAll()
  let lastStack = stacks[stacks.length - 1]
  //lastStack.items[0].

  let b = getAt(bx, by)
  if (b) {
    let td = wallPiecesData.tileDatas
    let d = td[t]
    log.x(bx, by, d)

    if (d) {
      wallPieces.setData(b, d)
    }
  }
}

export function setFore(bx, by, t, tx, ty) {
  let stacks = wallStacks.getAll()
  let lastStack = stacks[stacks.length - 1]
  //lastStack.items[0].

  let b = getAt(bx, by)
  if (b) {
    let td = wallPiecesData.tileDatas
    let d = td[t]
    log.x(bx, by, d)

    if (d) {
      wallPieces.setData(b, d)
    }
  }
}

export function getAt(bx, by) {
  let stacks = wallStacks.getAll()
  for (let i = 0; i < stacks.length; i++) {
    if (bx === stacks[i].bx) {
      return stacks[i].items[by]
    }
  }
  return null
}

export function update(elapsedTimeSec: number) {
  let ctx = getContext()
  let camera = ctx.camera
  let cv = ctx.getCameraView()
  let cxy = ctx.getCameraWorldPos()

  let csx = camera.x / camera.scale

  let stacks = wallStacks.getAll()
  if (stacks.length) {
    let lastStack = stacks[stacks.length - 1]

    // log.x(lastStack.bx * 16, camera.x, camera.x + cv.cameraWidth * 0.75)

    // if (lastStack.bx * 16 - csx < cv.cameraWidth * 0.9) {
    //   // Add a stack
    //   addAStack(lastStack.bx + 1)
    // }

    let margin = +32 // +32 for testing

    if (cxy.x + cv.cameraWidth - margin > lastStack.bx * 16) {
      // Add a stack
      addAStack(lastStack.bx + 1)
    }

    _.forEach(stacks, (c) => {
      if (csx + margin > c.bx * 16 + 16) {
        wallStacks.remove(c)
      }
    })
  }
}
