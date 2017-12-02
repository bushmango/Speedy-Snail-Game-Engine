import { buildConfig } from './webpack-common'

let config = buildConfig(
  'development',
  {
    port: 8888,
    debug: true,
  }
)

export default config