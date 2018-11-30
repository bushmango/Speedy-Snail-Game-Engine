import { buildConfig } from './webpack-common'
import { settings } from './currentGame'
let config = buildConfig(
  'production',
  {
    port: 8889,
    debug: false,
    inScript: 'game.ld41.ts',
    outDir: 'ld41',
  },
  settings
)

export default config
