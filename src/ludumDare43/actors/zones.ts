import * as shipPartsData from './shipPartsData'
import { _ } from 'engine/importsEngine'

export interface IZone {
  distance: number
  name: string

  debrisPartsList?: string[]
  debrisPartsListCalc: shipPartsData.IShipPartData[]
  debrisSpawnRate?: number

  topSupply?: boolean
  bottomSupply?: boolean
  supplyPartsList?: string[]
  supplyPartsListCalc: shipPartsData.IShipPartData[]
  supplySpawnRate?: number

  smallAsteroidRate?: number
  largeAsteroidRate?: number
}

let items: IZone[] = []

let zoneInfo = {
  maxDistance: 0,
  currentZone: null as IZone,
}

let allParts = _.map(shipPartsData.spawnableDatas, (c) => c.name)
let connectors = ['h', 'v', 'tl', 'tr', 'bl', 'br']
let engines = ['engine-1', 'engine-2']

function calculateZones() {
  zoneInfo.maxDistance = 0
  _.forEach(items, (c) => {
    zoneInfo.maxDistance += c.distance

    _.forEach(c.debrisPartsList, (d) => {
      let found = _.find(
        shipPartsData.datas,
        (c: shipPartsData.IShipPartData) => c.name === d
      )
      if (!found) {
        throw 'could not find ' + d + '|' + c.name
      }
      c.debrisPartsListCalc.push(found)
    })

    _.forEach(c.supplyPartsList, (d) => {
      let found = _.find(
        shipPartsData.datas,
        (c: shipPartsData.IShipPartData) => c.name === d
      )
      if (!found) {
        throw 'could not find ' + d + '|' + c.name
      }
      c.supplyPartsListCalc.push(found)
    })
  })
  updateCurrentZone(0)
}

export function updateCurrentZone(distance) {
  let di = 0
  let currentZone = null
  _.forEach(items, (c) => {
    di += c.distance
    currentZone = c
    if (distance < di) {
      return false
    }
  })
  zoneInfo.currentZone = currentZone
  return currentZone
}
export function getZoneInfo() {
  return zoneInfo
}
export function getCurrentZone() {
  return zoneInfo.currentZone
}

function createZone(name: string) {
  let zone: IZone = {
    name,
    debrisPartsList: ['engine-1'],
    distance: 100,
    debrisPartsListCalc: [],
    supplyPartsListCalc: [],
  }
  items.push(zone)
  return zone
}

let z: IZone = null
let zone1 = (z = createZone('Tutorial Zone'))
z.debrisPartsList = connectors
z.distance = 10
z.debrisSpawnRate = 5

let zone2 = (z = createZone('Build Zone'))
//z.debrisPartsList = connectors
z.distance = 10
z.topSupply = true
z.bottomSupply = true
z.debrisPartsList = connectors
z.supplyPartsList = allParts
z.debrisSpawnRate = 5
z.supplySpawnRate = 5

let zone3 = (z = createZone('Small Asteroid Zone'))
//z.debrisPartsList = connectors
z.distance = 30
z.topSupply = true
z.debrisPartsList = connectors
z.supplyPartsList = allParts
z.smallAsteroidRate = 1
//z.debrisSpawnRate = 10
//z.supplySpawnRate = 5

let zone4 = (z = createZone('Large Asteroid Zone'))
//z.debrisPartsList = connectors
z.distance = 30
z.topSupply = true
z.debrisPartsList = connectors
z.supplyPartsList = allParts
z.largeAsteroidRate = 1
z.debrisSpawnRate = 10
z.supplySpawnRate = 5

let zone5 = (z = createZone('Hard Asteroid Zone'))
//z.debrisPartsList = connectors
z.distance = 30
z.debrisPartsList = connectors
z.supplyPartsList = allParts
z.largeAsteroidRate = 1
z.smallAsteroidRate = 1
//z.debrisSpawnRate = 10
//z.supplySpawnRate = 5

calculateZones()
