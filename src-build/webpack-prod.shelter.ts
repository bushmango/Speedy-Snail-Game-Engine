import { buildConfig } from './webpack-common'
import { settings } from './currentGame'
let config = buildConfig(
  'production',
  {
    port: 8889,
    debug: false,
    inScript: 'game-shelter.ts',
    outDir: 'shelter',
  },
  settings
)

export default config
