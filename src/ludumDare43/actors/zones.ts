import * as shipPartsData from './shipPartsData'
import { _ } from 'engine/importsEngine'
import * as enemyShipSpawns from './enemyShipsSpawns'

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

  bossSpawn?: () => void
}

export interface IZoneSet {
  difficulty: string
  items: IZone[]
  maxDistance: 0
}

let zoneSets: IZoneSet[] = []

function createZoneSet(difficulty: string) {
  let zoneSet: IZoneSet = {
    difficulty,
    items: [],
    maxDistance: 0,
  }
  zoneSets.push(zoneSet)
  return zoneSet
}

let zoneInfo = {
  curDistance: 0,
  currentZone: null as IZone,
  currentZoneSet: null as IZoneSet,
}

let allParts = _.map(shipPartsData.spawnableDatas, (c) => c.name)
let connectors = ['cross', 'h', 'v', 'tl', 'tr', 'bl', 'br', 'habitat']
let decor = ['wing-1', 'wing-2', 'cockpit-1']
// let mids = ['body']
let armor = ['armor-1', 'wing-armor-1', 'wing-armor-2']
let engines = ['engine-1', 'engine-2']
let weapons = ['laser-1', 'rocket-1', 'rocket-2', 'rocket-3']
let basic = _.concat(connectors, decor, 'engine-1', 'rocket-1', 'rocket-2')

