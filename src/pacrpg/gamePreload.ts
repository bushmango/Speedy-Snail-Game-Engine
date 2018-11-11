const settingsPath = 'pacrpg-v001'
const preloadPath = '/public/pacrpg'
export { settingsPath, preloadPath }
export function preload(sge) {
  sge.preloadAudioSprites([
    // 'audioSprite',
  ])
  sge.preloadBitmapFonts(['defaultfont'])
  sge.preloadSprites([
    // 'test-ship',
    'prariesnailgames',
    'parallax-buildings',
    'player1',
    'tiles',
  ])
  sge.preloadSpriteSheets([
    'test-tileset',
    'gui-tileset',
    'ase-512-16',
    'ase-512-8',
  ])
  sge.preloadTiledMaps(['tiled-tiles', 'map-pac-001'])
  sge.preloadPackedSprites([])
}
