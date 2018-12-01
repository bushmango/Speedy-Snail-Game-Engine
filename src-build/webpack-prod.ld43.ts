import { buildConfig } from './webpack-common'
import { settings } from './currentGame'
let config = buildConfig(
  'production',
  {
    port: 8889,
    debug: false,
    inScript: 'game-ludum-dare-43.ts',
    outDir: 'ludumDare43',
  },
  settings
)

export default config
