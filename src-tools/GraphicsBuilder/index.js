#!/usr/bin/env ts-node
"use strict";
exports.__esModule = true;
var _ = require("lodash");
var fs = require('fs');
var chokidar = require('chokidar');
var chalk = require('chalk');
var program = require('commander');
var exec = require('child_process').exec;
var path = require('path');
console.log(chalk.bold.cyan('-.-'));
console.log(chalk.bold.green("~Stevie Bushman Presents~"));
console.log('Graphics Builder - watch and convert asesprite files to png - v0.0.3');
// print args
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});
//let watchPath = `C:/dev/stevieweb/SimpleGameEngine/src-resources/images/`
//let outPath = `C:/dev/stevieweb/SimpleGameEngine/src-deploy/public/images/`
//let inPathPacked = `C:/dev/stevieweb/SimpleGameEngine/src-deploy/public/images/`
//let outPathPacked = `C:/dev/stevieweb/SimpleGameEngine/src-deploy/public/images-packed/`
var watchPath = "C:\\dev-prarie-snail\\Speedy-Snail-Game-Engine\\src-resources\\ludumDare40\\images\\";
var outPath = "C:\\dev-prarie-snail\\Speedy-Snail-Game-Engine\\src-deploy\\public\\ludumDare40\\images\\";
var inPathPacked = "C:\\dev-prarie-snail\\Speedy-Snail-Game-Engine\\src-deploy\\public\\ludumDare40\\images\\";
var outPathPacked = "C:\\dev-prarie-snail\\Speedy-Snail-Game-Engine\\src-deploy\\public\\ludumDare40\\images-packed\\";
var doPack = true;
var mode = 'convert-only';
var verbose = false;
var aseSpritePath = '"C:\\Program Files (x86)\\Aseprite\\aseprite.exe"';
var watchGlob = watchPath + '**/*.ase';
var texturePackerPath = '"C:\\Program Files\\CodeAndWeb\\TexturePacker\\bin\\TexturePacker.exe"';
function run() {
    // TODO: command line args
    program
        .arguments('<file>')
        .option('-n, --narm <narm>', 'Your name')
        .action(function (file, options) {
    })
        .parse(process.argv);
    // Stuff that is always done
    var glob = watchGlob;
    watch(glob);
    console.log('Watching for: ', glob);
}
function watch(glob) {
    // Initialize watcher.
    var watcher = chokidar.watch(glob, {
        persistent: true
    });
    // Something to use when events are received.
    var log = console.log.bind(console);
    // Add event listeners.
    watcher
        .on('add', function (loc) { return onWatchEvent(loc, 'added'); })
        .on('change', function (loc) { return onWatchEvent(loc, 'changed'); });
}
function onWatchEvent(loc, type) {
    var originalFilePath = loc;
    var originalFilePathWithoutExtension = loc.slice(0, -path.extname(loc).length);
    var dir = originalFilePath.substring(watchPath.length);
    if (dir.lastIndexOf('\\') != -1) {
        dir = dir.substring(0, dir.lastIndexOf('\\')) + '\\';
    }
    else {
        dir = '';
    }
    // console.log('dir', dir)
    var fileName = path.basename(originalFilePathWithoutExtension);
    var filePath = path.join(outPath, dir + fileName) + '.png';
    if (dir) {
        fileName = dir + fileName;
        // filePath = dir + '\\' + filePath
    }
    var args = "--batch \"" + originalFilePath + "\" --save-as \"" + filePath + "\"";
    var cmd = aseSpritePath + ' ' + args;
    if (verbose) {
        console.log('exe', cmd);
    }
    else {
        console.log(' => ' + fileName);
    }
    exec(cmd, function (error, stdout, stderr) {
        // command output is in stdout
        if (error) {
            console.log('error', error);
            return;
        }
        if (verbose) {
            console.log('ase => ', stdout, stderr);
        }
        if (doPack) {
            _throttled_runPacker();
        }
    });
}
var _throttled_runPacker = _.throttle(runPacker, 1000, { leading: false, trailing: true });
function runPacker() {
    console.log('running texture packer');
    _pack(inPathPacked + 'gui/', outPathPacked, "gui.json", "gui.png");
}
function _pack(inPath, outPath, outJson, outPng) {
    var scale = 1;
    var args = "--data " + (outPath + outJson) + " --format json --sheet " + (outPath + outPng) + " --force-squared --scale " + scale + " --scale-mode fast --width 512 --height 512 --border-padding 2 --shape-padding 2 --padding 2 --trim-mode Trim --trim-sprite-names --disable-rotation " + inPath;
    var cmd = texturePackerPath + ' ' + args;
    console.log('exe', cmd);
    exec(cmd, function (error, stdout, stderr) {
        // command output is in stdout
        if (error) {
            console.log('error', error);
            return;
        }
        console.log('pack => ', stdout, stderr);
    });
}
run();
