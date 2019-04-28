"use strict";
exports.__esModule = true;
var webpack_common_1 = require("./webpack-common");
var config = webpack_common_1.buildConfig('development', {
    port: 8888,
    debug: true,
    inScript: 'game-ludum-dare-44.ts'
});
exports["default"] = config;
