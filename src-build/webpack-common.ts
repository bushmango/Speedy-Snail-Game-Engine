/*tslint:disable:no-var-requires*/

// see: https://webpack.js.org/guides/development/

// TODO: add dyno builder technology with game configs

declare var require
declare var process

const webpack = require('webpack')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

export function buildConfig(
  mode: any,
  options: {
    debug: boolean,
    port: number,
  },
  settings?: {
    prodExport: string,
  }
) {

  let { port, debug } = options

  let inScript = 'game.ts'
  let outScript = 'game.bundle.js'

  if (settings) {
    outScript = './src-deploy/public/' + settings.prodExport + outScript
  } else {
    outScript = './src-deploy/public/js/' + outScript
  }

  let tsConfig = 'tsconfig.json'

  let useCache = false // debug

  let plugins = [
    // new CleanWebpackPlugin(['src-deploy/public']),
    new HtmlWebpackPlugin({
      title: 'Development SGE',
      template: 'src-deploy/index.ejs',
    })
  ]

  if (useCache) {
    plugins.unshift(
      new HardSourceWebpackPlugin({
        // Either an absolute path or relative to output.path.
        cacheDirectory: 'node_modules/.cache/hard-source/[confighash]',
        // Either an absolute path or relative to output.path. Sets webpack's
        // recordsPath if not already set.
        recordsPath: 'node_modules/.cache/hard-source/[confighash]/records.json',
        // Either a string value or function that returns a string value.
        configHash: function (webpackConfig) {
          // Build a string value used by HardSource to determine which cache to
          // use if [confighash] is in cacheDirectory or if the cache should be
          // replaced if [confighash] does not appear in cacheDirectory.
          //
          // node-object-hash on npm can be used to build this.
          return require('node-object-hash')({
            sort: false
          }).hash(webpackConfig);
        },
        // This field determines when to throw away the whole cache if for
        // example npm modules were updated.
        environmentHash: {
          root: process.cwd(),
          directories: ['node_modules'],
          files: ['package.json'],
        },
      }),
    )
  }

  if (false === options.debug) {
    // plugins.unshift(new webpack.LoaderOptionsPlugin({
    //   minimize: true,
    //   debug: false,
    // }))
    // plugins.unshift(new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    // }))
  }

  let tsxLoaders = [`ts-loader?configFile=${tsConfig}`]

  let entry: any = [
    `./src/${inScript}`,
  ]

  let output: any = {
    filename: outScript,
  }

  let config = {

    entry,

    output,

    devtool: options.debug ? 'eval' : 'source-map',

    devServer: {
      contentBase: './src-deploy/',
      compress: true,
      port: port
    },

    resolve: {

      extensions: ['.webpack.js', '.web.js', '.ts', '.js'],

      modules: [
        '.',
        'src',
        'node_modules',
      ],

      plugins: [
        // Not currently needed or working
        // new TsConfigPathsPlugin(/* { tsconfig, compiler } */)
      ],

    },

    plugins,

    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: [
            /node_modules/,
          ],
          loaders: tsxLoaders,
        },
        // // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        // {
        //   enforce: 'pre',
        //   test: /\.js$/,
        //   loader: "source-map-loader",
        //   exclude: [
        //     /node_modules/
        //   ]
        // }
      ],
    },

  }
  return config
}

