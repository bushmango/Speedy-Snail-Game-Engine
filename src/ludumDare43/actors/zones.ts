import * as shipPartsData from './shipPartsData'
import { Z_ASCII } from 'zlib'

export interface IZone {
  debrisPartsList?: string[]
  distance: number
  name: string

  topSupply?: boolean
  bottomSupply?: boolean
  supplyPartsList?: string[]

  smallAsteroidRate?: number
  largeAsteroidRate?: number
}

let items: IZone[] = []

let zoneInfo = {
  maxDistance: 0,
}

let connectors = ['h', 'v', 'tl', 'tr', 'bl', 'br']
let engines = ['engine-1', 'engine-2']

function createZone(name: string) {
  let zone: IZone = {
    name,
    debrisPartsList: ['engine-1'],
    distance: 100,
  }
  items.push(zone)
  return zone
}

let z: IZone = null
let zone1 = (z = createZone('Tutorial Zone'))
z.debrisPartsList = connectors
z.distance = 10

let zone2 = (z = createZone('Build Zone'))
//z.debrisPartsList = connectors
z.distance = 10
z.topSupply = true
z.bottomSupply = true

let zone3 = (z = createZone('Small Asteroid Zone'))
//z.debrisPartsList = connectors
z.distance = 30
z.topSupply = true
z.smallAsteroidRate = 1

let zone4 = (z = createZone('Large Asteroid Zone'))
//z.debrisPartsList = connectors
z.distance = 30
z.topSupply = true
z.largeAsteroidRate = 1

function calculateZones() {}
calculateZones()
