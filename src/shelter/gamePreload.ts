const settingsPath = 'shelter-v001'
const preloadPath = '/public/shelter'
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
    'rpg-gui',
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
