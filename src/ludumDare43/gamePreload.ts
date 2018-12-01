const settingsPath = 'ld43-v001'
const preloadPath = '/public/ludumDare43'
export { settingsPath, preloadPath }
export function preload(sge) {
  sge.preloadAudioSprites(['audioSprite'])
  sge.preloadBitmapFonts(['defaultfont'])
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
  ])
  sge.preloadSpriteSheets([
    //'test-tileset',
    //'gui-tileset',
    //'ase-512-16',
    //'ase-512-8',
  ])
  sge.preloadTiledMaps(['tiled-tiles', 'map-pac-001'])
  sge.preloadPackedSprites([])
}
