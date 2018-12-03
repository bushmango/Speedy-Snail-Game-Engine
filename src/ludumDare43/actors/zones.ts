import * as shipPartsData from './shipPartsData'
import { _ } from 'engine/importsEngine'

export interface IZone {
  distance: number
  name: string
  tip?: string

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
let connectors = ['cross', 'h', 'v', 'tl', 'tr', 'bl', 'br']
let decor = ['wing-1', 'wing-2', 'cockpit-1']
// let mids = ['body']
let armor = ['armor-1', 'wing-armor-1', 'wing-armor-2']
let engines = ['engine-1', 'engine-2']
let weapons = ['laser-1', 'rocket-1', 'rocket-2', 'rocket-3']
let basic = _.concat(connectors, decor, 'engine-1', 'rocket-1')

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

// let zone0 = (z = createZone('Intro Zone'))

let zone1 = (z = createZone('Tutorial Zone'))
z.topSupply = true
z.supplyPartsList = ['engine-1']
//z.debrisPartsList = connectors
z.distance = 1
//z.debrisSpawnRate = 5
z.supplySpawnRate = 2

let zone2 = (z = createZone('Build Zone'))
//z.debrisPartsList = connectors
z.distance = 20
z.topSupply = false
z.bottomSupply = true
z.debrisPartsList = basic
z.supplyPartsList = basic
z.debrisSpawnRate = 1
z.supplySpawnRate = 1
z.tip = 'Keep dragging parts onto your ship'

let zone3 = (z = createZone('Small Asteroid Zone'))
//z.debrisPartsList = connectors
z.distance = 20
z.topSupply = true
z.debrisPartsList = connectors
z.supplyPartsList = basic
z.smallAsteroidRate = 0.75
z.tip = 'Click on your ship to jettison parts!'
//z.debrisSpawnRate = 10
//z.supplySpawnRate = 5

let zone3b = (z = createZone('Rebuild Zone'))
//z.debrisPartsList = connectors
z.distance = 30
z.topSupply = true
z.bottomSupply = true
z.debrisPartsList = basic
z.supplyPartsList = allParts
z.debrisSpawnRate = 2
z.supplySpawnRate = 2
z.tip = 'Never stop building!'

let zone4 = (z = createZone('Large Asteroid Zone'))
//z.debrisPartsList = connectors
z.distance = 25
z.topSupply = true
z.debrisPartsList = armor
z.supplyPartsList = allParts
z.largeAsteroidRate = 2
z.debrisSpawnRate = 5
z.supplySpawnRate = 3
z.tip = 'Keep flying!'

let zone4b = (z = createZone('Rebuild Zone 2'))
//z.debrisPartsList = connectors
z.distance = 30
z.topSupply = true
z.bottomSupply = true
z.debrisPartsList = basic
z.supplyPartsList = allParts
z.debrisSpawnRate = 2
z.supplySpawnRate = 2
z.tip = 'Phew!'

let zone5 = (z = createZone('Hard Asteroid Zone'))
//z.debrisPartsList = connectors
z.distance = 20
z.debrisPartsList = connectors
z.supplyPartsList = allParts
z.largeAsteroidRate = 2
z.smallAsteroidRate = 2
//z.debrisSpawnRate = 10
//z.supplySpawnRate = 5
z.tip = 'In space, goat sacrifices you!'

let zone6 = (z = createZone('Scrapyard Zone'))
//z.debrisPartsList = connectors
z.distance = 30
z.topSupply = true
z.bottomSupply = true
z.debrisPartsList = allParts
z.supplyPartsList = allParts
z.debrisSpawnRate = 2
z.supplySpawnRate = 2

let zoneB = (z = createZone('Boss Zone'))
//z.debrisPartsList = connectors
z.distance = 20
z.debrisPartsList = connectors
z.supplyPartsList = connectors
z.largeAsteroidRate = 2
z.smallAsteroidRate = 0.25
z.tip = 'The final sacrifice'

let zoneV = (z = createZone('Victory Zone'))
//z.debrisPartsList = connectors
z.distance = 5
//z.debrisPartsList = connectors
//z.supplyPartsList = allParts
//z.largeAsteroidRate = 1
//z.smallAsteroidRate = 1
//z.debrisSpawnRate = 10
//z.supplySpawnRate = 5
z.tip = 'You have arrived safely'

calculateZones()
