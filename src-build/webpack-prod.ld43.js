"use strict";
exports.__esModule = true;
var webpack_common_1 = require("./webpack-common");
var currentGame_1 = require("./currentGame");
var config = webpack_common_1.buildConfig('production', {
    port: 8889,
    debug: false,
    inScript: 'game-ludum-dare-43.ts',
    outDir: 'shelter'
}, currentGame_1.settings);
exports["default"] = config;
