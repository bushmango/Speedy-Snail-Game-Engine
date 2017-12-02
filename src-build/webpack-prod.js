"use strict";
exports.__esModule = true;
var webpack_common_1 = require("./webpack-common");
var config = webpack_common_1.buildConfig('production', {
    port: 8889,
    debug: false
});
exports["default"] = config;
