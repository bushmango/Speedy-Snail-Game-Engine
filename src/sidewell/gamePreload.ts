const settingsPath = 'sidewell-v001'
const preloadPath = '/public/sidewell'
const musicPath = preloadPath + '/music/'

export { settingsPath, preloadPath, musicPath }
export function preload(sge) {
  sge.preloadAudioSprites(['audioSprite'])
  sge.preloadBitmapFonts([
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
  ])
  sge.preloadSpriteSheets([
    //'test-tileset',
    //'gui-tileset',
    //'ase-512-16',
    //'ase-512-8',
  ])
  sge.preloadTiledMaps(['tiled-tiles', 'map-shelter-001'])
  sge.preloadPackedSprites([])
}
