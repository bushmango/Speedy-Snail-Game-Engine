"use strict";
/*tslint:disable:no-var-requires*/
exports.__esModule = true;
var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
function buildConfig(mode, options, settings) {
    var port = options.port, debug = options.debug;
    var inScript = 'game.ts';
    var outScript = 'game.bundle.js';
    if (settings) {
        outScript = './src-deploy/public/' + settings.prodExport + outScript;
    }
    else {
        outScript = './src-deploy/public/js/' + outScript;
    }
    var tsConfig = 'tsconfig.json';
    var useCache = false; // debug
    var plugins = [
        // new CleanWebpackPlugin(['src-deploy/public']),
        new HtmlWebpackPlugin({
            title: 'Development SGE',
            template: 'src-deploy/index.ejs'
        })
    ];
    if (useCache) {
        plugins.unshift(new HardSourceWebpackPlugin({
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
                files: ['package.json']
            }
        }));
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
    var tsxLoaders = ["ts-loader?configFile=" + tsConfig];
    var entry = [
        "./src/" + inScript,
    ];
    var output = {
        filename: outScript
    };
    var config = {
        entry: entry,
        output: output,
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
            ]
        },
        plugins: plugins,
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: [
                        /node_modules/,
                    ],
                    loaders: tsxLoaders
                },
            ]
        }
    };
    return config;
}
exports.buildConfig = buildConfig;