function calculateZones() {
  _.forEach(zoneSets, (zoneSet) => {
    zoneSet.maxDistance = 0
    _.forEach(zoneSet.items, (c) => {
      zoneSet.maxDistance += c.distance

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
  })

  zoneInfo.currentZoneSet = zoneSets[0]
  updateCurrentZone(0)
}

export function updateCurrentZone(distance) {
  let di = 0
  let currentZone = null
  _.forEach(zoneInfo.currentZoneSet.items, (c) => {
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

export function setCurrentZoneSet(diff) {
  let f = _.find(zoneSets, (c: IZoneSet) => c.difficulty === diff)
  if (f) {
    zoneInfo.currentZoneSet = f
    //updateCurrentZone(0)
  }
}

function createZone(zoneSet: IZoneSet, name: string) {
  let zone: IZone = {
    name,
    debrisPartsList: ['engine-1'],
    distance: 100,
    debrisPartsListCalc: [],
    supplyPartsListCalc: [],
  }
  zoneSet.items.push(zone)
  return zone
}

let z: IZone = null

let zs: IZoneSet = createZoneSet('test')

let zoneTest = (z = createZone(zs, 'Test Zone'))
z.topSupply = true
z.bottomSupply = true
z.supplyPartsList = allParts
z.debrisPartsList = connectors
z.distance = 10000
z.debrisSpawnRate = 2
z.supplySpawnRate = 1
z.smallAsteroidRate = 2
//z.largeAsteroidRate = 4

// let zone0 = (z = createZone('Intro Zone'))

// -- FREE BUILD --
zs = createZoneSet('free-build')
let zoneFree = (z = createZone(zs, 'Free Build Zone'))
z.topSupply = true
z.bottomSupply = true
z.supplyPartsList = allParts
z.debrisPartsList = connectors
z.distance = 10000
z.debrisSpawnRate = 2
z.supplySpawnRate = 1

// -- HARD --
zs = createZoneSet('hard')
let zoneHard = (z = createZone(zs, 'Hard Zone'))
z.topSupply = true
z.bottomSupply = true
z.supplyPartsList = allParts
z.debrisPartsList = connectors
z.distance = 10000
z.debrisSpawnRate = 2
z.supplySpawnRate = 1

// -- Endless --
zs = createZoneSet('endless')
let zoneEndless = (z = createZone(zs, 'Endless Zone'))
z.topSupply = true
z.bottomSupply = false
z.supplyPartsList = allParts
z.debrisPartsList = basic
z.distance = 10000
z.debrisSpawnRate = 2
z.supplySpawnRate = 5
// Todo slowly increase
z.smallAsteroidRate = 2
z.largeAsteroidRate = 4

// -- EASY --
zs = createZoneSet('easy')
let zone1 = (z = createZone(zs, 'Tutorial Zone'))
z.topSupply = true
z.supplyPartsList = ['engine-1']
//z.debrisPartsList = connectors
z.distance = 1
//z.debrisSpawnRate = 5
z.supplySpawnRate = 2

let zone2 = (z = createZone(zs, 'Build Zone'))
//z.debrisPartsList = connectors
z.distance = 20
z.topSupply = false
z.bottomSupply = true
z.debrisPartsList = basic
z.supplyPartsList = basic
z.debrisSpawnRate = 1
z.supplySpawnRate = 1
z.tip = 'Keep dragging parts onto your ship'

let zone3 = (z = createZone(zs, 'Small Asteroid Zone'))
//z.debrisPartsList = connectors
z.distance = 20
z.topSupply = true
z.debrisPartsList = connectors
z.supplyPartsList = basic
z.smallAsteroidRate = 2
z.tip = 'Click on your ship to jettison parts!'
z.debrisSpawnRate = 3
//z.supplySpawnRate = 5

let zone3b = (z = createZone(zs, 'Rebuild Zone'))
//z.debrisPartsList = connectors
z.distance = 30
z.topSupply = true
z.bottomSupply = true
z.debrisPartsList = basic
z.supplyPartsList = allParts
z.debrisSpawnRate = 2
z.supplySpawnRate = 2
z.tip = 'Never stop building!'

let zone4 = (z = createZone(zs, 'Large Asteroid Zone'))
//z.debrisPartsList = connectors
z.distance = 25
z.topSupply = true
z.debrisPartsList = basic
z.supplyPartsList = allParts
z.largeAsteroidRate = 2
z.debrisSpawnRate = 2
z.supplySpawnRate = 3
z.tip = 'Keep flying!'

let zone4b = (z = createZone(zs, 'Rebuild Zone 2'))
//z.debrisPartsList = connectors
z.distance = 30
z.topSupply = true
z.bottomSupply = true
z.debrisPartsList = basic
z.supplyPartsList = allParts
z.debrisSpawnRate = 2
z.supplySpawnRate = 2
z.tip = 'Phew!'

let zone5 = (z = createZone(zs, 'Hard Asteroid Zone'))
//z.debrisPartsList = connectors
z.distance = 20
z.debrisPartsList = basic
z.supplyPartsList = allParts
z.largeAsteroidRate = 3
z.smallAsteroidRate = 2
z.debrisSpawnRate = 1
//z.supplySpawnRate = 5
z.tip = 'In space, goat sacrifices you!'

let zone6 = (z = createZone(zs, 'Scrapyard Zone'))
//z.debrisPartsList = connectors
z.distance = 30
z.topSupply = true
z.bottomSupply = true
z.debrisPartsList = allParts
z.supplyPartsList = allParts
z.debrisSpawnRate = 2
z.supplySpawnRate = 2

let zoneB = (z = createZone(zs, 'Asteroid Mega Zone'))
//z.debrisPartsList = connectors
z.distance = 20
z.debrisPartsList = connectors
z.topSupply = true

z.supplyPartsList = connectors
z.debrisSpawnRate = 2
z.largeAsteroidRate = 4
z.smallAsteroidRate = 0.75
z.tip = 'The final sacrifice'

let zoneB2 = (z = createZone(zs, 'Boss'))
//z.debrisPartsList = connectors
z.distance = 10
//z.debrisPartsList = connectors
z.topSupply = true

z.supplyPartsList = allParts
z.debrisSpawnRate = 2
z.bossSpawn = enemyShipSpawns.spawn4
z.tip = 'The final sacrifice'

let zoneV = (z = createZone(zs, 'Victory Zone'))
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
