#!/usr/bin/env ts-node
"use strict";
exports.__esModule = true;
var fs = require('fs');
var chokidar = require('chokidar');
var chalk = require('chalk');
var program = require('commander');
var _ = require("lodash");
console.log(chalk.bold.cyan('-.-'));
console.log(chalk.bold.green("~Stevie Bushman Presents~"));
console.log('Sounds Builder - watch and convert sounds - v0.0.3');
var verbose = false;
var mode = 'sprite';
var ffmpegPath = 'C:/dev/tools/ffmpeg-3.3.3-win64-static/bin/ffmpeg.exe';
var watchPath = "C:/dev/stevieweb/SimpleGameEngine/src-resources/sounds/sprite1/";
var outPath = "C:/dev/stevieweb/SimpleGameEngine/src-deploy/public/sounds/";
var watchGlob = watchPath + '*.wav';
function run() {
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
var exec = require('child_process').exec;
var path = require('path');
function onWatchEvent(loc, type) {
    console.log(type, loc);
    if (mode === 'convert') {
        var originalFilePath = loc;
        var originalFilePathWithoutExtension = loc.slice(0, -path.extname(loc).length);
        var fileName = path.basename(originalFilePathWithoutExtension);
        var filePath = path.join(outPath, fileName);
        // let args1 = `-y -i "${originalFilePath}" -acodec libmp3lame "${filePath}.mp3"`
        var args1 = "-y -i \"" + originalFilePath + "\" -c:a aac -b:a 160k \"" + filePath + ".aac\"";
        var args2 = "-y -i \"" + originalFilePath + "\" -acodec libvorbis -aq 4 \"" + filePath + ".ogg\"";
        runCommand(ffmpegPath, args1, 'to aac', filePath);
        runCommand(ffmpegPath, args2, 'to ogg', filePath);
    }
    if (mode === 'sprite') {
        _throttled_createSprite();
    }
}
function runCommand(pathToProgram, args, prefix, friendlyName) {
    var cmd = pathToProgram + ' ' + args;
    console.log('start', prefix, friendlyName);
    if (verbose) {
        console.log('exe', cmd);
    }
    exec(cmd, function (error, stdout, stderr) {
        // command output is in stdout
        if (error) {
            console.log('error =>', error);
        }
        if (verbose) {
            console.log(prefix + ' => ', stdout, stderr);
        }
        console.log('done ', prefix, friendlyName);
    });
}
function createSprite() {
    // Audiosprite test
    console.log('creating sprite');
    var path = watchPath;
    var files = [];
    fs.readdir(path, function (err, items) {
        for (var i = 0; i < items.length; i++) {
            var file = path + items[i];
            if ((/.wav$/).test(file.toLowerCase())) {
                console.log("+", file);
                files.push(file);
            }
            // fs.stat(file, function (f) {
            //   return function (err, stats) {
            //     console.log(f);
            //     console.log(stats["size"]);
            //   }
            // }(file));
        }
        var opts = {
            output: outPath + 'audioSprite',
            format: 'howler'
        };
        var audiosprite = require('audiosprite');
        audiosprite(files, opts, function (err, obj) {
            if (err) {
                console.error(err);
                return;
            }
            console.log(JSON.stringify(obj, null, 2));
            obj.urls = [
                "public/sounds/audioSprite.ogg",
                "public/sounds/audioSprite.m4a",
                "public/sounds/audioSprite.mp3",
                "public/sounds/audioSprite.ac3",
            ];
            console.log(JSON.stringify(obj, null, 2));
            var jsonfile = require('jsonfile');
            var file = outPath + 'audioSprite.json';
            jsonfile.writeFileSync(file, obj, { spaces: 2 });
        });
    });
}
var _throttled_createSprite = _.throttle(createSprite, 500, { leading: false, trailing: true });
run();