const settingsPath = 'ld44-v001'
const preloadPath = '/public/ludumDare44'
const musicPath = preloadPath + '/music/'

export { settingsPath, preloadPath, musicPath }
export function preload(sge) {
  sge.preloadAudioSprites(['audioSprite'])
  sge.preloadBitmapFonts([
    //'defaultfont',
    'tahoma12',
    'tahoma16',
    'tahoma20',
    'tahoma24',
    //'tahoma48',
  ])
  sge.preloadSprites([
    // 'test-ship',
    'prariesnailgames',
    'parallax-buildings',
    'player1',
    'tiles',
    'rpg-gui',
    '512-32-gui',
    'credits',
    'instructions',
    'title',
    'ship-001',
    'starfield-001',
    'planet-001',
    'planet-002',
    'planet-003',
    'victory',
  ])
  sge.preloadSpriteSheets([
    //'test-tileset',
    //'gui-tileset',
    //'ase-512-16',
    //'ase-512-8',
  ])
  // sge.preloadTiledMaps(['tiled-tiles', 'map-pac-001'])
  // sge.preloadPackedSprites([])
}