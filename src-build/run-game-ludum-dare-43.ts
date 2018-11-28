import { buildConfig } from './webpack-common'

let config = buildConfig('development', {
  port: 8888,
  debug: true,
  inScript: 'game-ludum-dare-43.ts',
})

export default config
